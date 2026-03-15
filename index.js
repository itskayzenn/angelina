import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useMultiFileAuthState } from "@adiwajshing/baileys";
import { config } from "./config.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";
import { addXp, getUser, initDb, loadDb, saveDb } from "./lib/db.js";

const store = makeInMemoryStore({});
const commands = new Map();
const pairingCodes = new Map();
let db = null;

function normalizeJid(jid) {
  return (jid || "").split("@")[0];
}

function isOwner(jid) {
  const norm = normalizeJid(jid);
  const owners = (db?.owners ?? config.owners) || [];
  return owners.some((o) => normalizeJid(o) === norm || o === jid);
}

function isPremium(jid) {
  const norm = normalizeJid(jid);
  const premium = (db?.premium ?? config.premiumUsers) || [];
  return premium.some((p) => normalizeJid(p) === norm || p === jid);
}

function getChatType(jid) {
  if (!jid) return "private";
  if (jid.endsWith("@g.us")) return "group";
  return "private";
}

function parseCommand(text) {
  const parts = text.trim().split(/\s+/);
  const raw = parts[0] || "";
  const prefix = raw.slice(0, 1);

  if (!config.prefixes.includes(prefix)) return null;

  const name = raw.slice(1).toLowerCase();
  const args = parts.slice(1);
  return { name, args, prefix };
}

async function downloadMedia(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = Buffer.from(await res.arrayBuffer());
    const mime = res.headers.get("content-type") ?? "application/octet-stream";
    return { buffer, mime };
  } catch {
    return null;
  }
}

async function loadCommands(dir = join(process.cwd(), "commands")) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await loadCommands(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".js")) continue;

    try {
      const mod = await import(pathToFileURL(fullPath).href);
      const cmd = mod.default;
      if (!cmd || !cmd.name) continue;

      // Assign category based on folder name (if any)
      const category = dir === join(process.cwd(), "commands") ? "general" : dir.split(/[/\\]/).pop();
      cmd.category = cmd.category || category;

      commands.set(cmd.name, cmd);
      if (Array.isArray(cmd.aliases)) {
        for (const alias of cmd.aliases) {
          commands.set(alias, cmd);
        }
      }
    } catch (err) {
      console.error("Failed to load command", fullPath, err);
    }
  }
}

async function executeCommand(sock, sender, command, chatType, msg) {
  if (db?.banned?.includes(normalizeJid(sender))) {
    return; // ignore banned users entirely
  }

  const cmd = commands.get(command.name);
  if (!cmd) {
    return sock.sendMessage(sender, { text: config.responses.unknown });
  }

  const isOwnerUser = isOwner(sender);
  if (cmd.options.ownerOnly && !isOwnerUser) {
    return sock.sendMessage(sender, { text: config.responses.ownerOnly });
  }

  if (cmd.options.premiumOnly && !isPremium(sender) && !isOwnerUser) {
    return sock.sendMessage(sender, { text: config.responses.premiumOnly });
  }

  if (cmd.options.chat === "private" && chatType !== "private") {
    return sock.sendMessage(sender, { text: config.responses.privateOnly });
  }

  if (cmd.options.chat === "group" && chatType !== "group") {
    return sock.sendMessage(sender, { text: config.responses.groupOnly });
  }

  const quoted = msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage ?? null;

  const send = async (message) => {
    return sock.sendMessage(sender, message);
  };

  try {
    await cmd.execute({
      sock,
      sender,
      chatId: sender,
      args: command.args,
      chatType,
      send,
      config,
      commands,
      db,
      saveDb,
      pairingCodes,
      generatePairingCode: (length) => {
        let code = "";
        while (code.length < length) {
          code += Math.floor(Math.random() * 10).toString();
        }
        return code.slice(0, length);
      },
      downloadMedia,
      downloadQuotedMedia: async () => {
        if (!quoted) return null;
        try {
          const buffer = await sock.downloadMediaMessage(quoted, "buffer");
          const mime = quoted.imageMessage ? "image/jpeg" : quoted.videoMessage ? "video/mp4" : "application/octet-stream";
          return { buffer, mime };
        } catch {
          return null;
        }
      },
      msg,
      quoted,
    });
  } catch (err) {
    console.error("Command failed", command.name, err);
    await send({ text: `Terjadi kesalahan: ${err.message}` });
  }
}

async function startReminderLoop(sock) {
  setInterval(async () => {
    if (!db?.reminders?.length) return;

    const now = Date.now();
    const due = db.reminders.filter((r) => r.when <= now);

    for (const reminder of due) {
      await sock.sendMessage(reminder.chatId, { text: `⏰ Reminder: ${reminder.text}` });
      db.reminders = db.reminders.filter((r) => r.id !== reminder.id);
    }

    await saveDb(db);
  }, 30_000); // cek setiap 30 detik
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  await initDb();
  db = await loadDb();
  await loadCommands();

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using WA version ${version.join(".")} (isLatest: ${isLatest})`);

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true,
    logger: (level, ...args) => {
      if (level === "error") console.error(...args);
    },
  });

  store.bind(sock.ev);
  await startReminderLoop(sock);

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log("connection closed", lastDisconnect?.error, "- reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp multi-device (MD)");
    }
  });

  sock.ev.on("group-participants.update", async (update) => {
    const groupId = update.id;
    if (!db?.welcome) return;

    const welcomeText = db.welcome[groupId];
    if (!welcomeText) return;

    for (const participant of update.participants) {
      if (update.action === "add") {
        await sock.sendMessage(groupId, { text: welcomeText.replace(/\{user\}/g, participant) });
      }
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg || msg.key.fromMe) return;

    const messageType = Object.keys(msg.message || {})[0];
    const sender = msg.key.remoteJid;

    console.log(`
📩 Incoming message from: ${sender}
   type: ${messageType}
   id: ${msg.key.id}
`);

    if (messageType === "conversation" || messageType === "extendedTextMessage") {
      const text = msg.message.conversation || msg.message.extendedTextMessage.text;

      if (typeof text === "string") {
        const trimmed = text.trim();
        const cmd = parseCommand(trimmed);
        const chatType = getChatType(sender);

        // Auto-responder
        if (!cmd && Array.isArray(config.autoresponders)) {
          const lower = trimmed.toLowerCase();
          for (const item of config.autoresponders) {
            if (lower.includes(item.match.toLowerCase())) {
              await sock.sendMessage(sender, { text: item.response });
              break;
            }
          }
        }

        // XP / leveling
        if (config.leveling?.enabled) {
          const gained = cmd ? config.leveling.xpPerCommand : config.leveling.xpPerMessage;
          const levelUp = addXp(db, sender, gained);
          if (levelUp) {
            const user = getUser(db, sender);
            const msgText = config.leveling.levelUpMessage
              .replace("{user}", sender)
              .replace("{level}", String(user.level));
            await sock.sendMessage(sender, { text: msgText });
            await saveDb(db);
          }
        }

        if (cmd) {
          await executeCommand(sock, sender, cmd, chatType, msg);
          return;
        }

        await sock.sendMessage(sender, { text: `Anda mengirim: ${trimmed}` });
      }
    }
  });
}

startBot().catch((err) => {
  console.error("Fatal error", err);
  process.exit(1);
});

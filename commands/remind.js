import { randomUUID } from "crypto";

export default {
  name: "remind",
  description: "Set reminder (contoh: ?remind 10m minum air)",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, args, db, saveDb, chatId }) {
    if (args.length < 2) {
      return send({ text: "Format: ?remind <waktu> <pesan>. Contoh: ?remind 10m minum air" });
    }

    const timeArg = args[0];
    const text = args.slice(1).join(" ");

    const match = timeArg.match(/^(\d+)([smh])$/);
    if (!match) {
      return send({ text: "Waktu tidak valid. Gunakan format 10s / 10m / 1h." });
    }

    const amount = Number(match[1]);
    const unit = match[2];
    let ms = amount * 1000;
    if (unit === "m") ms = amount * 60_000;
    if (unit === "h") ms = amount * 3_600_000;

    const when = Date.now() + ms;
    const id = randomUUID();

    db.reminders = db.reminders || [];
    db.reminders.push({ id, chatId, text, when });
    await saveDb(db);

    return send({ text: `Reminder dibuat (akan dikirim dalam ${timeArg}).` });
  },
};

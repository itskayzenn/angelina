import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { MongoClient } from "mongodb";
import { config } from "../config.js";

const DB_DIR = join(process.cwd(), "data");
const JSON_PATH = join(DB_DIR, "users.json");

const DEFAULT_DB = {
  owners: [],
  premium: [],
  banned: [],
  reminders: [],
  welcome: {},
  users: {},
};

let sqliteDb = null;
let mongoClient = null;

export async function initDb() {
  if (config.database.type === "sqlite") {
    await mkdir(DB_DIR, { recursive: true });
    sqliteDb = await open({
      filename: join(process.cwd(), config.database.sqlite.file),
      driver: sqlite3.Database,
    });

    await sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        jid TEXT PRIMARY KEY,
        data TEXT
      );
    `);
  }

  if (config.database.type === "mongo") {
    mongoClient = new MongoClient(config.database.mongo.uri);
    await mongoClient.connect();
  }
}

export async function loadDb() {
  if (config.database.type === "sqlite") {
    const rows = await sqliteDb.all("SELECT jid, data FROM users");
    const db = { ...DEFAULT_DB };
    for (const row of rows) {
      try {
        db.users[row.jid] = JSON.parse(row.data);
      } catch {
        // ignore
      }
    }
    return db;
  }

  if (config.database.type === "mongo") {
    const db = await mongoClient.db(config.database.mongo.db);
    const col = db.collection("users");
    const docs = await col.find().toArray();
    const base = { ...DEFAULT_DB };
    for (const doc of docs) {
      if (!doc.jid) continue;
      base.users[doc.jid] = doc.data || {};
    }
    return base;
  }

  // default: json
  try {
    await mkdir(DB_DIR, { recursive: true });
    const raw = await readFile(JSON_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_DB, ...parsed };
  } catch {
    return { ...DEFAULT_DB };
  }
}

export async function saveDb(db) {
  if (config.database.type === "sqlite") {
    // persist only per-user data
    for (const [jid, data] of Object.entries(db.users || {})) {
      await sqliteDb.run(
        "INSERT OR REPLACE INTO users (jid, data) VALUES (?, ?)",
        jid,
        JSON.stringify(data)
      );
    }
    return;
  }

  if (config.database.type === "mongo") {
    const db = mongoClient.db(config.database.mongo.db);
    const col = db.collection("users");
    for (const [jid, data] of Object.entries(db.users || {})) {
      await col.updateOne({ jid }, { $set: { data } }, { upsert: true });
    }
    return;
  }

  await mkdir(DB_DIR, { recursive: true });
  await writeFile(JSON_PATH, JSON.stringify(db, null, 2), "utf8");
}

export function getUser(db, jid) {
  db.users = db.users || {};
  if (!db.users[jid]) {
    db.users[jid] = { xp: 0, level: 0, roles: [] };
  }
  return db.users[jid];
}

export function setUser(db, jid, user) {
  db.users = db.users || {};
  db.users[jid] = user;
}

export function addXp(db, jid, amount) {
  const user = getUser(db, jid);
  user.xp += amount;
  const nextLevelXp = Math.floor(100 * Math.pow(1.3, user.level));
  if (user.xp >= nextLevelXp) {
    user.level += 1;
    user.xp -= nextLevelXp;
    return true;
  }
  return false;
}

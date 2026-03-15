export const config = {
  // Bot identity
  botName: "KayzenBot",

  // Supported command prefixes (first character of a message)
  // This allows commands like ".ping", "/help", "?add", "#info", "@pair", etc.
  prefixes: [".", "/", "?", "\\", "|", "#", "@"],

  // WhatsApp number(s) allowed to control the bot (without @s.whatsapp.net)
  // Example: ["628123456789", "628987654321"]
  // Empty array = allow anyone.
  owners: ["628152313006"],

  // Users with premium access (can run premium-only commands)
  premiumUsers: [],

  // Pairing code settings
  pairing: {
    // Length of the randomly generated pairing code
    codeLength: 6,
    // Time in seconds that the pairing code remains valid
    ttlSeconds: 300,
  },

  // Database settings (json/sqlite/mongo)
  database: {
    type: "json", // "json" | "sqlite" | "mongo"
    sqlite: {
      file: "data/kayzen.sqlite",
    },
    mongo: {
      uri: "mongodb://localhost:27017",
      db: "kayzen",
    },
  },

  // Social / website links
  socials: {
    website: "https://kayzen-izumi.vercel.app",
    instagram: "https://instagram.com/kayzenfry",
    twitter: "https://twitter.com/kayzenfry",
    youtube: "https://youtube.com/kayzenfry",
  },

  // Thumbnail URLs (small/large) for any use in help or profile responses
  thumbnail: {
    small: "https://i.pinimg.com/736x/66/5a/c6/665ac60934512bb8eb591856493a622c.jpg",
    large: "https://i.pinimg.com/736x/28/0c/50/280c50a99a9651c85967904b02babafc.jpg",
  },

  // Level / XP settings
  leveling: {
    enabled: true,
    xpPerMessage: 5,
    xpPerCommand: 10,
    levelUpMessage: "Selamat {user}, kamu naik level menjadi {level}!",
  },

  // Auto-responder (trigger: response)
  autoresponders: [
    { match: "halo", response: "Halo! Ada yang bisa saya bantu?" },
    { match: "bot", response: "Ya, saya bot. Ketik ?help untuk perintah." },
  ],

  // Default responses
  responses: {
    ping: "pong",
    unknown: "Perintah tidak dikenali. Ketik ?help untuk daftar perintah.",
    help:
      "Perintah tersedia:\n" +
      "- ?ping: tes respons\n" +
      "- ?help: tampilkan bantuan\n" +
      "- ?add <a> <b>: jumlahkan dua angka\n" +
      "- ?pinterest <url>: download Pinterest (contoh)\n" +
      "- ?asupan: ambil random asupan (contoh)\n" +
      "- ?info: tampilkan link sosial & web\n" +
      "- ?pair: generate pairing code\n" +
      "- ?verify <code>: verifikasi pairing code",
    missingArgs: "Argumen tidak lengkap. Ketik ?help untuk info perintah.",
    invalidArgs: "Tipe argumen tidak valid. Pastikan menggunakan angka.",
    pairingGenerated: "Pairing code Anda: %CODE% (berlaku %TTL% detik)",
    pairingSuccess: "Pairing berhasil!",
    pairingInvalid: "Kode pairing tidak valid atau sudah kadaluarsa.",
    ownerOnly: "Hanya owner yang boleh menggunakan perintah ini.",
    premiumOnly: "Hanya pengguna premium yang boleh menggunakan perintah ini.",
    privateOnly: "Perintah ini hanya dapat digunakan di chat pribadi.",
    groupOnly: "Perintah ini hanya dapat digunakan di grup.",
  },
};

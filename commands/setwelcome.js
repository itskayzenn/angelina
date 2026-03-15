export default {
  name: "setwelcome",
  description: "Atur pesan welcome untuk grup (owner only, group only)",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "group" },
  async execute({ send, args, db, saveDb, chatId }) {
    if (!args.length) return send({ text: "Masukkan pesan welcome setelah perintah." });

    const message = args.join(" ");
    db.welcome = db.welcome || {};
    db.welcome[chatId] = message;
    await saveDb(db);

    return send({ text: `Pesan welcome berhasil diatur untuk grup ini.` });
  },
};

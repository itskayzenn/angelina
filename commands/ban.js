export default {
  name: "ban",
  description: "Ban user dari menggunakan bot (owner only)",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "any" },
  async execute({ send, args, db, saveDb }) {
    if (!args[0]) return send({ text: "Masukkan nomor WA (tanpa @s.whatsapp.net)." });

    const jid = args[0];
    if (!db.banned.includes(jid)) {
      db.banned.push(jid);
      await saveDb(db);
    }

    return send({ text: `Berhasil banned ${jid}.` });
  },
};

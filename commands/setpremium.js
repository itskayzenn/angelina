export default {
  name: "setpremium",
  description: "Tambahkan user ke daftar premium (owner only)",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "any" },
  async execute({ send, args, db, saveDb }) {
    if (!args[0]) return send({ text: "Masukkan nomor WA (tanpa @s.whatsapp.net)." });

    const jid = args[0];
    if (!db.premium.includes(jid)) {
      db.premium.push(jid);
      await saveDb(db);
    }

    return send({ text: `Berhasil menambahkan ${jid} sebagai premium.` });
  },
};

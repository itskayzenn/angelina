export default {
  name: "unban",
  description: "Hapus ban user (owner only)",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "any" },
  async execute({ send, args, db, saveDb }) {
    if (!args[0]) return send({ text: "Masukkan nomor WA (tanpa @s.whatsapp.net)." });

    const jid = args[0];
    db.banned = db.banned.filter((x) => x !== jid);
    await saveDb(db);

    return send({ text: `Berhasil menghapus ban ${jid}.` });
  },
};

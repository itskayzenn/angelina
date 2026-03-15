export default {
  name: "removepremium",
  description: "Hapus user dari daftar premium (owner only)",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "any" },
  async execute({ send, args, db, saveDb }) {
    if (!args[0]) return send({ text: "Masukkan nomor WA (tanpa @s.whatsapp.net)." });

    const jid = args[0];
    db.premium = db.premium.filter((x) => x !== jid);
    await saveDb(db);

    return send({ text: `Berhasil menghapus ${jid} dari premium.` });
  },
};

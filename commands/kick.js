export default {
  name: "kick",
  description: "Keluarkan user dari grup (owner only, group only)",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "group" },
  async execute({ sock, send, args, chatType, chatId }) {
    if (chatType !== "group") return send({ text: "Perintah ini hanya bisa dijalankan di grup." });
    if (!args[0]) return send({ text: "Masukkan nomor WA target (tanpa @s.whatsapp.net)." });

    const target = args[0].includes("@") ? args[0] : `${args[0]}@s.whatsapp.net`;
    try {
      await sock.groupParticipantsUpdate(chatId, [target], "remove");
      return send({ text: `Berhasil mengeluarkan ${target}` });
    } catch (err) {
      return send({ text: `Gagal mengeluarkan: ${err.message}` });
    }
  },
};

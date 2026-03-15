export default {
  name: "group",
  description: "Perintah khusus grup",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "group" },
  async execute({ send }) {
    await send({ text: "Perintah ini hanya bisa dijalankan di grup." });
  },
};

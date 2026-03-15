export default {
  name: "private",
  description: "Perintah khusus chat pribadi",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "private" },
  async execute({ send }) {
    await send({ text: "Perintah ini hanya bisa dijalankan di chat pribadi." });
  },
};

export default {
  name: "owner",
  description: "Perintah khusus owner",
  aliases: [],
  options: { ownerOnly: true, premiumOnly: false, chat: "any" },
  async execute({ send }) {
    await send({ text: "Ini perintah khusus owner." });
  },
};

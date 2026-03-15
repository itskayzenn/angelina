export default {
  name: "premium",
  description: "Perintah khusus premium",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: true, chat: "any" },
  async execute({ send }) {
    await send({ text: "Ini hanya untuk pengguna premium." });
  },
};

export default {
  name: "ping",
  description: "Tes respons bot",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send }) {
    await send({ text: "pong" });
  },
};

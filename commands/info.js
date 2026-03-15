export default {
  name: "info",
  description: "Tampilkan link sosial & thumbnail bot",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, config }) {
    const socials = config.socials;
    const thumb = config.thumbnail;

    const lines = [
      `Nama bot: ${config.botName}`,
      `Website: ${socials.website}`,
      `Instagram: ${socials.instagram}`,
      `Twitter: ${socials.twitter}`,
      `YouTube: ${socials.youtube}`,
      `Thumbnail kecil: ${thumb.small}`,
      `Thumbnail besar: ${thumb.large}`,
    ];

    await send({ text: lines.join("\n") });
  },
};

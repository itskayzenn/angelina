export default {
  name: "menu",
  description: "Tampilkan menu interaktif (buttons)",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, config }) {
    const buttons = [
      { buttonId: `${config.prefixes[0]}ping`, buttonText: { displayText: "Ping" }, type: 1 },
      { buttonId: `${config.prefixes[0]}help`, buttonText: { displayText: "Help" }, type: 1 },
      { buttonId: `${config.prefixes[0]}info`, buttonText: { displayText: "Info" }, type: 1 },
    ];

    await send({
      text: "Pilih perintah:",
      footer: "Menu Interaktif",
      buttons,
      headerType: 1,
    });
  },
};

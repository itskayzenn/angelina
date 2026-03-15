import typr from "typr";

export default {
  name: "add",
  description: "Jumlahkan dua angka",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, args, config }) {
    if (args.length < 2) {
      return send({ text: config.responses.missingArgs });
    }

    const a = Number(args[0]);
    const b = Number(args[1]);
    if (!typr.isNumber(a) || !typr.isNumber(b) || Number.isNaN(a) || Number.isNaN(b)) {
      return send({ text: config.responses.invalidArgs });
    }

    return send({ text: `Hasil: ${a + b}` });
  },
};

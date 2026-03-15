export default {
  name: "verify",
  description: "Verifikasi pairing code yang dibuat sebelumnya",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, pairingCodes, args, config }) {
    if (!args[0]) {
      return send({ text: config.responses.missingArgs });
    }

    const code = args[0];
    const record = pairingCodes.get(code);

    if (!record || record.expiresAt < Date.now()) {
      pairingCodes.delete(code);
      return send({ text: config.responses.pairingInvalid });
    }

    pairingCodes.delete(code);
    return send({ text: config.responses.pairingSuccess });
  },
};

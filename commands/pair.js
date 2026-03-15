export default {
  name: "pair",
  description: "Generate pairing code (temporary)",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, pairingCodes, generatePairingCode, config, sender }) {
    const code = generatePairingCode(config.pairing.codeLength);
    const expiresAt = Date.now() + config.pairing.ttlSeconds * 1000;
    pairingCodes.set(code, { expiresAt, owner: sender });

    const message = config.responses.pairingGenerated
      .replace("%CODE%", code)
      .replace("%TTL%", String(config.pairing.ttlSeconds));

    return send({ text: message });
  },
};

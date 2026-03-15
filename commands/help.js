export default {
  name: "help",
  description: "Tampilkan daftar perintah",
  aliases: ["h"],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, commands, config }) {
    const prefixList = config.prefixes.join(" ");
    const lines = [
      `Perintah (prefix: ${prefixList}):`,
      "(owner = 🔒, premium = ⭐, group = 👥, private = 📩)",
    ];

    const byCategory = new Map();
    const seen = new Set();

    for (const cmd of commands.values()) {
      if (seen.has(cmd.name)) continue;
      seen.add(cmd.name);

      const category = cmd.category || "general";
      if (!byCategory.has(category)) byCategory.set(category, []);
      byCategory.get(category).push(cmd);
    }

    for (const [category, cmds] of byCategory.entries()) {
      lines.push(`\n== ${category.toUpperCase()} ==`);

      for (const cmd of cmds) {
        const tags = [];
        if (cmd.options.ownerOnly) tags.push("🔒");
        if (cmd.options.premiumOnly) tags.push("⭐");
        if (cmd.options.chat === "group") tags.push("👥");
        if (cmd.options.chat === "private") tags.push("📩");

        const tagString = tags.length ? ` ${tags.join("")}` : "";
        lines.push(`- ${cmd.name}${tagString}: ${cmd.description}`);
      }
    }

    await send({ text: lines.join("\n") });
  },
};

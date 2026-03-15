import { getUser } from "../lib/db.js";

export default {
  name: "level",
  description: "Tampilkan level dan XP kamu",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, sender, db }) {
    const user = getUser(db, sender);
    const nextXp = Math.floor(100 * Math.pow(1.3, user.level));
    return send({ text: `Level: ${user.level}\nXP: ${user.xp}/${nextXp}` });
  },
};

import sharp from "sharp";

export default {
  name: "sticker",
  description: "Buat sticker dari URL gambar atau gambar reply (convert ke webp)",
  aliases: ["stik"],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, args, downloadMedia, downloadQuotedMedia, quoted }) {
    let media = null;

    if (quoted) {
      media = await downloadQuotedMedia();
    }

    if (!media && args[0]) {
      media = await downloadMedia(args[0]);
    }

    if (!media) return send({ text: "Gunakan: ?sticker <url_gambar> atau balas gambar dengan ?sticker" });

    if (!media.mime.startsWith("image/")) {
      return send({ text: "URL bukan gambar yang valid." });
    }

    try {
      const webpBuffer = await sharp(media.buffer).webp({ lossless: true }).toBuffer();
      return send({ sticker: webpBuffer });
    } catch (err) {
      return send({ text: `Gagal membuat sticker: ${err.message}` });
    }
  },
};

export default {
  name: "asupan",
  description: "Ambil random asupan via API",
  aliases: [],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, downloadMedia }) {
    try {
      const res = await fetch("https://api.deline.web.id/random/asupan");
      const data = await res.json().catch(() => null);

      if (!data?.url) {
        return send({ text: `Response tidak valid:\n${JSON.stringify(data, null, 2)}` });
      }

      const media = await downloadMedia(data.url);
      if (!media) {
        return send({ text: `Gagal mengunduh media: ${data.url}` });
      }

      const message = {
        caption: "Asupan random",
      };

      if (media.mime.startsWith("image/")) message.image = media.buffer;
      else if (media.mime.startsWith("video/")) message.video = media.buffer;
      else message.document = media.buffer;

      return send(message);
    } catch (err) {
      return send({ text: `Gagal mengambil asupan: ${err.message}` });
    }
  },
};

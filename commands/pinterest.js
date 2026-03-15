export default {
  name: "pinterest",
  description: "Download dari Pinterest via API (kirim URL pin)",
  aliases: ["pin"],
  options: { ownerOnly: false, premiumOnly: false, chat: "any" },
  async execute({ send, args, downloadMedia }) {
    if (!args[0]) return send({ text: "Masukkan URL Pinterest setelah perintah." });

    const query = encodeURIComponent(args[0]);
    const apiUrl = `https://api.deline.web.id/downloader/pinterest?url=${query}`;

    try {
      const res = await fetch(apiUrl);
      const data = await res.json().catch(() => null);

      const mediaUrl = data?.url ?? data?.result?.url;
      if (!mediaUrl) {
        return send({ text: `Tidak dapat menemukan media dari API.\nResponse: ${JSON.stringify(data, null, 2)}` });
      }

      const media = await downloadMedia(mediaUrl);
      if (!media) {
        return send({ text: `Gagal mengunduh media. Link: ${mediaUrl}` });
      }

      const message = {
        caption: "Hasil download Pinterest",
      };

      if (media.mime.startsWith("image/")) message.image = media.buffer;
      else if (media.mime.startsWith("video/")) message.video = media.buffer;
      else message.document = media.buffer;

      return send(message);
    } catch (err) {
      return send({ text: `Gagal mengambil data: ${err.message}` });
    }
  },
};

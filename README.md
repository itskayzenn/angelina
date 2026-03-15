# Kayzen WhatsApp Multi-Device Bot

Simple WhatsApp Multi-Device (MD) bot using **Baileys**.

## 🚀 Quick start

1. Install dependencies:

```bash
npm install
```

> ⚠️ **Note:** `@adiwajshing/baileys` relies on a dependency pulled via Git, so make sure **Git is installed** on your system (e.g., https://git-scm.com/).

2. Run the bot:

```bash
npm start
```

3. Scan the QR code in your terminal using WhatsApp (multi-device compatible).

## 🧠 How it works

- Uses `@adiwajshing/baileys` with **multi-file auth state** (`auth_info/`).
- Listens for inbound messages and replies with a basic echo/ping handler.

## ✨ Test the bot

Bot ini mendukung beberapa prefix perintah: `. / ? \ | # @` (misalnya `.ping`, `?help`, `#add`).

Contoh perintah:

- `.ping` → bot replies `pong`
- `?help` → bot balas daftar perintah dengan label (owner/premium/group/private)
- `#add 2 3` → bot replies dengan `Hasil: 5`
- `@pinterest https://pin.it/5kyisTgre` → download media Pinterest (dikirim sebagai media)
- `/asupan` → ambil random asupan (dikirim sebagai media)
- `?pair` → generate pairing code
- `?verify <code>` → verifikasi pairing code
- `?menu` → tampilkan menu interaktif (button)
- `?sticker <url>` → buat sticker dari gambar (convert ke webp)
- `?owner` → perintah khusus owner (konfigurasi `config.owners[]` atau `data/users.json`)
- `?premium` → perintah khusus premium (konfigurasi `config.premiumUsers[]` atau `data/users.json`)
- `?group` → perintah khusus grup (hanya bisa dipakai di grup)
- `?private` → perintah khusus chat pribadi (hanya bisa dipakai di chat pribadi)
- `?setpremium <nomor>` / `?removepremium <nomor>` → kelola list premium (owner only)
- `?ban <nomor>` / `?unban <nomor>` → ban/unban user (owner only)
- `?kick <nomor>` → kick member group (owner only)
- `?setwelcome <pesan>` → set pesan welcome untuk grup (owner only)
- `?remind 10m <pesan>` → set reminder (contoh: `?remind 10m minum air`)
- `?level` → cek level + XP
- `?sticker <url>` (atau balas gambar) → buat sticker (WebP)

Perintah menggunakan sistem modular (folder `commands/`).

Data pengguna (owner/premium/ban/reminder/welcome) disimpan di `data/users.json`.

## 📌 Notes

- `auth_info/` is ignored by Git, so your session stays local.
- If the session disconnects, the bot will attempt to reconnect.

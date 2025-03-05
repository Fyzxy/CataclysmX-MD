import fetch from "node-fetch";
import { format } from "util";
import path from "path";

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`NOTE: bisa gunakan https:// bisa juga http:// dan bisa juga tanpa keduanya (https:// dan http://)
*Bisa mendownload dan melihat file yang di short seperti shorturl.at/GHY58 atau short url lainnya (tinyurl, s.id, shorturl, dll)* \n
bisa mendownload dan menampilkan json, html, txt, image, pdf, dll. contoh: ${
      usedPrefix + command
    } Link/Url\n
|====================================|
${usedPrefix + command} shorturl.at/GHY58
${usedPrefix + command} si.ft.unmul.ac.id/modul_praktikum/8as0x4aConbSoi4lPy0D05PHemnX6x.pdf
${usedPrefix + command} cdn.i-joox.com/_next/static/chunks/130.9700ec051eee3adc4f5d.js
${usedPrefix + command} data.bmkg.go.id/DataMKG/TEWS/autogempa.json
${usedPrefix + command} tr.deployers.repl.co/robots.txt
${usedPrefix + command} tr.deployers.repl.co/sitemap.xml
${usedPrefix + command} api.duniagames.co.id/api/content/upload/file/7081780811647600895.png
${usedPrefix + command} medlineplus.gov/musclecramps.html
|====================================|\n
NOTE: Pokoknya masih banyak lagi, kalo error, hubungi +${global.nomorown}
coded by https://github.com/Fyzxy 
`);
  }

  // Cek apakah URL memiliki protokol (http/https)
  if (!/^https?:\/\//.test(text)) {
    text = "http://" + text;
  }

  let _url = new URL(text);
  let url = _url.href;

  let maxRedirects = 999999;
  let redirectCount = 0;
  let redirectUrl = url;

  while (redirectCount < maxRedirects) {
    let res = await fetch(redirectUrl);

    if (res.headers.get("content-length") > 100 * 1024 * 1024 * 1024) {
      res.body.destroy();
      throw `Content-Length: ${res.headers.get("content-length")}`;
    }

    const contentType = res.headers.get("content-type");
    const contentDisposition = res.headers.get("content-disposition");
    let filename;

    if (contentDisposition && contentDisposition.includes("filename=")) {
      filename = contentDisposition.split("filename=")[1].trim();
    } else if (contentDisposition) {
      filename = contentDisposition.replace(/^filename=/i, "").trim();
    } else {
      filename = path.basename(new URL(redirectUrl).pathname);
    }

    await conn.reply(m.chat, global.wait, m);

    // Menangani file berdasarkan tipe konten
    if (/^image\//.test(contentType)) {
      try {
        conn.sendFile(m.chat, redirectUrl, filename, text, m);
      } catch (err) {
        m.reply("Respons bukan gambar");
      }
    } else if (/^text\//.test(contentType)) {
      try {
        let txt = await res.text();
        m.reply(txt.slice(0, 65536) + "");
        conn.sendFile(m.chat, Buffer.from(txt), "file.txt", null, m);
      } catch (e) {
        m.reply("Respons bukan teks");
      }
    } else if (/^application\/json/.test(contentType)) {
      try {
        let txt = await res.json();
        txt = format(JSON.stringify(txt, null, 2));
        m.reply(txt.slice(0, 65536) + "");
        conn.sendFile(m.chat, Buffer.from(txt), "file.json", null, m);
      } catch (error) {
        m.reply("Respons bukan JSON");
      }
    } else if (/^text\/html/.test(contentType)) {
      try {
        let html = await res.text();
        conn.sendFile(m.chat, Buffer.from(html), "file.html", null, m);
      } catch (error) {
        m.reply("Respons bukan HTML");
      }
    } else if (/^audio\/mpeg/.test(contentType)) {
      try {
        // Get the audio file URL
        let filePath = redirectUrl;

        // Send the audio message
        await conn.sendMessage(m.chat, {
          audio: { url: filePath },
          mimetype: 'audio/mpeg',
        }, { quoted: m });
      } catch (error) {
        m.reply("Gagal mengirim audio/mpeg.");
      }
    } else {
      conn.sendFile(m.chat, redirectUrl, filename, text, m);
    }

    // Menangani redirect jika ada
    if (
      res.status === 301 ||
      res.status === 302 ||
      res.status === 307 ||
      res.status === 308
    ) {
      let location = res.headers.get("location");
      if (location) {
        redirectUrl = location;
        redirectCount++;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  if (redirectCount >= maxRedirects) {
    throw `Too many redirects (max: ${maxRedirects})`;
  }
};

handler.help = ['*get* <url>'];
handler.tags = ['tools'];
handler.command = /^(get)$/i;

export default handler;

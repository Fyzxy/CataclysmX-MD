/*
Jangan Hapus Wm Bang 

*Remini/Hd Image  Plugins Esm*

Barangkali Ada Yang Butuh 😗 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n/182
*/

import axios from 'axios';

function randomNumber() {
  let randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, '0');
}

async function upscale(buffer) {
  const blob = new Blob([buffer], { type: 'image/png' });
  let filename = randomNumber() + '.png';
  let formData = new FormData();
  formData.append('image', {});
  formData.append('image', blob, filename);

  let { data } = await axios.post('https://api.imggen.ai/guest-upload', formData, {
    headers: {
      "content-type": "multipart/form-data",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0"
    }
  });

  let result = await axios.post('https://api.imggen.ai/guest-upscale-image', {
    image: {
      "url": "https://api.imggen.ai" + data.image.url,
      "name": data.image.name,
      "original_name": data.image.original_name,
      "folder_name": data.image.folder_name,
      "extname": data.image.extname
    }
  }, {
    headers: {
      "content-type": "application/json",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0"
    }
  });

  return `https://api.imggen.ai${result.data.upscaled_image}`;
}

let handler = async (m, { conn }) => {
  try {
    await m.react('⌛');

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.startsWith('image/')) {
      throw 'Silakan kirim gambar dengan caption *hd/remini* atau reply gambar!';
    }

    let media = await q.download();
    if (!media) throw 'Gagal mengunduh gambar.';

    let upscaledUrl = await upscale(media);
    if (!upscaledUrl) throw 'Gagal melakukan Upscale gambar.';

    await m.react('✅');

    await conn.sendMessage(m.chat, {
      image: { url: upscaledUrl },
      caption: `*Done*`
    }, { quoted: m });

  } catch (error) {
    await m.react('❌');
    await conn.reply(m.chat, `❌ *Error:* ${error.message || error}`, m);
  }
};

handler.help = ['*hd* <send/reply your image with caption [hd]'];
handler.tags = ['tools'];
handler.command = /^(remini|hd)$/i;

export default handler;

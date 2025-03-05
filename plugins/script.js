

import axios from 'axios';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (command === 'script') {
    let data = await axios.get('https://api.github.com/repos/Fyzxy/CataclysmX-MD').then((a) => a.data);
    let cap = '*– 乂 Informasi - Script Bot*\n\n';
    cap += `> 🤖 *Nama:* ${data.name}\n`;
    cap += `> 👤 *Pemilik:* ${data.owner.login}\n`;
    cap += `> ⭐ *Star:* ${data.stargazers_count}\n`;
    cap += `> 🍴 *Forks:* ${data.forks}\n`;

    let waktuSekarang = new Date().getTime();
    let waktuDibuat = new Date(data.created_at).getTime();
    let waktuUpdate = new Date(data.updated_at).getTime();
    let waktuPublish = new Date(data.pushed_at).getTime();

    let selisihWaktuDibuat = waktuSekarang - waktuDibuat;
    let selisihWaktuUpdate = waktuSekarang - waktuUpdate;
    let selisihWaktuPublish = waktuSekarang - waktuPublish;

    let hari = 86400000; // 24 jam dalam milidetik
    let jam = 3600000; // 1 jam dalam milidetik
    let menit = 60000; // 1 menit dalam milidetik
    let detik = 1000; // 1 detik dalam milidetik

    let waktuDibuatBaru = `${Math.floor(selisihWaktuDibuat / hari)} hari ${Math.floor((selisihWaktuDibuat % hari) / jam)} jam ${Math.floor(((selisihWaktuDibuat % hari) % jam) / menit)} menit ${Math.floor((((selisihWaktuDibuat % hari) % jam) % menit) / detik)} detik`;
    let waktuUpdateBaru = `${Math.floor(selisihWaktuUpdate / hari)} hari ${Math.floor((selisihWaktuUpdate % hari) / jam)} jam ${Math.floor(((selisihWaktuUpdate % hari) % jam) / menit)} menit ${Math.floor((((selisihWaktuUpdate % hari) % jam) % menit) / detik)} detik`;
    let waktuPublishBaru = `${Math.floor(selisihWaktuPublish / hari)} hari ${Math.floor((selisihWaktuPublish % hari) / jam)} jam ${Math.floor(((selisihWaktuPublish % hari) % jam) / menit)} menit ${Math.floor((((selisihWaktuPublish % hari) % jam) % menit) / detik)} detik`;

    cap += `> 📅 *Dibuat sejak:* ${waktuDibuatBaru}\n`;
    cap += `> 🔄 *Terakhir Update:* ${waktuUpdateBaru}\n`;
    cap += `> 🔄 *Terakhir Publish:* ${waktuPublishBaru}\n`;
    cap += `> 🔗 *Link Repository:* ${data.html_url}\n\n`; 
    cap += '⚠️ Script ini free, jangan kalian perjual belikan!!!, boleh kalian recode asal jangan hapus credit original dari kami!';
    m.reply(cap);
  }
};

handler.help = ['*script* <informasi update>'];
handler.tags = ['other'];
handler.command = /^(script)$/i;

export default handler;

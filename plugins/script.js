
import axios from 'axios';

let handler = async (m, { text, conn, usedPrefix, command }) => {
  if (command === 'script') {
    let data = await axios.get('https://api.github.com/repos/Fyzxy/CataclysmX-MD').then((a) => a.data);
    let cap = '*– 乂 Informasi - Script Bot*\n\n';
    cap += `> 🤖 *Nama:* ${data.name}\n`;
    cap += `> 👤 *Pemilik:* ${data.owner.login}\n`;
    cap += `> ⭐ *Star:* ${data.stargazers_count}\n`;
    cap += `> 🍴 *Forks:* ${data.forks}\n`;
    cap += `> 📅 *Dibuat sejak:* ${new Date(data.created_at).toLocaleString()}\n`;
    cap += `> 🔄 *Terakhir Update:* ${new Date(data.updated_at).toLocaleString()}\n`;
    cap += `> 🔄 *Terakhir Publish:* ${new Date(data.pushed_at).toLocaleString()}\n`;
    cap += `> 🔗 *Link Repository:* ${data.html_url}\n\n`;  
    cap += 'Script ini gratis, boleh kalian recode dan jual asal jangan hapus credit original dari kami!';
    m.reply(cap);
  }
};

handler.help = ['*script* <informasi script>'];
handler.tags = ['other'];
handler.command = /^(script)$/i;

export default handler;


import { generateWAMessageFromContent } from '@adiwajshing/baileys';
import pkg from '@adiwajshing/baileys';
const { proto } = pkg


const handler = async (m, { text, conn }) => {
  if (!text) return m.reply(`Kirim perintah /idch <link channel>\nContoh: /idch https://whatsapp.com/channel/...`);
  if (!/https?:\/\/(www\.)?whatsapp\.com\/channel\//gi.test(text)) return m.reply('Link tidak valid! Pastikan link channel WhatsApp.');

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  try {
    const channelId = text.split('whatsapp.com/channel/')[1].split('/')[0].split('?')[0];
    const data = await conn.newsletterMetadata("invite", channelId);

    let teks = `「 *NEWSLETTER METADATA* 」\n\n`;
    teks += ` · Nama: ${data.name}\n`;
    teks += ` · ID: ${data.id}\n`;
    teks += ` · Status: ${data.state}\n`;
    teks += ` · Dibuat: ${formatDate(data.creation_time)}\n`;
    teks += ` · Subscribers: ${data.subscribers}\n`;
    teks += ` · Verified: ${data.verification}\n`;
    teks += ` · Emoji Reaction: ${data.reaction_codes}\n`;
    teks += ` · Deskripsi:\n${data.description || 'Tidak ada deskripsi'}\n`;

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          "messageContextInfo": {
            "deviceListMetadata": {},
            "deviceListMetadataVersion": 2
          },
          interactiveMessage: {
            body: {
              text: teks
            },
            footer: {
              text: global.footer
            },
            nativeFlowMessage: {
              buttons: [
                {
                  "name": "cta_copy",
                  "buttonParamsJson": `{"display_text": "Salin ID", "copy_code": "${data.id}" }`
                }
              ]
            }
          }
        }
      }
    }, { quoted: m });

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
  } catch (error) {
    console.error(error);
    m.reply('Gagal mendapatkan data channel! Pastikan link valid.');
  }
};

handler.help = ['*cek id ch* <linkch>'];
handler.tags = ['tools'];
handler.command = ['idch', 'cekidch'];

export default handler;

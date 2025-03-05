// Base For BochilGaming
// Di Kembangkan Oleh Fyzxy

import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'
import moment from 'moment-timezone'
import os from 'os'
import fs from 'fs'
import jimp from 'jimp'
import fetch from 'node-fetch'
const { generateWAMessageFromContent, proto, getDevice } = (await import('@adiwajshing/baileys')).default

const defaultMenu = {
  before: `
📌 *Daftar Perintah Bot:*  
%readmore
  `.trimStart(),
    header: '%category',
    body: '- %cmd', 
    footer: '',
    after: ``,
  }
let handler = async (m, { conn, usedPrefix: _p, __dirname, args, command }) => {

  if (m.isGroup && !global.db.data.chats[m.chat].menu) {
    throw `Admin telah mematikan menu`;
  } 
  let tags = {
    'main': '🏠 *Main*',  
    'ai': '🤖 *AI Commands:*', 
    'downloader': '📥 *Downloader Commands:*', 
    'sticker': '📝 *Sticker Commands*',
    'tools': '⚙️ *Tools Commands*',
    'group': '👥 *Group Commands:*',
    'search': '🔎 *Search Commands*',   
    'owner': '👑 *Owner Commands*',  
    'other': '🔹 *Lainnya:*', 
  }

  try {
    // DEFAULT MENU
    let dash = global.dashmenu
    let m1 = global.dmenut
    let m2 = global.dmenub
    let m3 = global.dmenuf
    let m4 = global.dmenub2

    // COMMAND MENU
    let cc = global.cmenut
    let c1 = global.cmenuh
    let c2 = global.cmenub
    let c3 = global.cmenuf
    let c4 = global.cmenua

    // LOGO L P
    let lprem = global.lopr
    let llim = global.lolm
    let tag = `@${m.sender.split('@')[0]}`
    let device = await getDevice(m.id)

    //-----------TIME---------
    let ucpn = `${ucapan()}`
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let _mpt
    if (process.send) {
      process.send('uptime')
      _mpt = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let mpt = clockString(_mpt)
    let usrs = db.data.users[m.sender]


    /**************************** TIME *********************/
    let wib = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    let wibh = moment.tz('Asia/Jakarta').format('HH')
    let wibm = moment.tz('Asia/Jakarta').format('mm')
    let wibs = moment.tz('Asia/Jakarta').format('ss')
    let wit = moment.tz('Asia/Jayapura').format('HH:mm:ss')
    let wita = moment.tz('Asia/Makassar').format('HH:mm:ss')
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`

    let mode = global.opts['self'] || global.opts['owneronly'] ? 'Private' : 'Publik'
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { age, exp, limit, level, role, registered, money } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let premium = global.db.data.users[m.sender].premiumTime
    let prems = `${premium > 0 ? 'Premium' : 'Free'}`
    let platform = os.platform()

    //---------------------

    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    
    let groups = {}
    for (let tag in tags) {
      groups[tag] = []
      for (let plugin of help)
        if (plugin.tags && plugin.tags.includes(tag))
          if (plugin.help) groups[tag].push(plugin)
    }
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%_p' + help)
                .replace(/%islimit/g, menu.limit ? llim : '')
                .replace(/%isPremium/g, menu.premium ? lprem : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: uptime, muptime,
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      tag, dash, m1, m2, m3, m4, cc, c1, c2, c3, c4, lprem, llim,
      ucpn, platform, wib, mode, _p, money, age, tag, name, prems, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    let fkon = {
      key: {
        fromMe: false,
        participant: `${m.sender.split`@`[0]}@s.whatsapp.net`,
        ...(m.chat ? { remoteJid: '16500000000@s.whatsapp.net' } : {})
      },
      message: {
        contactMessage: {
          displayName: `${name}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
          verified: true
        }
      }
    };

let resize = async (image, width, height) => {
    let oyy = await jimp.read(image)
    let kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
    return kiyomasa
}

conn.sendMessage(m.chat, { react: { text: '', key: m.key }})

conn.sendMessage(m.chat, {
    document: fs.readFileSync("./package.json"),
    fileName: "𝁂 CataclysmX",
    mimetype: "image/png",
    fileLength: 99999,
    pageCount: 666,
    jpegThumbnail: (await resize (fs.readFileSync('./thumbnail.jpg'), 400, 400)),
    caption: text,
    footer: `─ Hallo Selamat *${ucapan()}*\n─ *© Fyzxy 2020-2025*`, 
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      mentionedJid: [m.sender],
      forwardedNewsletterMessageInfo: {
        newsletterName: "𝁂 CataclysmX-MultiDevice",
        newsletterJid: `120363384162991692@newsletter`,
      },
      externalAdReply: {
        title: "𝁂 CataclysmX",
        body: "𝁂 Multi-Device",
        thumbnailUrl: `https://fastrestapis.fasturl.cloud/file/v2/dVGN0Ax.jpg`,
        sourceUrl: "https://github.com/DanadyaksaDev/CataclysmX-MD",
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
    buttons: [
    {
      buttonId: '.owner',
      buttonText: { displayText: '👤 Creator' },
      type: 1
    },
    {
      buttonId: 'action',
      buttonText: { displayText: 'kntol' },
      type: 4,
      nativeFlowInfo: {
        name: 'single_select',
        paramsJson: JSON.stringify({
          title: '📂 Kategori Menu',
          sections: [
            {
              title: '🏠 Main Menu',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 MAIN',
                  title: 'menampilan all list command',
                  description: 'Click to Display',
                  id: '.menu' 
                }
              ]
            },
            {
              title: '🤖 AI COMMANDS',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 BLACKBOX AI',
                  title: 'ai atau bot yg bisa menjawab pertanyaan anda',
                  description: 'Click to Display',
                  id: '.bb'
                },
                {
                  header: '📂 QWEN AI',
                  title: 'ai keren yg bisa membantu anda,sudah support session',
                  description: 'Click to Display',
                  id: '.qw'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totaluser2'
                  }
              ]
            },
            {
              title: '📥 Downloader Commands',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 IGDL',
                  title: 'untuk mengunduh video/foto dari instagram',
                  description: 'Click to Display',
                  id: '.ig'
                },
                {
                  header: '📂 TTDL',
                  title: 'untuk mengunduh video/foto dari tiktok',
                  description: 'Click to Display',
                  id: '.tt'
                },
                {
                  header: '📂 MEDIAFIRE',
                  title: 'untuk mengunduh document dari mediafire',
                  description: 'Click to Display',
                  id: '.mediafire' 
                },
                {
                  header: '📂 GIT CLONE',
                  title: 'untuk mengunduh repository dari github',
                  description: 'Click to Display',
                  id: '.gitclone' 
                  }
              ]
            },
            {
              title: '📝 Sticker Commands',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totalcase2'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'ping2'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totaluser2'
                  }
              ]
            },
            {
              title: '⚙️ Tools Commands',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 HD/REMINI',
                  title: 'membuat foto lebih hd',
                  description: 'Click to Display',
                  id: '.hd'
                },
                {
                  header: '📂 REMOVE BG',
                  title: 'untuk menghapus background foto',
                  description: 'Click to Display',
                  id: '.removebg'
                },
                {
                  header: '📂 GET',
                  title: 'untuk menampilkan get result api dll',
                  description: 'Click to Display',
                  id: '.get'
                  }
              ]
            },
            {
              title: '👥 Group Commands',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totalcase2'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'ping2'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totaluser2'
                 }
              ]
            },
            {
              title: '🔎 Search Commands',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 PLAY',
                  title: 'untuk mencari lagu',
                  description: 'Click to Display',
                  id: '.play'
                },
                {
                  header: '📂 YTS',
                  title: 'untuk unduh mp3/mp4 dari youtube',
                  description: 'Click to Display',
                  id: '.yts'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totaluser2'
                  }
              ]
            },
            {
              title: '👑 Owner Commands',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 DF',
                  title: 'untuk menghapus plugin',
                  description: 'Click to Display',
                  id: '.df'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'ping2'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totaluser2'
                 }
              ]
            },
            {
              title: '🔹 Lainnya',
              highlight_label: `1.0.0`,
              rows: [
                {
                  header: '📂 PLN',
                  title: 'untuk cek tagihan listrik',
                  description: 'Click to Display',
                  id: '.pln'
                },
                {
                  header: '📂 SCRIPT',
                  title: 'informasi update script',
                  description: 'Click to Display',
                  id: '.script'
                },
                {
                  header: '📂 COOMING SOON',
                  title: 'belum ada handler',
                  description: 'Click to Display',
                  id: 'totaluser2'  
                }
              ]
            }
          ]
        })
      }
    }
  ],
  headerType: 1,
  viewOnce: true
}, { quoted: m }) 
  } catch (e) {
    conn.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(allmenu|menu|help|\?)$/i

handler.register = false
handler.exp = false

export default handler

//----------- FUNCTION -------

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, ' H ', m, ' M ', s, ' S '].map(v => v.toString().padStart(2, 0)).join('')
}
function clockStringP(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [ye, ' *Years 🗓️*\n', mo, ' *Month 🌙*\n', d, ' *Days ☀️*\n', h, ' *Hours 🕐*\n', m, ' *Minute ⏰*\n', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('')
}
function ucapan() {
  const time = moment.tz('Asia/Jakarta').format('HH')
  let res = "Kok Belum Tidur Kak? 🥱"
  if (time >= 4) {
    res = "Pagi Kak 🌄"
  }
  if (time >= 10) {
    res = "Siang Kak ☀️"
  }
  if (time >= 15) {
    res = "Sore Kak 🌇"
  }
  if (time >= 18) {
    res = "Malam Kak 🌙"
  }
  return res
}

/*async function genProfile(conn, m) {
  let font = await jimp.loadFont('./names.fnt'),
    mask = await jimp.read('https://i.imgur.com/552kzaW.png'),
    border = await jimp.read('https://telegra.ph/file/a81aa1b95381c68bc9932.png'),
    welcome = await jimp.read(thumbnailUrl.getRandom()),
    avatar = await jimp.read(await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/24fa902ead26340f3df2c.png')),
    status = (await conn.fetchStatus(m.sender).catch(console.log) || {}).status?.slice(0, 30) || 'Not Detected',
    premiumUnixTime = global.db.data.users[m.sender].premiumTime,
    prems = `${premiumUnixTime > 0 ? 'Premium User' : 'Free User'}`;

  const gmtPlus7Time = premiumUnixTime * 1000 + 7 * 60 * 60 * 1000;


  await avatar.resize(460, 460)
  await mask.resize(460, 460)
  await avatar.mask(mask)

  await welcome.resize(welcome.getWidth(), welcome.getHeight())

  await welcome.print(font, 550, 150, 'Name:')
  await welcome.print(font, 800, 150, m.pushName.slice(0, 25))
  await welcome.print(font, 550, 215, 'About:')
  await welcome.print(font, 800, 215, status)
  await welcome.print(font, 550, 280, 'Number:')
  await welcome.print(font, 800, 280, PhoneNumber('+' + m.sender.split('@')[0]).getNumber('international'))
  await welcome.print(font, 550, 400, 'Status:')
  await welcome.print(font, 800, 400, prems)

  if (premiumUnixTime > 0) {
    const gmtPlus7DateString = new Date(gmtPlus7Time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    await border.resize(460, 460)
    await welcome.print(font, 550, 460, 'Until:');
    await welcome.print(font, 800, 460, gmtPlus7DateString);
    await welcome.composite(border, 50, 170);
  }

  return await welcome.composite(avatar, 50, 170).getBufferAsync('image/png')
}
*/

/*
Jangan Hapus Wm Bang 

*Ig Downloader  Plugins Esm*

Support Video Atau Gambar 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

Rian
*/

import axios from 'axios'
import crypto from 'crypto'

async function tm() {
    try {
        const { data } = await axios.get('https://sssinstagram.com/msec')
        return Math.floor(data.msec * 1000)
    } catch (error) {
        console.error('Error fetching time:', error)
        return Date.now()
    }
}

async function generateSignature(url, secretKey) {
    const time = await tm()
    const ab = Date.now() - (time ? Date.now() - time : 0)
    const hashString = `${url}${ab}${secretKey}`
    const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(hashString))
      .then(buffer => Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join(''))
    
    return { signature, ab, time }
}

async function ssig(url) {
    const secretKey = '19e08ff42f18559b51825685d917c5c9e9d89f8a5c1ab147f820f46e94c3df26'
    const { signature, ab, time } = await generateSignature(url, secretKey)
    
    const requestData = {
        url: url,
        ts: ab,
        _ts: 1739186038417,
        _tsc: time ? Date.now() - time : 0,
        _s: signature
    }

    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://sssinstagram.com/',
        'authority': 'sssinstagram.com/',
        'Origin': 'https://sssinstagram.com/'
    }

    try {
        const response = await axios.post('https://sssinstagram.com/api/convert', requestData, { headers })
        return response.data
    } catch (error) {
        return { error: 'Error scraping data', details: error.response ? error.response.data : error.message }
    }
}

const handler = async (m, { conn, args }) => {
    const url = args[0]
    if (!url) return m.reply('Eh, lupa kasih link Instagramnya? Contoh: .igdl https://www.instagram.com/p/xxxxx/')
    
    m.reply('Tunggu sebentar ya, lagi prosesin...')
    
    try {
        const result = await ssig(url)
        if (result.error) throw result.error
        
        const mediaArray = Array.isArray(result) ? result : [result]
        let captionSent = false
        
        for (const item of mediaArray) {
            const meta = item.meta || {}
            const caption = `
📌 *Username:* ${meta.username || '-'}
❤️ *Likes:* ${meta.like_count || 0}
💬 *Comments:* ${meta.comment_count || 0}
📝 *Caption:* ${(meta.title || '-').slice(0, 1000)}`.trim()
            
            if (item.url?.[0]?.ext === 'mp4') {
                await conn.sendMessage(m.chat, { 
                    video: { url: item.url[0].url },
                    caption: caption
                }, { quoted: m })
                return
            }
        }
        
        for (const item of mediaArray) {
            const meta = item.meta || {}
            const caption = `
📌 *Username:* ${meta.username || '-'}
❤️ *Likes:* ${meta.like_count || 0}
💬 *Comments:* ${meta.comment_count || 0}
📝 *Caption:* ${(meta.title || '-').slice(0, 1000)}`.trim()
            
            if (item.url?.[0]?.url) {
                await conn.sendMessage(m.chat, { 
                    image: { url: item.url[0].url },
                    caption: captionSent ? '' : caption
                }, { quoted: m })
                captionSent = true
            } else if (item.thumb) {
                await conn.sendMessage(m.chat, { 
                    image: { url: item.thumb },
                    caption: captionSent ? '' : caption
                }, { quoted: m })
                captionSent = true
            }
        }
        
    } catch (error) {
        console.error(error)
        m.reply(`Yah error nih, coba cek linknya atau coba lagi ya?\n${error.message}`)
    }
}

handler.help = ['*igdl* <url> [hd]']
handler.command = ['igdl', 'ig']
handler.tags = ['downloader']

export default handler
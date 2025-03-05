import axios from 'axios'
import { lookup } from 'mime-types'

let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) return m.reply(`Contoh penggunaan: ${usedPrefix + command} <url>`)
    
    try {
        let res = await MediaFire(text)
        if (res.error) throw res.error
        
        let caption = `*Nama File:* ${res.filename}
*Ukuran:* ${res.size}
*Tipe File:* ${res.mimetype}`
        
        if (res.buffer) {
            await conn.sendFile(m.chat, res.buffer, res.filename, caption, m)
        } else if (res.url) {
            await conn.sendFile(m.chat, res.url, res.filename, caption, m)
        } else {
            throw 'Tidak dapat mengunduh file'
        }
        
    } catch (e) {
        m.reply(`Error: ${e}`)
    }
}

async function MediaFire(url) {
    try {
        const response = await fetch('https://r.jina.ai/' + url)
        const text = await response.text()
        
        const result = {
            filename: '',
            size: '',
            mimetype: '',
            url: '',
            repair: ''
        }
        
        const fileMatch = url.match(/\/([^\/]+\.[a-zA-Z0-9.]+)$/)
        if (fileMatch) result.filename = fileMatch[1]
        let ext = result.filename.split(".").pop()
        if (ext) result.mimetype = lookup(ext.toLowerCase()) || `application/${ext}`
        
        const matches = [...text.matchAll(/\[(.*?)\]\((https:\/\/[^\s]+)\)/g)]
        for (const match of matches) {
            const desc = match[1].trim()
            const link = match[2].trim()
            
            if (desc.toLowerCase().includes('download') && desc.match(/\((\d+(\.\d+)?[KMGT]B)\)/)) {
                result.url = link
                result.size = (desc.match(/\((\d+(\.\d+)?[MG]B)\)/) || [])[1] || ''
            }
            if (desc.toLowerCase().includes('repair')) {
                result.repair = link
            }
        }
        
        let { data: buffer } = await axios.get(result.url || result.repair, {
            responseType: "arraybuffer"
        })
        
        if (buffer) result.buffer = buffer
        
        return result
    } catch (error) {
        return { error: error.message }
    }
}

handler.help = ['*mediafire*'].map(v => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(mf)$/i

export default handler

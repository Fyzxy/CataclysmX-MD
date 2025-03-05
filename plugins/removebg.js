import axios from 'axios';

async function removebg(buffer) {
    try {
        const image = buffer.toString("base64");
        let res = await axios.post(
            "https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
                image: `data:image/png;base64,${image}`,
                model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
            }
        );
        const data = res.data?.replace(`"`, "");
        if (!data) throw "Gagal menghapus background!";
        return data;
    } catch (e) {
        throw `Error: ${e.message}`;
    }
}

let handler = async (m, { conn }) => {
    try {
        await m.react('⌛');

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image/')) 
            throw 'Mana Gambar Nya?.';

        let media = await q.download();
        let resultUrl = await removebg(media);

        await m.react('✅');

        await conn.sendMessage(m.chat, { 
            image: { url: resultUrl }
        }, { quoted: m });

    } catch (error) {
        await m.react('❌');
        await conn.sendMessage(m.chat, { text: `❌ *Error:* ${error}` }, { quoted: m });
    }
};

handler.help = ['*removebg* [reply image]'];
handler.command = ['removebg'];
handler.tags = ['tools']
handler.limit = false;

export default handler;
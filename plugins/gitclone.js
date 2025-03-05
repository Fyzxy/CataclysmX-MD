import axios from 'axios'

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+?)(?:[\/]|$)/i

let handler = async (m, { conn, text }) => {
    // Number formatting helper
    const h2k = (number) => number >= 1000 ? `${(number/1000).toFixed(1)}k` : number.toString();
    
    // Time calculation helper (Indonesian)
    const ago = (dateString) => {
        const units = [
            {limit: 31536000, name: 'tahun'},
            {limit: 2592000, name: 'bulan'},
            {limit: 86400, name: 'hari'},
            {limit: 3600, name: 'jam'},
            {limit: 60, name: 'menit'}
        ];
        const diff = (Date.now() - new Date(dateString)) / 1000;
        for (const unit of units) {
            if (diff >= unit.limit) {
                return `${Math.floor(diff/unit.limit)} ${unit.name} yang lalu`;
            }
        }
        return `${Math.floor(diff)} detik yang lalu`;
    };

    if (!text || !regex.test(text)) throw "Masukan Link repository github!";
    const [_, author, repo] = text.match(regex);
    const cleanRepo = repo.replace(/.git$/, "");
    
    try {
        const { data } = await axios.get(`https://api.github.com/repos/${author}/${cleanRepo}`);
        const caption = `*– 乂 Github - Clone*\n
> *- Nama :* ${data.name}
> *- Pemilik :* ${data.owner.login}
> *- Bahasa :* ${data.language}
> *- Bintang :* ${h2k(data.stargazers_count)}
> *- Fork :* ${h2k(data.forks_count)}
> *- Dibuat :* ${ago(data.created_at)}
> *- Update :* ${ago(data.updated_at)}

${data.description || 'Tidak ada deskripsi'}`;

        await conn.sendFile(m.chat, 
            `https://api.github.com/repos/${author}/${cleanRepo}/zipball`, 
            `${cleanRepo}.zip`, 
            caption, 
            m
        );
    } catch (e) {
        throw "Gagal mengambil data repository!";
    }
}

handler.help = ['*gitclone* <url>'];
handler.tags = ['downloader'];
handler.command = /^(gitclone|githubdl)$/i;
export default handler;
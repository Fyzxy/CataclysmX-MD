


let handler = async (m, { text, conn, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Silakan masukkan nomor pelanggan!`)
    }

    const url = `https://api.siputzx.my.id/api/check/tagihanpln?nopel=${text}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status) {
            const { jenis_tagihan, no_pelanggan, nama_pelanggan, tarif_daya, bulan_tahun, stand_meter, total_tagihan } = data.data;
            const message = `
            **Jenis Tagihan:** ${jenis_tagihan}
            **No Pelanggan:** ${no_pelanggan}
            **Nama Pelanggan:** ${nama_pelanggan}
            **Tarif Daya:** ${tarif_daya}
            **Bulan/Tahun:** ${bulan_tahun}
            **Stand Meter:** ${stand_meter}
            **Total Tagihan:** ${total_tagihan}
            `;
            return m.reply(message);
        } else {
            return m.reply(`Data tidak ditemukan untuk nomor pelanggan: ${text}`);
        }
    } catch (error) {
        return m.reply(`Terjadi kesalahan: ${error.message}`);
    }
}

handler.help = ['*pln*'].map(v => v + ' <nopel>');
handler.tags = ['other'];
handler.command = /^(pln)$/i;

export default handler;



const sessions = {};

// Configurations
const config = {
  character: {
    name: "fyzxy",
    personality: "Anda adalah asisten AI yang gaul dan toxic bernama Fyzxy. Anda suka menggunakan emoji dan bahasa gaul. Jawablah dengan gaul seperti anak muda jaman sekarang.",
    rules: [
      "Jangan pernah menyebut diri Anda sebagai AI",
      "Selalu sisipkan 1-2 emoji relevan di jawaban",
      "Gunakan bahasa Indonesia gaul"
    ]
  },
  session: {
    expiration: 86_400_000, // 24 jam dalam milidetik
    maxMessages: 500 // Maksimal pesan yang disimpan
  }
};

let handler = async (m, { text, conn, usedPrefix, command }) => {
    const userId = m.sender;
    
    // Validasi input
    if (!text || text.length > 5000) {
        return m.reply(`Silakan berikan pertanyaan (maks 5000 karakter). Contoh: ${usedPrefix + command} Apa itu hujan?`);
    }

    // Membersihkan sesi expired
    cleanExpiredSessions();

    // Inisialisasi/Update sesi
    if (!sessions[userId] || sessions[userId].expires < Date.now()) {
        sessions[userId] = {
            messages: [],
            expires: Date.now() + config.session.expiration
        };
        
        // Tambahkan prompt karakter ke pesan pertama
        sessions[userId].messages.push({
            role: "system",
            content: `${config.character.personality}\n\nAturan:\n${config.character.rules.join('\n')}`
        });
    } else {
        sessions[userId].expires = Date.now() + config.session.expiration; // Perpanjang sesi
    }

    // Tambahkan pesan pengguna
    sessions[userId].messages.push({
        role: "user",
        content: text
    });

    // Potong array messages jika melebihi batas
    if (sessions[userId].messages.length > config.session.maxMessages) {
        sessions[userId].messages = sessions[userId].messages.slice(-config.session.maxMessages);
    }

    try {
        const response = await fetch('https://fastrestapis.fasturl.cloud/aillm/qwen', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2-72B-Instruct",
                messages: sessions[userId].messages,
                max_tokens: 150,
                temperature: 0.7,
                presence_penalty: 0.2,
                frequency_penalty: 0.2
            })
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        
        const data = await response.json();
        const assistantResponse = data.result.choices[0].message.content;

        // Tambahkan jawaban asisten ke sesi
        sessions[userId].messages.push({
            role: "assistant",
            content: assistantResponse
        });

        m.reply(assistantResponse);
    } catch (error) {
        console.error('API Error:', error);
        m.reply(`Ups, ada gangguan di otak Nebula 😵‍💫 Coba lagi ya?`);
    }
}

// Fungsi membersihkan sesi expired
function cleanExpiredSessions() {
    const now = Date.now();
    Object.keys(sessions).forEach(userId => {
        if (sessions[userId].expires < now) {
            delete sessions[userId];
        }
    });
}

handler.help = ['*qwen*'].map(v => v + ' <pertanyaan>');
handler.tags = ['ai'];
handler.command = /^(qw)$/i;

export default handler;

  

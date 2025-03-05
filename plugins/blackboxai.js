/*
Jangan Hapus Wm Bang 

*Blackblox Ai Plugins Esm*

Bisa Search Web Udh Itu aja Command : .BB dan .bb search 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

ZErvida 
*/

import axios from 'axios';

async function fetchBlackboxAI(prompt, callback) {
    const url = 'https://www.blackbox.ai/api/chat';
    const headers = {
        'authority': 'www.blackbox.ai',
        'accept': '*/*',
        'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://www.blackbox.ai',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36'
    };

    const data = {
        "messages": [{ "role": "user", "content": prompt, "id": "54lcaEJ" }],
        "agentMode": {},
        "id": "RDyqb0u",
        "previewToken": null,
        "userId": null,
        "codeModelMode": true,
        "trendingAgentMode": {},
        "isMicMode": false,
        "userSystemPrompt": null,
        "maxTokens": 1024,
        "playgroundTopP": null,
        "playgroundTemperature": null,
        "isChromeExt": false,
        "githubToken": "",
        "clickedAnswer2": false,
        "clickedAnswer3": false,
        "clickedForceWebSearch": false,
        "visitFromDelta": false,
        "isMemoryEnabled": false,
        "mobileClient": false,
        "userSelectedModel": null,
        "validated": "00f37b34-a166-4efb-bce5-1312d87f2f94",
        "imageGenerationMode": false,
        "webSearchModePrompt": true,
        "deepSearchMode": false,
        "domains": null,
        "vscodeClient": false,
        "codeInterpreterMode": false,
        "customProfile": {
            "name": "",
            "occupation": "",
            "traits": [],
            "additionalInfo": "",
            "enableNewChats": false
        },
        "session": null,
        "isPremium": false,
        "subscriptionCache": null,
        "beastMode": false
    };

    try {
        const response = await axios({
            method: 'post',
            url: url,
            headers: headers,
            data: data,
            responseType: 'stream'
        });

        let output = '';
        let search = [];
        
        response.data.on('data', chunk => {
            const chunkStr = chunk.toString();
            output += chunkStr;
            
            const match = output.match(/\$~~~\$(.*?)\$~~~\$/);
            if (match) {
                search = JSON.parse(match[1]);
                const text = output.replace(match[0], '');
                output = '';
                callback({ search });
            } else {
                if (search.length) callback({ text: chunkStr });
            }
        });
        
        return new Promise((resolve) => {
            response.data.on('end', () => {
                resolve({ search, text: output.trim() });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function handler(m, { text, conn, args }) {
    if (!text) return m.reply('Masukkan prompt untuk BlackboxAI!');
    
    const isSearchMode = args[0]?.toLowerCase() === 'search';
    const prompt = isSearchMode ? args.slice(1).join(' ') : text;
    
    if (isSearchMode && !args[1]) return m.reply('Masukkan kata kunci pencarian!');
    
    try {
        const mess = await conn.sendMessage(m.chat, { 
            text: isSearchMode ? 'Mencari...' : '*Thinking*"...' 
        }, { quoted: m });
        
        let fullText = '';
        let searchResults = [];
        
        const result = await fetchBlackboxAI(prompt, (response) => {
            if (!isSearchMode && response.text) {
                fullText += response.text;
                conn.sendMessage(m.chat, { 
                    text: fullText, 
                    edit: mess.key 
                });
            }
            
            if (response.search) {
                searchResults = response.search;
                if (isSearchMode) {
                    const searchText = searchResults.map((item, index) => {
                        const title = item.title || item.text || 'No title';
                        const url = item.url || item.link || '';
                        return `${index + 1}. ${title}\n${url ? `${url}\n` : ''}`;
                    }).join('\n');
                    
                    conn.sendMessage(m.chat, { 
                        text: searchText || 'Tidak ada hasil pencarian.', 
                        edit: mess.key 
                    });
                }
            }
        });

        if (!isSearchMode && result.text) {
            await conn.sendMessage(m.chat, {
                text: result.text,
                edit: mess.key
            });
            
            if (result.search && result.search.length > 0) {
                const searchText = result.search.map((item, index) => {
                    const title = item.title || item.text || 'No title';
                    const url = item.url || item.link || '';
                    return `${index + 1}. ${title}\n${url ? `${url}\n` : ''}`;
                }).join('\n');
                
                await conn.sendMessage(m.chat, {
                    text: searchText,
                    quoted: m
                });
            }
        }
        
    } catch (error) {
        console.error('Error in BlackboxAI:', error);
        m.reply('Terjadi kesalahan saat memproses permintaan.');
    }
}

handler.help = ['*blackbox* <blackbox search>'];
handler.tags = ['ai'];
handler.command = /^(blackbox|bbai|bb)$/i;
handler.limit = false;

export default handler;
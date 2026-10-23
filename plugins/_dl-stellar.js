import ytsearch from "yt-search"
import fetch from "node-fetch"
import moment from 'moment-timezone'
moment.locale('es')

const api = { url: 'https://api.stellarwa.xyz', key: 'proyectsV2' }

const react = async (conn, m, text) => {
  try { await conn.sendMessage(m.chat, { react: { text: text, key: m.key } }) } catch {}
}

const getBuffer = async (url) => {
    const res = await fetch(url)
    if(!res.ok) throw new Error('No se pudo descargar el buffer')
    return Buffer.from(await res.arrayBuffer())
}

let handler = async (m, { conn, command }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const ownerNum = global.owner?.[0]?.[0] || '51927174369'
    let text = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || ''
    text = text.replace(`.${command}`, '').trim()

    if (!text) {
        return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒 ﹒ DESCARGAS ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦 ׅ 𝆬 ָ֢ ෆ
📥 ࣪ ꕀ.descargas ˚. ᵎᵎ
> *"Descargando almas como dulces en Halloween"*

.⃟𖥔 ݁. 𖦹˙— \`\`USO HALLOWEEN\`\` 📥 —˙𖦹.꒷

── *📝 COMANDOS* ╏ 🎃
1️⃣ ➛.*play1* <nombre de canción>
   🎀 ➛ Descarga audio de YouTube MP3
   👻 ➛ Chayita pone la música

2️⃣ ➛.*ttmp3* <link de tiktok>
   🎵 ➛ Descarga audio de TikTok MP3
   🐭 ➛ TikTok sabor calabaza

3️⃣ ➛.*fb* <link de facebook>
   📹 ➛ Descarga video de Facebook
   💀 ➛ Hasta Chayita ve FB

── *💡 EJEMPLOS* ╏ 🕯️
➛.*play1* despacito
➛.*ttmp3* https://tiktok.com/@user/video
➛.*fb* https://facebook.com/watch?v=xxx

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
*Owner*: @${ownerNum}
━━━━━━━━━━━`, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
    }

    await react(conn, m, '🎀')
    try {
        if (command === 'play1') {
            await m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐍𝐃𝐎 ﹒ PLAY1 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`YOUTUBE\`\` 🎃 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
🔍 ➛ Buscando canción embrujada...
⬇️ ➛ Descargando audio MP3...
👻 ➛ Chayita eligiendo tema...

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`)
            const searchResult = await ytsearch(text)
            if (!searchResult.videos.length) throw new Error("No se encontró la canción.")
            const video = searchResult.videos[0]

            const apiUrl = `${api.url}/dl/ytmp3?url=${encodeURIComponent(video.url)}&key=${api.key}`
            const resDl = await fetch(apiUrl).then(r => r.json())
            const dl = resDl?.data?.dl || resDl?.data?.download
            if (!dl) throw new Error('No se pudo descargar el audio de YT')

            const audioBuffer = await getBuffer(dl)
            await react(conn, m, '🎀')
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`
            }, { quoted: m })
        }

        if (command === 'ttmp3') {
            await m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐍𝐃𝐎 ﹒ TTMP3 ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`TIKTOK\`\` 🎃 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
⬇️ ➛ Descargando audio de TikTok...
🐭 ➛ Robando audio como dulces...

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`)
            const apiUrl = `${api.url}/dl/tiktokmp3?url=${encodeURIComponent(text)}&key=${api.key}`
            const res = await fetch(apiUrl).then(r => r.json())
            const data = res?.data || res?.result
            let dl = data?.download || data?.dl || data?.music
            const title = data?.title || 'TikTok'
            if (!dl) throw new Error('No se pudo descargar. Link mal o privado')

            const audioBuffer = await getBuffer(dl)
            await react(conn, m, '🎀')
            await conn.sendMessage(m.chat, {
                audio: audioBuffer,
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`
            }, { quoted: m })
        }

        if (command === 'fb' || command === 'facebook') {
            await m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐍𝐃𝐎 ﹒ FACEBOOK ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`FACEBOOK\`\` 📹 —˙𖦹.꒷

── *📊 ESTADO* ╏ 🎃
⬇️ ➛ Descargando video de Facebook...
👻 ➛ Chayita: "Odio los lunes, no los videos"

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`)
            const apiUrl = `${api.url}/dl/facebook?url=${encodeURIComponent(text)}&key=${api.key}`
            const res = await fetch(apiUrl)

            let videoBuffer
            const ct = res.headers.get('content-type')
            if(ct?.includes('application/json')){
                const data = await res.json()
                if(!data.status) throw new Error(data.message || 'Error API')
                videoBuffer = await getBuffer(data.result.url)
            } else {
                videoBuffer = Buffer.from(await res.arrayBuffer())
            }

            await react(conn, m, '🎀')
            await conn.sendMessage(m.chat, {
                video: videoBuffer,
                caption: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐀𝐃𝐎 ﹒ FACEBOOK ：✿ 。

.⃟𖥔 ݁. 𖦹˙— \`\`DESCARGADO\`\` ✅ —˙𖦹.꒷

── *📊 RESULTADO* ╏ 🎃
✅ ➛ Video exorcizado correctamente
📥 ➛ Disfrútalo
👻 ➛ Chayita lo aprueba

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━`
            }, { quoted: m })
        }

        await react(conn, m, '🎀')
    } catch (e) {
        await react(conn, m, '💀')
        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        console.log("ERROR:", e)
        return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐄𝐑𝐑𝐎𝐑 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
❌ ➛ ${e.message}
💀 ➛ Chayita se quedó sin dulces

── *💡 SOLUCIÓN* ╏ 🕯️
🔧 ➛ Verifica que el link sea válido
🔧 ➛ Asegúrate que no sea privado
🎃 ➛ Intenta de nuevo, como pedir dulces

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭
━━━━━━━━━━━` }, { quoted: m })
    }
}

handler.help = ['play1 <nombre>', 'ttmp3 <link>', 'fb <link>']
handler.tags = ['descargas']
handler.command = /^(play1|ttmp3|fb|facebook)$/i
handler.register = false
export default handler
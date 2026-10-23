import fetch from "node-fetch"
import yts from 'yt-search'
import { FormData, Blob } from 'formdata-node'
import { fileTypeFromBuffer } from 'file-type'
import { spawn } from 'child_process'
import crypto from 'crypto'
import fs from 'fs'
import os from 'os'
import path from 'path'
import moment from 'moment-timezone'
moment.locale('es')

const SONGFINDER_API = 'https://songfinder.gg/api/recognize/url'
const UGUU_UPLOAD = 'https://uguu.se/upload'
const CLIP_SECONDS = 30

const handler = async (m, { conn, command }) => {
    try {
        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        const ownerNum = global.owner?.[0]?.[0] || '51927174369'
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''

        if (!mime || !/audio|video/.test(mime)) {
            let menuUso = `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹
🎃🐭 𝗛𝗔𝗟𝗟𝗢𝗪𝗘𝗘𝗡 𝗖𝗢𝗤𝗨𝗘𝗧𝗧𝗘 🐭🎃

⤷ ┇ 𝐁𝐔𝐒𝐂𝐀𝐃𝐎𝐑 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🎀 ࣪ ꕀ.${command} ˚. ᵎᵎ
> *"Hasta la ratoncita coquette reconoce música en Halloween"*

.⃟𖥔 ݁. 𖦹˙— \`\`BUSCADOR HALLOWEEN\`\` 🔍 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
🎵 ➛ Identifica canciones respondiendo a audios o videos
🎃 ➛.song = Descarga el audio embrujado
👻 ➛.letra = Muestra la letra + descarga el audio

── *📖 USO* ╏ 🦇
1️⃣ ➛ Responde a un audio con:.*${command}*
2️⃣ ➛ Responde a un video con:.*${command}*

── *⏱️ NOTA* ╏ 🕯️
📦 ➛ Analiza los primeros *${CLIP_SECONDS}s*
🐭 ➛ Chayita coquette escucha mejor con moñito

━━━━━━━━━━━
🎀🐭 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭🎀
*Owner*: @${ownerNum}
━━━━━━━━━━━`
            return conn.sendMessage(m.chat, { text: menuUso, mentions: [ownerNum + '@s.whatsapp.net'] }, { quoted: m })
        }

        await m.react('🎀')
        let buffer = await q.download()
        if (!buffer) throw new Error('Error al descargar el archivo')

        await m.reply(`‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹

⤷ ┇ 𝐃𝐄𝐓𝐄𝐂𝐓𝐀𝐍𝐃𝐎 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`PROCESANDO\`\` 🎶 —˙𖦹.꒷

── *📊 PROCESO* ╏ 🎃
🕸️ ➛ Analizando ${CLIP_SECONDS}s de audio...
📤 ➛ Subiendo al cementerio temporal...
🎶 ➛ Invocando coincidencia...
🐭 ➛ Chayita coquette afinando orejitas...

━━━━━━━━━━━
🎀🐭 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭🎀
━━━━━━━━━━━`)

        let clip = await prepareClip(buffer, CLIP_SECONDS)
        let url = await uploadUguu(clip)
        let song = await recognizeUrl(url)
        let searchQuery = `${song.title} ${song.artist}`.replace(/\[.*?\]|\(feat.*?\)/gi, '').trim()

        await m.react('🎃')
        let search = await yts(searchQuery)
        let result = search.videos[0]
        if (!result) throw new Error('No se encontró la canción en YouTube')

        const { title, thumbnail, timestamp, views, videoId, author } = result
        const shortUrl = `https://youtu.be/${videoId}`
        const thumb = (await conn.getFile(thumbnail)).data
        const vistas = formatViews(views)
        const mediaUrl = await getMediaUrl(shortUrl)
        if (!mediaUrl) throw new Error('No se pudo obtener el audio')

        if(command === 'song'){
            await conn.sendMessage(m.chat, {
                image: thumb,
                caption: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹

⤷ ┇ 𝐄𝐍𝐂𝐎𝐍𝐓𝐑𝐀𝐃𝐎 ﹒ SONG ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`RESULTADO\`\` 🎃 —˙𖦹.꒷

── *📊 INFORMACIÓN* ╏ 🎃
📌 ➛ Título: *${title}*
👤 ➛ Artista: *${author.name}*
👁️ ➛ Vistas: *${vistas}*
⏱️ ➛ Duración: *${timestamp}*
🔗 ➛ Link: ${shortUrl}
🐭 ➛ Encontrado por Chayita coquette

── *📥 DESCARGA* ╏ 🎀
⬇️ ➛ Enviando audio embrujado...
🍬 ➛ Preparando dulce sonoro...

━━━━━━━━━━━
🎀🐭 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭🎀
━━━━━━━━━━━`
            }, { quoted: m })

            await conn.sendMessage(m.chat, {
                audio: { url: mediaUrl },
                fileName: `${title}.mp3`,
                mimetype: 'audio/mpeg'
            }, { quoted: m })
        }

        if(command === 'letra'){
            await m.react('📝')
            const lyricsRes = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.artist)}/${encodeURIComponent(song.title)}`).then(r => r.json())
            let lyrics = lyricsRes.lyrics || 'No se encontró la letra'
            if(lyrics.length > 1500) lyrics = lyrics.slice(0, 1500) + '\n\n...Letra muy larga, como siesta de ratoncita coquette 😴🎀'

            await conn.sendMessage(m.chat, {
                text: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹

⤷ ┇ 𝐋𝐄𝐓𝐑𝐀 ﹒ LETRA ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`LETRA HALLOWEEN\`\` 🎤 —˙𖦹.꒷

── *📊 CANCIÓN* ╏ 🎃
📌 ➛ *${title}* - *${author.name}*
🐭 ➛ Chayita coquette tararea esto

── *📜 LETRA* ╏ 🕯️
\`\`${lyrics}\`\`

── *📥 DESCARGA* ╏ 🎀
⬇️ ➛ Enviando audio embrujado...

━━━━━━━━━━━
🎀🐭 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭🎀
━━━━━━━━━━━`
            }, { quoted: m })

            await conn.sendMessage(m.chat, {
                audio: { url: mediaUrl },
                fileName: `${title}.mp3`,
                mimetype: 'audio/mpeg'
            }, { quoted: m })
        }

        await m.react('🎀')

    } catch(e) {
        await m.react('💀')
        const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
        let menuError = `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹

⤷ ┇ 𝐄𝐑𝐎𝐑 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`ERROR\`\` 💀 —˙𖦹.꒷

── *📝 DESCRIPCIÓN* ╏ 🎃
❌ ➛ ${e.message}
😿 ➛ La ratoncita no pudo reconocerlo, se asustó

── *💡 SOLUCIÓN* ╏ 🕯️
🔧 ➛ Usa un audio/video más claro
🔧 ➛ Asegúrate que tenga música con voz
🍬 ➛ Prueba con más dulces... digo, más volumen

━━━━━━━━━━━
🎀🐭 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭🎀
━━━━━━━━━━━`
        return conn.sendMessage(m.chat, { text: menuError }, { quoted: m })
    }
}

async function recognizeUrl(audioUrl) {
  const res = await fetch(SONGFINDER_API, {
    method: 'POST',
    headers: {'content-type': 'application/json', 'origin': 'https://songfinder.gg'},
    body: JSON.stringify({ url: audioUrl, startTime: 0, recaptchaToken: crypto.randomBytes(24).toString('base64url') })
  })
  const json = await res.json()
  if (!json?.success || !json?.track) throw new Error('No se encontró la canción')
  return json.track
}

async function uploadUguu(buffer) {
  const { ext, mime } = (await fileTypeFromBuffer(buffer)) || { ext: 'mp3', mime: 'audio/mpeg' }
  const blob = new Blob([buffer], { type: mime })
  const form = new FormData()
  form.append('files[]', blob, crypto.randomBytes(5).toString('hex') + '.' + ext)
  const res = await fetch(UGUU_UPLOAD, { method: 'POST', body: form })
  return (await res.json())?.files?.[0]?.url
}

function prepareClip(buffer, seconds = CLIP_SECONDS) {
  return new Promise(resolve => {
    const tmpIn = path.join(os.tmpdir(), `sf_${Date.now()}`)
    fs.writeFileSync(tmpIn, buffer)
    const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', tmpIn, '-t', String(seconds), '-vn', '-acodec', 'libmp3lame', '-ar', '44100', '-ac', '2', '-b:a', '128k', '-f', 'mp3', 'pipe:1'])
    const chunks = []
    ff.stdout.on('data', c => chunks.push(c))
    ff.on('close', () => { try{fs.unlinkSync(tmpIn)}catch{}; resolve(chunks.length? Buffer.concat(chunks) : buffer) })
  })
}

async function getMediaUrl(url) {
    try {
        const res = await fetch(`https://api.sventy.store/api/ytdl?url=${encodeURIComponent(url)}`).then(r => r.json())
        return res.data?.download || null
    } catch {
        return null
    }
}

function formatViews(views) {
    if (views === undefined) return "No disponible"
    if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`
    return views.toString()
}

handler.help = ['song', 'letra']
handler.tags = ['buscador']
handler.command = ['song', 'letra']
export default handler
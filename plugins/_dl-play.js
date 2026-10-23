import fetch from 'node-fetch'
import axios from 'axios'
import yts from 'yt-search'
import moment from 'moment-timezone'
moment.locale('es')

const handler = async (m, { conn, command, text }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

  if (!text) return conn.reply(m.chat, 
`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐘𝐓 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

  ꒱ ׁ. ᘏ 𝗖𝗢𝗠𝗔𝗡𝗗𝗢 ׅ 𝆬 ָ֢ ෆ
🎀 ࣪ ꕀ.${command} bad bunny dtmf ˚. ᵎᵎ

.⃟𖥔 ݁. 𖦹˙— \`\`EJEMPLO\`\` 🕯️ —˙𖦹.꒷
👻 ➛.play diles - bad bunny
🐭 ➛.play2 diles - video
🎃 ➛.play3 diles - video nota

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    let link = text
    let info = null
    if (!/^https?:\/\//.test(text)) {
      const s = await yts(text)
      if (!s.videos.length) throw new Error('No se encontró nada')
      info = s.videos[0]
      link = info.url
    }

    const isAudio = command === 'play'
    const apiUrl = isAudio
      ? `https://api-faa.my.id/faa/ytmp3?url=${encodeURIComponent(link)}`
      : `https://api-faa.my.id/faa/ytmp4?url=${encodeURIComponent(link)}`

    const j = await fetch(apiUrl).then(r => r.json())
    if (!j.status || !j.result) throw new Error('API FAA está caída')

    const downloadUrl = isAudio ? j.result.mp3 : j.result.download_url
    const title = (j.result.title || info?.title || 'chayita').replace(/[^\w\s-]/gi, '').trim()

    if (info) {
      const preview = 
`‧˚꒰🎀୭ 𓆩 𝗬𝗧 - 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐏𝐑𝐄𝐕𝐈𝐄𝐖 ﹒ ${command.toUpperCase()} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`INFO\`\` 🕸️ —˙𖦹.꒷

── *📊 VIDEO* ╏ 🎃
🎧 ➛ Título: *${info.title}*
👤 ➛ Canal: *${info.author.name}*
⏰ ➛ Duración: *${info.timestamp}*
👀 ➛ Vistas: *${info.views.toLocaleString()}*
🔗 ➛ Link: ${info.url}

── *📥 ESTADO* ╏ 🎀
⬇️ ➛ Enviando ${isAudio ? 'audio embrujado' : 'video maldito'}...
👻 ➛ Espera un momento

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`.trim()
      await conn.reply(m.chat, preview, m)
    }

    const res = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(res.data)
    const size = (buffer.length / 1024 / 1024).toFixed(2)
    const type = isAudio ? 'AUDIO EMBRUJADO 🎀' : 'VIDEO MALDITO 🎬'

    const finalText = 
`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭

⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀 ﹒ ${type} ：✿ 。
꒰ ◞⁺⊹ ．${fecha}

.⃟𖥔 ݁. 𖦹˙— \`\`INFO\`\` 🕯️ —˙𖦹.꒷

── *📊 DETALLES* ╏ 🎃
🎵 ➛ Título: *${title}*
🔌 ➛ API: *FAA-BOT*
⚖️ ➛ Peso: *${size} MB*
✨ ➛ Estado: *Listo - Embrujado*

━━━━━━━━━━━
🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`.trim()

    if (command === 'play') {
      await conn.reply(m.chat, finalText, m)
      return conn.sendMessage(m.chat, { audio: buffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m })
    }

    if (command === 'play2') {
      return conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: finalText }, { quoted: m })
    }

    if (command === 'play3') {
      return conn.sendMessage(m.chat, { video: buffer, mimetype: 'video/mp4', fileName: `${title}.mp4`, caption: finalText, ptv: true }, { quoted: m })
    }

  } catch (e) {
    console.log(e)
    return conn.reply(m.chat, `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓_*\n\n꒰💀꒱ Error: ${e.message}\n꒰👻꒱ La Chayita no encontró la canción`, m)
  }
}

handler.help = ['play <texto>', 'play2 <texto>', 'play3 <texto>']
handler.tags = ['descargas']
handler.command = ['play', 'play2', 'play3']
export default handler
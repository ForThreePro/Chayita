import axios from 'axios'
import moment from 'moment-timezone'
moment.locale('es')

// VIDEOS - Se mandan primero
let videos = [
    'https://telegra.ph/file/e278ca6dc7d26a2cfda46.mp4'
]

// AUDIOS - Van después del video
let audios = [
    'https://files.evogb.win/UbhAVn.opus'
]

// MENSAJES - Van al final
let mensajes = [
    '‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n👻 Aquí tienes tu audio embrujado bro 🎃',
]

let indice = 0

let handler = async (m, { conn }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')

    let videoUrl = videos[indice % videos.length]
    let audioUrl = audios[indice % audios.length]
    let texto = mensajes[indice % mensajes.length] || '✅ Listo bro'

    indice = (indice + 1)

    try {
        await m.react('🎀')

        // 1. DESCARGAR Y ENVIAR VIDEO PRIMERO
        let resVideo = await axios.get(videoUrl, { responseType: 'arraybuffer', timeout: 120000 })
        let videoBuffer = Buffer.from(resVideo.data)

        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            mimetype: 'video/mp4',
            caption: `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n⤷ ┇ 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀 ﹒ GEMIDOS ：✿ 。\n꒰ ◞⁺⊹ ．${fecha}\n\n👻 Video maldito enviado`
        }, { quoted: m })

        await new Promise(resolve => setTimeout(resolve, 800))

        // 2. DESCARGAR Y ENVIAR AUDIO
        let resAudio = await axios.get(audioUrl, { responseType: 'arraybuffer', timeout: 120000 })
        let audioBuffer = Buffer.from(resAudio.data)

        await conn.sendMessage(m.chat, {
            audio: audioBuffer,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: false
        }, { quoted: m })

        await new Promise(resolve => setTimeout(resolve, 500))

        // 3. ENVIAR MENSAJE AL FINAL
        await conn.reply(m.chat, texto, m)

        await m.react('🎀')

    } catch (err) {
        await m.react('💀')
        await m.reply(`‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💀 Error embrujado: ${err.message || err}`)
    }
}

handler.help = ['gemidos']
handler.tags = ['tools']
handler.command = /^(gemidos)$/i
export default handler
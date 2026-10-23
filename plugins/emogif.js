import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let emoji = text?.trim() || m.quoted?.text?.trim() || ''
  if (!emoji) return conn.reply(m.chat, head + `\n💀 Usa: *${usedPrefix + command} 😆*` + `\n━━━━━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
  emoji = [...emoji][0]

  try {
    await react('⏳')
    let api = `https://api-faa.my.id/faa/emojigerak?emoji=${encodeURIComponent(emoji)}`
    let res = await fetch(api)
    if (!res.ok) throw new Error(`API ${res.status}`)
    let buf = Buffer.from(await res.arrayBuffer())

    // detecta tipo
    let isMp4 = buf.slice(0,12).toString().includes('ftyp') || buf.slice(4,8).toString() === 'ftyp'
    let ext = isMp4? 'mp4' : 'gif'
    let tmpIn = path.join(tmpdir(), `emogif-${Date.now()}.${ext}`)
    let tmpOut = path.join(tmpdir(), `emogif-${Date.now()}.webp`)
    fs.writeFileSync(tmpIn, buf)

    try {
      await new Promise((resolve, reject) => {
        ffmpeg(tmpIn)
         .inputOptions(['-t','6'])
         .outputOptions([
            '-vcodec','libwebp',
            '-vf','scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000,fps=20',
            '-loop','0',
            '-ss','0',
            '-t','6',
            '-q:v','75',
            '-preset','default',
            '-an'
          ])
         .toFormat('webp')
         .on('end', resolve)
         .on('error', reject)
         .save(tmpOut)
      })
      let sticker = fs.readFileSync(tmpOut)
      await conn.sendMessage(m.chat, { sticker }, { quoted: m })
      try { fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut) } catch {}
    } catch (e) {
      console.log('ffmpeg falló, enviando directo:', e.message)
      // Fallback: WhatsApp convierte mp4/gif a sticker animado solo
      await conn.sendMessage(m.chat, { sticker: buf }, { quoted: m })
      try { fs.unlinkSync(tmpIn) } catch {}
    }

    await react('🎀')

  } catch (e) {
    console.error(e)
    await react('💀')
    return conn.reply(m.chat, head + `\n💀 Error emogif: ${e.message}` + `\n━━━━━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`, m)
  }
}

handler.help = ['emogif <emoji>']
handler.tags = ['sticker','fun']
handler.command = ['emogif','emojigerak','emojigif']
export default handler
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🦇\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let emoji = text?.trim() || m.quoted?.text?.trim() || ''
  if (!emoji) {
    await react('💀')
    return conn.reply(m.chat, head + `\n💀 Usa: *${usedPrefix + command} 😆*\nEjemplo: *${usedPrefix + command} 😭*` + `\n━━━━━━━━━━━━━━━\n🎃 *LUX X YALLICO - HALLOWEEN* 🦇`, m)
  }

  // saca solo primer emoji
  emoji = [...emoji][0] || emoji

  try {
    await react('⏳')
    let api = `https://api-faa.my.id/faa/emojigerak?emoji=${encodeURIComponent(emoji)}`
    let res = await fetch(api)
    if (!res.ok) throw new Error(`API ${res.status}`)
    let buf = Buffer.from(await res.arrayBuffer())

    let tmpIn = path.join(tmpdir(), `emogif-${Date.now()}.gif`)
    let tmpOut = path.join(tmpdir(), `emogif-${Date.now()}.webp`)
    fs.writeFileSync(tmpIn, buf)

    // convierte a sticker animado
    await new Promise((resolve, reject) => {
      ffmpeg(tmpIn)
        .outputOptions([
          '-vcodec','libwebp',
          '-vf','scale=512:512:flags=lanczos:force_original_aspect_ratio=increase,crop=512:512,setsar=1,fps=15',
          '-loop','0',
          '-lossless','0',
          '-q:v','70',
          '-preset','picture',
          '-an','-vsync','0'
        ])
        .toFormat('webp')
        .on('end', resolve)
        .on('error', reject)
        .save(tmpOut)
    })

    let sticker = fs.readFileSync(tmpOut)
    await conn.sendMessage(m.chat, { sticker }, { quoted: m })
    
    try { fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut) } catch {}
    await react('🎃')

  } catch (e) {
    console.error(e)
    await react('💀')
    return conn.reply(m.chat, head + `\n💀 Error emogif: ${e.message}\nPrueba con otro emoji` + `\n━━━━━━━━━━━━━━━\n🎃 *LUX X YALLICO - HALLOWEEN* 🦇`, m)
  }
}

handler.help = ['emogif <emoji>']
handler.tags = ['sticker']
handler.command = ['emogif','emojigerak','emojigif']

export default handler
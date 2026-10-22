import crypto from "crypto"
import { FormData, Blob } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import fetch from 'node-fetch'
import axios from 'axios'

async function myCloud(content) {
  const ft = await fileTypeFromBuffer(content)
  const form = new FormData()
  form.append("file", new Blob([content], { type: ft?.mime || 'image/jpeg' }), `${crypto.randomBytes(5).toString("hex")}.${ft?.ext || 'jpg'}`)
  const r = await fetch("https://evogb.win/api/upload", { method: "POST", body: form })
  const j = await r.json()
  return j.url || j.data?.url
}

async function faaBuffer(apiUrl) {
  const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('image')) {
    const buf = Buffer.from(await res.arrayBuffer())
    return buf
  }
  const j = await res.json().catch(async () => {
    const txt = await res.text()
    if (txt.trim().startsWith('<!DOCTYPE')) throw new Error('API poseída 🎃')
    throw new Error('Respuesta no JSON: ' + txt.slice(0,100))
  })
  let url = j.result?.url || j.result?.image || j.result || j.url || j.data
  if (typeof url === 'object') url = url.url || url.image
  if (!url || !String(url).startsWith('http')) throw new Error('API no dio url')
  const { data } = await axios.get(String(url).trim(), { responseType: 'arraybuffer' })
  return Buffer.from(data)
}

let handler = async (m, { conn, text, command }) => {
  let link = text?.trim()
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (!/image/.test(mime) && !link) {
    return conn.sendMessage(m.chat, { text: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n🎃🐭 𝗛𝗔𝗟𝗟𝗢𝗪𝗘𝗘𝗡 𝗖𝗢𝗤𝗨𝗘𝗧𝗧𝗘 🐭🎃\n\n꒰👻꒱ Responde a una foto para convertirla en anime embrujado y coquette 💅\n\n꒰🎀୭ .${command}` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

    if (/image/.test(mime) && !link) {
      let media = await q.download()
      link = await myCloud(media)
    }

    await conn.sendMessage(m.chat, { text: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n\n꒰🕸️꒱ Convirtiendo a anime Halloween coquette... 🐭🎃` }, { quoted: m })

    const buf = await faaBuffer(`https://api-faa.my.id/faa/toanime?url=${encodeURIComponent(link)}`)

    await conn.sendMessage(m.chat, { image: buf, caption: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n\n꒰👻꒱ Anime Halloween coquette listo 💅🐭\n‧˚꒰🎀୭ ${(buf.length/1024).toFixed(0)} KB` }, { quoted: m })

  } catch (e) {
    return conn.sendMessage(m.chat, { text: `‧˚₊꒰🎀💖 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 💖🎀꒱₊˚⊹\n\n꒰💀꒱ Error preciosa: ${e.message} 🎀` }, { quoted: m })
  }
}

handler.command = ['toanime', 'anime']
handler.tags = ['ai']
handler.help = ['toanime']
handler.group = true
export default handler
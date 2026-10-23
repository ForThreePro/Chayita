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
  // FIX: si devuelve PNG directo
  if (ct.includes('image')) {
    return Buffer.from(await res.arrayBuffer())
  }
  const j = await res.json().catch(async () => {
    const txt = await res.text()
    throw new Error('Respuesta no JSON: ' + txt.slice(0,100))
  })
  let resultData = j.result?.url || j.result?.image || j.result?.data || j.result || j.url || j.data || j.image
  if (typeof resultData === 'object') resultData = resultData.url || resultData.image || resultData.data
  if (!resultData) throw new Error('API vacía: ' + JSON.stringify(j).slice(0,120))

  const str = String(resultData).trim()
  if (str.startsWith('http')) {
    const { data } = await axios.get(str, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } })
    return Buffer.from(data)
  } else if (str.startsWith('data:image')) {
    return Buffer.from(str.split(',')[1], 'base64')
  } else {
    return Buffer.from(str, 'base64')
  }
}

let handler = async (m, { conn, text }) => {
  let link = text?.trim()
  let q = m.quoted? m.quoted : m
  let mime = (q.msg || q).mimetype || ''

  if (/image/.test(mime) &&!link) {
    try {
      await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
      await conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓 - 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝐂𝐎𝐐𝐔𝐄𝐓𝐓𝐄_*\n\n꒰👻꒱ Subiendo al cementerio evogb.win... 🕸️🎀` }, { quoted: m })
      let media = await q.download()
      link = await myCloud(media)
    } catch (e) {
      await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } })
      return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓_*\n\n꒰💀꒱ Error al subir: ${e.message}` }, { quoted: m })
    }
  }

  if (!link) {
    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓 - 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝐂𝐎𝐐𝐔𝐄𝐓𝐓𝐄_*\n\n꒰👻꒱ Responde a una imagen o manda link para exorcizar el fondo\n\n‧˚꒰🎀୭ Ejemplo:.removebg https://link.jpg` }, { quoted: m })
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: '🕸️', key: m.key } })

    const buffer = await faaBuffer(`https://api-faa.my.id/faa/removebg?url=${encodeURIComponent(link)}`)

    const apiText = `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓 - 𝐇𝐀𝐋𝐋𝐎𝐖𝐄𝐄𝐍 𝐂𝐎𝐐𝐔𝐄𝐓𝐓𝐄_*

╭───INFO ꒰👻꒱────╮
‧˚꒰🎀୭ Tipo: Removebg Embrujado Coquette
‧˚꒰🎀୭ Origen: evogb.win
‧˚꒰🎀୭ API: FAA-BOT
‧˚꒰🎀୭ Peso: ${(buffer.length / 1024).toFixed(0)} KB
╰─────── ݁ ˖Ი𐑼⋆────╯

꒰🎀꒱ Fondo exorcizado - listo para Halloween`

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })
    await conn.sendMessage(m.chat, { image: buffer, caption: apiText }, { quoted: m })
    await conn.sendMessage(m.chat, { document: buffer, mimetype: 'image/png', fileName: `removebg-chayita-halloween.png` }, { quoted: m })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💀', key: m.key } })
    return conn.sendMessage(m.chat, { text: `‧˚꒰🎀୭ *_𝐂𝐇𝐀𝐘𝐈𝐓𝐀 𝐁𝐎𝐓_*\n\n꒰💀꒱ Error: ${e.message}` }, { quoted: m })
  }
}

handler.command = ['removebg', 'nobg', 'quitarfondo']
handler.tags = ['tools']
handler.help = ['removebg']
handler.group = true
export default handler
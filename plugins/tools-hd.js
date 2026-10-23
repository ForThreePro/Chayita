import axios from 'axios'
import FormData from 'form-data'

async function stellarUpscale(buffer, scale, key) {
  let form = new FormData()
  form.append('file', buffer, { filename: `upscale-${scale}.jpg`, contentType: 'image/jpeg' })
  let url = `https://api.stellarwa.xyz/tools/upscale?method=local&scale=${scale}&key=${key}`

  let { data, headers } = await axios.post(url, form, {
    headers: form.getHeaders(),
    responseType: 'arraybuffer',
    timeout: 90000
  })

  // Si devuelve JSON con URL
  let str = data.toString('utf8').slice(0, 500)
  if (str.trim().startsWith('{')) {
    try {
      let json = JSON.parse(data.toString())
      let resultUrl = json.result || json.data || json.url
      if (resultUrl) {
        let img = await axios.get(resultUrl, { responseType: 'arraybuffer' })
        return Buffer.from(img.data)
      }
    } catch {}
  }
  return Buffer.from(data)
}

let handler = async (m, { conn, usedPrefix }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!/image/.test(mime)) {
    return conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n*Halloween Coquette Edition*\n\n💅 Responde a una imagen con *${usedPrefix}hd*\n\n> 🎀 Hará: x2 y luego automático a x4`, m)
  }

  let key = 'proyectsV2'

  try {
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    let media = await q.download()

    // PASO 1: x2
    await conn.reply(m.chat, '‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n👻 *PASO 1/2:* Mejorando a x2...', m)
    let firstHD = await stellarUpscale(media, 2, key)

    // PASO 2: x2 de nuevo = x4 total
    await conn.reply(m.chat, '‧˚꒰✨୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n🎀 *PASO 2/2:* Mejorando a x4 automático...', m)
    let finalHD = await stellarUpscale(firstHD, 2, key)

    await conn.sendFile(m.chat, finalHD, 'hd-x4.jpg', 
`‧˚꒰🎀୭ 𓆩 *HD x4 COMPLETADO* 𓆪 🐭

> ✿ x2 → x4 automático
> ✿ Chayita Bot | Halloween Coquette
> ✿ Stellar API`, m)

    await conn.sendMessage(m.chat, { react: { text: '🎀', key: m.key } })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { react: { text: '💔', key: m.key } })
    conn.reply(m.chat, `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n💔 Error: ${e.message}`, m)
  }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = ['hd', 'upscale', 'mejorar', 'remini']
export default handler
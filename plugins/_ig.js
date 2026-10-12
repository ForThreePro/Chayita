import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🦇\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let url = (text || '').trim()
  if (!url.includes('instagram.com')) return conn.reply(m.chat, head + `\n💀 Usa: *${usedPrefix+command} https://www.instagram.com/reel/...*`, m)

  try {
    await react('⏳')
    let api = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(url)}`
    let res = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    let json = await res.json()
    console.log('IGDL:', JSON.stringify(json).slice(0,1000))

    let list = json.result || json.data || json.downloads || json

    // normaliza a array de strings
    if (!Array.isArray(list)) {
      if (list.url) list = [list.url]
      else if (list.result) list = Array.isArray(list.result) ? list.result : [list.result]
      else if (json.url) list = [json.url]
      else list = [list]
    }

    let links = []
    for (let item of list) {
      if (typeof item === 'string' && item.startsWith('http')) links.push(item)
      else if (item?.url && typeof item.url === 'string') links.push(item.url)
      else if (item?.download && typeof item.download === 'string') links.push(item.download)
    }

    if (!links.length) throw new Error('Sin links: ' + JSON.stringify(json).slice(0,500))

    for (let link of links.slice(0,10)) {
      await conn.sendFile(m.chat, link, 'ig.mp4', head + `\n📥 IGDL\n🔗 ${url}\n━━━━━━━━━━━━━━━`, m)
    }
    await react('🎃')

  } catch (e) {
    console.error(e)
    await react('💀')
    conn.reply(m.chat, head + `\n💀 Error IG: ${e.message}\n━━━━━━━━━━━━━━━`, m)
  }
}

handler.help = ['igdl <url>']
handler.tags = ['downloader']
handler.command = ['igdl','ig','instagram','igreel']
export default handler
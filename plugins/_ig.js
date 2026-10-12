import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🦇\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let url = (text || '').trim()
  if (!url || !url.includes('instagram.com')) {
    await react('💀')
    return conn.reply(m.chat, head + `\n💀 Usa:\n*${usedPrefix+command} https://www.instagram.com/reel/DeQKKA8pJ0e/*\n━━━━━━━━━━━━━━━`, m)
  }

  try {
    await react('⏳')

    let api = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(url)}`
    let res = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    let json = await res.json()
    console.log(json)

    let data = json.result || json.data || json
    let dlUrl = null
    let caption = ''

    // la api suele devolver array
    if (Array.isArray(data)) dlUrl = data[0]?.url || data[0]
    else if (data.url) dlUrl = data.url
    else if (data.result) dlUrl = data.result
    else if (data.download) dlUrl = data.download
    else if (Array.isArray(data.downloads)) dlUrl = data.downloads[0]?.url
    else if (json.url) dlUrl = json.url

    if (!dlUrl) throw new Error('No se pudo extraer link: ' + JSON.stringify(json).slice(0,500))

    // si es array de varios
    let urls = Array.isArray(data) ? data : [ { url: dlUrl } ]
    if (urls.length === 1 && typeof urls[0] === 'string') urls = [{ url: urls[0] }]

    // si el dlUrl ya es directo mp4/jpg
    if (dlUrl.startsWith('http') && (dlUrl.includes('.mp4') || dlUrl.includes('.jpg'))) {
      await conn.sendFile(m.chat, dlUrl, 'ig.mp4', head + `\n📥 IGDL\n🔗 ${url}\n━━━━━━━━━━━━━━━`, m)
    } else {
      // intenta descargar y enviar
      for (let item of urls.slice(0,5)) {
        let link = item.url || item || dlUrl
        if (!link?.startsWith('http')) continue
        await conn.sendFile(m.chat, link, 'ig.mp4', head + `\n📥 IGDL\n🔗 ${url}\n━━━━━━━━━━━━━━━`, m)
      }
    }

    await react('🎃')
  } catch (e) {
    console.error(e)
    await react('💀')
    conn.reply(m.chat, head + `\n💀 Error IG: ${e.message}\n━━━━━━━━━━━━━━━`, m)
  }
}

handler.help = ['igdl <url ig>']
handler.tags = ['downloader']
handler.command = ['igdl','ig','instagram','igreel']

export default handler
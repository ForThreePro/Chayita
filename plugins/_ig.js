import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🦇\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let url = (text || '').trim()
  if (!url.includes('instagram.com')) {
    return conn.reply(m.chat, head + `\n💀 Usa: *${usedPrefix+command} https://www.instagram.com/reel/DeQKKA8pJ0e/*`, m)
  }

  try {
    await react('⏳')

    let json = null
    for (let i = 0; i < 3; i++) {
      try {
        let api = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(url)}`
        let res = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 })
        json = await res.json()
        if (json?.result?.url || json?.result?.length) break
      } catch (e) {
        console.log(`Intento ${i+1} fail:`, e.message)
        await new Promise(r => setTimeout(r, 1500))
      }
    }

    if (!json) throw new Error('API no respondió (ECONNRESET), intenta de nuevo en 5s')

    console.log(json)

    // tu json: result.url = [ "https://d.rapidcdn.app/..." ]
    let result = json.result || json.data || json
    let urls = result.url || result.urls || result.download || []
    if (!Array.isArray(urls)) urls = [urls]

    let captionMeta = result.metadata?.caption || ''
    let likes = result.metadata?.like || ''

    // limpia urls que sean objetos
    urls = urls.map(u => typeof u === 'string'? u : u?.url).filter(v => typeof v === 'string' && v.startsWith('http'))

    if (!urls.length) throw new Error('Sin links: ' + JSON.stringify(json).slice(0,600))

    for (let dl of urls.slice(0,10)) {
      await conn.sendFile(m.chat, dl, 'ig.mp4', head + `\n📥 *IGDL*\n❤️ ${likes} | 💬 ${captionMeta.slice(0,100)}\n🔗 ${url}\n━━━━━━━━━━━━━━━`, m)
    }

    await react('🎃')

  } catch (e) {
    console.error(e)
    await react('💀')
    conn.reply(m.chat, head + `\n💀 Error IG: ${e.message}\n━━━━━━━━━━━━━━━`, m)
  }
}

handler.help = ['ig <url>']
handler.tags = ['descargas']
handler.command = ['igdl','ig','instagram','igreel']
export default handler
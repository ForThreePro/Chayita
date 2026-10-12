import fetch from 'node-fetch'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🦇\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let url = (text || '').trim()
  if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
    return conn.reply(m.chat, head + `\n💀 Usa:\n*${usedPrefix+command} https://www.facebook.com/...*\n*${usedPrefix+command} https://fb.watch/...*\n━━━━━━━━━━━━━━━`, m)
  }

  try {
    await react('⏳')

    let json = null
    for (let i = 0; i < 3; i++) {
      try {
        let api = `https://api-faa.my.id/faa/fbdownload?url=${encodeURIComponent(url)}`
        let res = await fetch(api, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 })
        json = await res.json()
        if (json?.result || json?.data || json?.url) break
      } catch (e) {
        console.log(`Intento ${i+1} fail:`, e.message)
        await new Promise(r => setTimeout(r, 1500))
      }
    }

    if (!json) throw new Error('API no respondió, intenta en 5s')

    console.log(json)
    let result = json.result || json.data || json

    // la api de fb suele devolver: result.hd, result.sd, result.url, result.urls[]
    let urls = []
    if (Array.isArray(result)) urls = result
    else if (result.url) urls = Array.isArray(result.url) ? result.url : [result.url]
    else if (result.hd) urls = [result.hd]
    else if (result.sd) urls = [result.sd]
    else if (result.urls) urls = result.urls
    else if (json.url) urls = [json.url]

    // normaliza
    urls = urls.map(u => typeof u === 'string' ? u : u?.url || u?.hd || u?.sd).filter(v => typeof v === 'string' && v.startsWith('http'))

    // prioriza HD
    let hd = result.hd || result.HD
    let sd = result.sd || result.SD

    if (hd && typeof hd === 'string') {
      await conn.sendFile(m.chat, hd, 'fb_hd.mp4', head + `\n📥 *FBDL - HD*\n🔗 ${url}\n━━━━━━━━━━━━━━━`, m)
    } else if (urls.length) {
      for (let dl of urls.slice(0,5)) {
        await conn.sendFile(m.chat, dl, 'fb.mp4', head + `\n📥 *FBDL*\n🔗 ${url}\n━━━━━━━━━━━━━━━`, m)
      }
    } else {
      throw new Error('Sin links: ' + JSON.stringify(json).slice(0,600))
    }

    // si hay SD aparte manda también
    if (hd && sd && hd !== sd) {
      // opcional: no spamear con sd si ya mandó hd
    }

    await react('🎃')

  } catch (e) {
    console.error(e)
    await react('💀')
    conn.reply(m.chat, head + `\n💀 Error FB: ${e.message}\n━━━━━━━━━━━━━━━`, m)
  }
}

handler.help = ['fb <url>', 'facebook <url>']
handler.tags = ['descargas']
handler.command = ['fb','facebook','fbdl','fbdownload']

export default handler
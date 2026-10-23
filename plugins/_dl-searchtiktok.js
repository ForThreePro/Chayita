import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import { execSync } from 'child_process'
import moment from 'moment-timezone'
moment.locale('es')

const API_KEY = 'proyectsV2'
const BASE = 'https://api.stellarwa.xyz'
let ttCache = new Map()

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n꒰ ◞⁺⊹ ．${fecha}\n`
  const footer = `\n━━━━━━━━━━━━━━━\n🎀 *CHAYITA BOT - HALLOWEEN COQUETTE* 🐭`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  if (!text) return conn.reply(m.chat, head + `\n💀 Usa: *${usedPrefix + command} Goku Black*` + footer, m)

  let type = ''
  if (['ttsearch','tiktoksearch','ttss'].includes(command)) type = 'tiktok'
  if (['pinterest','pin','pinterestsearch'].includes(command)) type = 'pinterest'
  if (['pinvid','pinterestvideo','pinterestvid'].includes(command)) type = 'pinterestvideo'
  if (['apk','apksearch','apkdl'].includes(command)) type = 'apk'

  const fetchApi = async (t, q) => {
    let r = await fetch(`${BASE}/search/${t}?query=${encodeURIComponent(q)}&key=${API_KEY}`)
    let txt = await r.text()
    if (txt.startsWith('<!DOCTYPE')) return []
    let j = JSON.parse(txt)
    let li = j.data || j.result || j.pins || j.videos || []
    if (!Array.isArray(li)) li = [li]
    return li.flat().filter(Boolean)
  }

  try {
    await react('🔍')
    let list = await fetchApi(type, text)
    if (!list.length) throw new Error(`Sin resultados para "${text}"`)

    if (type === 'pinterestvideo') {
      let vids = []
      for (let o of list) {
        if (o.dl?.includes('.mp4')) vids.push(o)
        else {
          let str = JSON.stringify(o)
          let matches = str.match(/https:\/\/v1\.pinimg[^\"]+\.mp4/g)
          if (matches) matches.forEach(u => vids.push({ dl: u, title: text }))
        }
      }
      if (!vids.length) throw new Error('No hay mp4')
      let v = vids[Math.floor(Math.random() * vids.length)]
      let r = await fetch(v.dl, { headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.pinterest.com/' } })
      let buf = Buffer.from(await r.arrayBuffer())
      let inF = path.join(tmpdir(), `in_${Date.now()}.mp4`)
      let outF = path.join(tmpdir(), `out_${Date.now()}.mp4`)
      fs.writeFileSync(inF, buf)
      try { execSync(`ffmpeg -y -i "${inF}" -c copy -movflags +faststart "${outF}"`) } catch { fs.copyFileSync(inF, outF) }
      let cap = head + `\n‧˚꒰🎀୭ *PINVID - ${text}* 🎃\n` + footer
      await conn.sendFile(m.chat, outF, 'pinvid.mp4', cap, m, false, { mimetype: 'video/mp4' })
      try { fs.unlinkSync(inF); fs.unlinkSync(outF) } catch {}
      await react('🎀')
      return
    }

    if (type === 'pinterest') {
      // SALE DE LO QUE BUSCAS - EXACTO
      let imgs = []
      for (let o of list) {
        let u = o.dl || o.url || o.image || o.img || o.imageUrl || o.src || o.thumbnail || ''
        if (typeof u === 'string' && u.startsWith('http') &&!u.includes('.mp4')) imgs.push(u)
        let str = JSON.stringify(o)
        let m = str.match(/https:\/\/i\.pinimg[^\"]+\.(jpg|jpeg|png|webp)/g)
        if (m) imgs.push(...m)
      }
      imgs = [...new Set(imgs)].sort(() => 0.5 - Math.random()).slice(0, 5)
      if (!imgs.length) throw new Error('No hay imágenes')

      for (let i = 0; i < imgs.length; i++) {
        let cap = i === 0? head + `\n‧˚꒰🎀୭ *PINTEREST - ${text}* 🎃\n\n꒰ 👻 ꒱ Resultados para *${text}*\n` + footer : `꒰ 🎀 ꒱ ${i+1}/5 - ${text}`
        await conn.sendFile(m.chat, imgs[i], 'pin.jpg', cap, m)
        await new Promise(r => setTimeout(r, 400))
      }
      await react('🎀')
      return
    }

    if (type === 'tiktok') {
      let cache = ttCache.get(m.chat) || []
      let disp = list.filter(v => {
        let u = v.dl || v.play || v.hdplay || v.video || v.url
        return u &&!cache.includes(u)
      })
      if (!disp.length) { disp = list; cache = [] }
      let v = disp[Math.floor(Math.random() * disp.length)]
      let url = v.dl || v.play || v.hdplay || v.video || v.url
      cache.push(url); if (cache.length > 20) cache.shift()
      ttCache.set(m.chat, cache)
      let cap = head + `\n‧˚꒰🎀୭ *TTSEARCH - ${text}* 🎃\n` + footer
      await conn.sendFile(m.chat, url, 'tt.mp4', cap, m)
      await react('🎀')
      return
    }

    if (type === 'apk') {
      let v = list[0]
      let dl = v.dl || v.url
      let title = v.name || v.title || text
      await conn.sendMessage(m.chat, { document: { url: dl }, mimetype: 'application/vnd.android.package-archive', fileName: `${title.replace(/[^a-z0-9]/gi,'_')}.apk` }, { quoted: m })
      await react('🎀')
      return
    }

  } catch (e) {
    console.error(e)
    await react('💀')
    return conn.reply(m.chat, head + `\n💀 Error en *${type}*: ${e.message}` + footer, m)
  }
}

handler.help = ['pinterest','pinvid','ttsearch','apk']
handler.tags = ['search']
handler.command = ['pinterest','pin','pinterestsearch','pinvid','pinterestvideo','pinterestvid','ttsearch','tiktoksearch','ttss','apk','apksearch','apkdl']
export default handler
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import FormData from 'form-data'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
  const head = `‧˚꒰🎃୭ 𓆩 𝗟𝗨𝗫 𝗫 𝗬𝗔𝗟𝗟𝗜𝗖𝗢 𓆪 🦇\n\n꒰ ◞⁺⊹ ．${fecha}\n`
  const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }

  let url = (text || '').trim().split(/\s+/)[0]
  let q = m.quoted

  try {
    await react('⏳')

    // Si responde a video
    if (q && (!url || !url.startsWith('http'))) {
      let mime = q.mimetype || q.msg?.mimetype || q.message?.videoMessage?.mimetype || ''
      let buffer = null
      try { buffer = await q.download() } catch { try { buffer = await conn.downloadMediaMessage(q) } catch {} }
      
      if (!buffer) throw new Error('No pude descargar el video citado')
      
      let tmp = path.join(tmpdir(), `hdvid-${Date.now()}.mp4`)
      fs.writeFileSync(tmp, buffer)

      let form = new FormData()
      form.append('reqtype', 'fileupload')
      form.append('fileToUpload', fs.createReadStream(tmp))

      let up = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
      let link = (await up.text()).trim()
      try { fs.unlinkSync(tmp) } catch {}
      if (!link.startsWith('http')) throw new Error('Catbox error: ' + link)
      url = link
    }

    if (!url || !url.startsWith('http')) {
      await react('💀')
      return conn.reply(m.chat, head + `\n💀 Usa:\n• *${usedPrefix+command} https://files.evogb.win/krBhdi.mp4*\n• Responde a un video con *${usedPrefix+command}*\n━━━━━━━━━━━━━━━`, m)
    }

    // Crear job
    let apiUrl = `https://api-faa.my.id/faa/hdvid?url=${encodeURIComponent(url)}`
    let res = await fetch(apiUrl)
    let json = await res.json()
    if (!json.job_id) throw new Error('API fallo: ' + JSON.stringify(json).slice(0,400))

    let job_id = json.job_id
    let resultEndpoint = json.result
    await conn.reply(m.chat, head + `\n⏳ Escalando a HD...\n🆔 \`${job_id}\`\n⏱ Tarda 1-3 min, te aviso cuando termine\n━━━━━━━━━━━━━━━`, m)

    // Polling largo 4 min (48 x 5s)
    let finalBuf = null
    let finalUrl = null
    for (let i = 0; i < 48; i++) {
      await new Promise(r => setTimeout(r, 5000))
      try {
        let check = await fetch(resultEndpoint)
        let ct = check.headers.get('content-type') || ''
        if (ct.includes('video')) {
          finalBuf = Buffer.from(await check.arrayBuffer())
          break
        }
        let txt = await check.text()
        try {
          let j = JSON.parse(txt)
          let out = j.url || j.result || j.download || j.data?.url
          if (out && out.startsWith('http')) { finalUrl = out; break }
        } catch {
          if (txt.trim().startsWith('http')) { finalUrl = txt.trim(); break }
        }
      } catch {}
    }

    if (finalUrl && !finalBuf) {
      let vr = await fetch(finalUrl)
      finalBuf = Buffer.from(await vr.arrayBuffer())
    }

    if (!finalBuf) throw new Error(`Timeout, pero tu job sigue: ${job_id}\nConsulta manual: ${resultEndpoint}\nUsa luego: ${usedPrefix}hdvid ${url}`)

    await conn.sendFile(m.chat, finalBuf, `HD-${job_id}.mp4`, head + `\n✨ Video mejorado a HD\n🆔 ${job_id}\n━━━━━━━━━━━━━━━`, m)
    await react('🎃')

  } catch (e) {
    console.error(e)
    await react('💀')
    conn.reply(m.chat, head + `\n💀 Error HD: ${e.message}\n━━━━━━━━━━━━━━━`, m)
  }
}

handler.help = ['hdvid <url/reply video>']
handler.tags = ['tools','video']
handler.command = ['hdvid','hdvideo','mejorar','escalador','hd']
export default handler
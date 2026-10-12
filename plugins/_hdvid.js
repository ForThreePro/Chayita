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

  let url = (text || '').trim()
  let q = m.quoted ? m.quoted : m
  let isVideo = q.mtype?.includes('video') || q.msg?.mimetype?.includes('video')

  try {
    await react('⏳')

    if (!url && isVideo) {
      let buffer = await q.download()
      let tmp = path.join(tmpdir(), `hdvid-${Date.now()}.mp4`)
      fs.writeFileSync(tmp, buffer)
      let form = new FormData()
      form.append('reqtype', 'fileupload')
      form.append('fileToUpload', fs.createReadStream(tmp))
      let upload = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
      let link = await upload.text()
      try { fs.unlinkSync(tmp) } catch {}
      if (!link.includes('catbox')) throw new Error('Fallo upload: ' + link)
      url = link.trim()
    }

    if (!url || !url.startsWith('http')) {
      return conn.reply(m.chat, head + `\n💀 Usa: *${usedPrefix+command} https://...mp4* o responde a video`, m)
    }

    // 1. Crear job
    let apiUrl = `https://api-faa.my.id/faa/hdvid?url=${encodeURIComponent(url)}`
    let res = await fetch(apiUrl)
    let json = await res.json()

    if (!json.status || !json.job_id) throw new Error('API: ' + JSON.stringify(json).slice(0,500))
    
    let job_id = json.job_id
    let resultEndpoint = json.result // https://api-faa.my.id/faa/result?id=...

    await conn.reply(m.chat, head + `\n⏳ Mejorando a HD...\n🆔 Job: \`${job_id}\`\n⏱ Espera 10-30s\n━━━━━━━━━━━━━━━`, m)

    // 2. Polling del resultado
    let finalUrl = null
    for (let i = 0; i < 20; i++) { // 20 intentos x 3s = 60s max
      await new Promise(r => setTimeout(r, 3000))
      let check = await fetch(resultEndpoint)
      let checkType = check.headers.get('content-type') || ''
      
      if (checkType.includes('video')) {
        // ya es el video
        let buf = Buffer.from(await check.arrayBuffer())
        await conn.sendFile(m.chat, buf, 'hd.mp4', head + `\n✨ Video HD listo!\n🆔 ${job_id}\n━━━━━━━━━━━━━━━`, m)
        await react('🎃')
        return
      }

      if (checkType.includes('application/json')) {
        let j = await check.json()
        // algunos devuelven {status:'done', url:'...'} o {result:'...'}
        if (j.status === true && j.url) finalUrl = j.url
        else if (j.status === true && j.result) finalUrl = j.result
        else if (j.download) finalUrl = j.download
        else if (j.data?.url) finalUrl = j.data.url
        else if (j.url && j.url.includes('http')) finalUrl = j.url

        // si es pending, sigue
        if (finalUrl) break
        if (j.status === 'processing' || j.status === 'pending' || j.status === false) continue
      } else {
        let txt = await check.text()
        if (txt.trim().startsWith('http')) { finalUrl = txt.trim(); break }
      }
    }

    if (!finalUrl) throw new Error('Timeout, intenta consultar manual: ' + resultEndpoint)

    let vidRes = await fetch(finalUrl)
    let buf = Buffer.from(await vidRes.arrayBuffer())
    await conn.sendFile(m.chat, buf, 'hd.mp4', head + `\n✨ Video mejorado a HD\n🔗 ${finalUrl}\n━━━━━━━━━━━━━━━`, m)
    await react('🎃')

  } catch (e) {
    console.error(e)
    await react('💀')
    conn.reply(m.chat, head + `\n💀 Error HD: ${e.message}\n━━━━━━━━━━━━━━━`, m)
  }
}

handler.help = ['hdvid <url/reply>']
handler.tags = ['tools','video']
handler.command = ['hdvid','hdvideo','mejorar','escalador']
export default handler
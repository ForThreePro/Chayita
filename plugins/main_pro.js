import fs from 'fs'
import os from 'os'
import * as googleTTS from 'google-tts-api'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import { tmpdir } from 'os'
import moment from 'moment-timezone'
moment.locale('es')

let handler = async (m, { conn, command, text, usedPrefix }) => {
    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY hh:mm:ss a')
    const react = async (t) => { try { await conn.sendMessage(m.chat, { react: { text: t, key: m.key } }) } catch {} }
    const head = `‧˚꒰🎀୭ 𓆩 𝗖𝗛𝗔𝗬𝗜𝗧𝗔 𝗕𝗢𝗧 𓆪 🐭\n\n꒰ ◞⁺⊹ ．${fecha}\n`
    const clockString = (ms) => {
        let d=Math.floor(ms/86400000), h=Math.floor(ms/3600000)%24, mi=Math.floor(ms/60000)%60, s=Math.floor(ms/1000)%60
        return `${d}d ${h}h ${mi}m ${s}s`
    }

    if (command==='owner'||command==='creator') {
        await react('👑')
        return conn.sendMessage(m.chat, { text: head+`\n👑 *Dueña de la cripta:* Chayita\n+54 11 2819-8851\nwa.me/541128198851 🎀`, mentions:['541128198851@s.whatsapp.net'] }, { quoted:m })
    }
    if (command==='ping'||command==='p') {
        let start=Date.now(); await react('⚡')
        let speed=Date.now()-start
        return conn.reply(m.chat, head+`\n👻 *Pong:* ${speed}ms 🎀`, m)
    }
    if (command==='cleartmp') {
        const p='./tmp'; if(fs.existsSync(p)) fs.readdirSync(p).forEach(f=>fs.unlinkSync(`${p}/${f}`))
        await react('🎀'); return m.reply(head+`\n🗑️ Cripta limpiada`)
    }
    if (command==='cpu') {
        await react('💻'); return m.reply(head+`\n💻 CPU de la cripta: ${os.loadavg()[0].toFixed(2)}%`)
    }
    if (command==='ram') {
        let ram=(process.memoryUsage().heapUsed/1024/1024).toFixed(2)
        await react('💾'); return m.reply(head+`\n💾 RAM embrujada: ${ram} MB`)
    }
    if (command==='uptime') {
        await react('⏱️'); return m.reply(head+`\n⏱️ Tiempo en la cripta: ${clockString(process.uptime()*1000)}`)
    }
    if (command==='info') {
        let ram=(process.memoryUsage().heapUsed/1024/1024).toFixed(2)
        await react('🎀')
        return m.reply(head+`\n🎀 *Info de la Cripta*\n⏱️ ${clockString(process.uptime()*1000)}\n💾 ${ram} MB\n💻 ${os.loadavg()[0].toFixed(2)}%`, m)
    }
    if (['tts','gtts','ttss'].includes(command)) {
        let txt = text || m.quoted?.text || ''
        if(!txt){ await react('💀'); return m.reply(head+`\n💀 Usa: *${usedPrefix}tts Hola*`, m) }
        try{
            await react('🎙️')
            let url = googleTTS.getAudioUrl(txt,{lang:'es',slow:false,host:'https://translate.google.com',timeout:10000})
            let tmp = path.join(tmpdir(), `tts-${Date.now()}.opus`)
            await new Promise((res,rej)=>{ ffmpeg(url).audioCodec('libopus').toFormat('opus').outputOptions(['-ac 1','-b:a 64k']).on('end',res).on('error',rej).save(tmp) })
            let buf = fs.readFileSync(tmp)
            await conn.sendMessage(m.chat,{audio:buf,mimetype:'audio/ogg; codecs=opus',ptt:true},{quoted:m})
            fs.unlinkSync(tmp); await react('🎀')
        }catch{ await react('💀'); m.reply(head+`\n💀 Error TTS`, m) }
    }
}

handler.help = ['owner','ping','cleartmp','cpu','ram','uptime','info','tts <texto>']
handler.tags = ['main']
handler.command = /^(owner|creator|ping|p|cleartmp|cpu|ram|uptime|info|g?tts|ttss)$/i
export default handler
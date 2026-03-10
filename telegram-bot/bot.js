import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.TG_TOKEN
const chatId = process.env.TG_CHAT_ID

const bot = new TelegramBot(token,{polling:true})

bot.onText(/\/start/, (msg)=>{
 bot.sendMessage(msg.chat.id,'AlgoWhirl Bot Active 🚀')
})

export async function sendUpdate(text){
 await bot.sendMessage(chatId,text)
}

setInterval(()=>{
 const volume = Math.floor(Math.random()*3000000)
 const traders = Math.floor(Math.random()*2000)

 const message = `AlgoWhirl Update 🚀\n\nVolume: $${volume}\nTraders: ${traders}\n\nTrade Perps. Earn AWT.`

 bot.sendMessage(chatId,message)

},3600000)

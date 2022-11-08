import express from 'express'
import dotenv from 'dotenv'
import TelegramBot from 'node-telegram-bot-api'
import keyboards from './keyboards/keyboards.js'
import { read, write } from './utils/Fs.utils.js'

dotenv.config()

const app = express()
app.use(express.json())

const bot = new TelegramBot(process.env.TOKEN, {
  polling: true
})


bot.onText(/\/start/, msg => {

  bot.sendMessage(msg.chat.id, `salom ${msg.from.first_name}`, {
    reply_markup: {
      keyboard: keyboards.menu,
      resize_keyboard: true
    }
  })
})

bot.on('message', msg => {

  const chatId = msg.chat.id

  if (msg.text == 'bizning kurslar 📕') {
    bot.sendMessage(chatId, 'bizning kurslar', {
      reply_markup: {
        keyboard: keyboards.courses,
        resize_keyboard: true
      }
    })
  }

})

bot.on('message', msg => {

  const chatId = msg.chat.id

  if (msg.text == 'asosiy menu') {
    bot.sendMessage(chatId, `asosiy menu`, {
      reply_markup: {
        keyboard: keyboards.menu,
        resize_keyboard: true
      }
    })
  }

})

bot.on('message', msg => {
  const chatId = msg.chat.id

  const foundCourse = read('courses.json').find(e => e.name == msg.text)

  if (foundCourse) {
    bot.sendPhoto(chatId, 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/44ca6092-045c-47cd-8701-a5a18c6ca798/da5ekfb-af139813-d9df-47f9-906f-1c7fbc93220e.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzQ0Y2E2MDkyLTA0NWMtNDdjZC04NzAxLWE1YTE4YzZjYTc5OFwvZGE1ZWtmYi1hZjEzOTgxMy1kOWRmLTQ3ZjktOTA2Zi0xYzdmYmM5MzIyMGUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.iWGJ3KPcfmK4sPYRhtwTkFNoRUozZcxGCFkm5MwRzc4', {
      caption: `
        <i>
          ${foundCourse.description}
        </i>\n <span class="tg-spoiler">${foundCourse.price}</span>
      `,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'royhatdan otish',
              callback_data: foundCourse.id
            }
          ]
        ]
      }
    })
  }


})



bot.on('callback_query', async msg => {

  const chatId = msg.message.chat.id

  if (msg.data) {
    const userContact = await bot.sendMessage(chatId, 'kontaktingizni ulashing', {
      reply_markup: JSON.stringify({
        keyboard: [
          [{
            text: 'kontaktni ulashish',
            request_contact: true
          }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        force_reply: true
      })
    })

    bot.onReplyToMessage(userContact.chat.id, userContact.message_id, async contactMsg => {

      const allRequests = read('requets.json')

      allRequests.push({
        id: allRequests.at(-1)?.id + 1 || 1,
        course: msg.data,
        contact: contactMsg.contact.phone_number,
        name: contactMsg.from.first_name
      })

      const newRequest = await write('requets.json', allRequests)

      if (newRequest) {
        bot.sendMessage(contactMsg.chat.id, 'sizning sorovingiz qabul qilindi', {
          reply_markup: {
            keyboard: keyboards.menu,
            resize_keyboard: true
          }
        })
      }
    })
  }
})

// bot.on('contact', msg => {

//   bot.sendMessage(msg.chat.id, 'lakatsiya', {
//     reply_markup: JSON.stringify({
//       keyboard: [
//         [
//           {
//             text: 'lakatsiya',
//             request_location: true
//           }
//         ]
//       ],
//       resize_keyboard: true
//     })
//   })
// })

// bot.on('location', async msg => {

//   const { latitude, longitude } = msg.location

//   const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=87f526f534114673b84ec3e7d9b3adda`)

//   const { results: [address] } = await response.json()

//   console.log(address);
// })


app.get('/courses', (req, res) => {
  res.json(read('courses.json'))
})

app.post('/newCours', async (req, res) => {
  const { name, price, description } = req.body

  const allCourses = read('courses.json')
  allCourses.push({
    id: allCourses.at(-1)?.id + 1 || 1,
    name, price, description
  })

  await write('courses.json', allCourses)
  res.json('ok')
})

app.listen(process.env.PORT ?? 8484, console.log(process.env.PORT ?? 8484))
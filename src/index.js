const { Telegraf, Markup } = require('telegraf');
const { User } = require("./models/user.schema")
const db = require("./db/db");
const dotenv = require("dotenv");
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Telegraf(BOT_TOKEN)
const adminId = process.env.ADMIN_ID

dotenv.config()
db()

bot.command("start", ctx => {
    const salom = `Assalomu alaykum${ctx.from?.first_name} ${ctx.from?.last_name}

 Xush kelibsiz!
    
Bizning botimizda siz turli ta'lim yo'nalishlari bo'yicha ishlarga buyurtma berishingiz mumkin. Buyurtmangizni to'g'ridan-to'g'ri botda qoldiring va bizsizga vazifani bajarishda yordam beramiz. Bundan tashqari, bizda tayyor hujjatlarni yuklab olish imkoniyati ham mavjud. Agar sizga allaqachon tayyorlangan materiallar kerak bo'lsa, ularni bizning botimizdam osongina topishingiz mumkin.`;

    ctx.reply(salom, Markup.inlineKeyboard([
        Markup.button.callback("🎓 Ish buyurtma buyurish", "buyurtma"),

    ]))

})

bot.action("buyurtma", async (ctx) => {
    const telegram_id = ctx.chat.id
    const findUser = await User.findOne({ telegram_id: telegram_id })

    if (!findUser) {
        ctx.reply('Iltimos ro\'yhatdan o\'ting', Markup.keyboard([
            Markup.button.contactRequest('Ro\'yhatdan o\'tish'),
        ]).resize());

    } else {
        return ctx.reply("Yozing")
    }
});

bot.on("contact", async (ctx) => {
    const telegram_id = ctx.from.id;
    const username = ctx.from.username || "";
    const phone_number = ctx.message.contact.phone_number;
    const full_name = `${ctx.from.first_name}${ctx.from.last_name ? " " + ctx.from.last_name : ""}`;
    let emojiUser = ""
    const last_name = ctx.from.last_name
    const last_nameCheck = last_name?.charAt(last_name.length - 1)
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    const findUser = await User.findOne({ telegram_id: telegram_id })

    if (last_nameCheck == "a") {
        emojiUser = "🙎‍♀️"

    } else if (last_nameCheck === undefined || !last_nameCheck) {

        emojiUser = "👀"

    } else emojiUser = "🙎‍♂️"

    const userInfo = `
${emojiUser} ${full_name} ro'yhatdan o'tdi

• username : @${username}

• telegram_id : ${telegram_id} 
    
• phone_number : ${phone_number}
    
• date : ${formattedDate}`

    try {
        if (!findUser) {
            await ctx.telegram.sendMessage(adminId, userInfo);
            await ctx.reply("Rahmat! Ish  buyurishigiz mumkun");
            await User.create({ full_name, telegram_id, username, phone_number })

        } else await ctx.reply("Ro'yhatdan o'tgansiz");

    } catch (error) {
        console.error("Error sending user data to admin:", error);
        await ctx.reply("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    }
});

bot.launch()
    .then(() => {
        console.log("Bot started successfully!");
    })
    .catch((err) => {
        console.error("Error starting bot:", err);
    });
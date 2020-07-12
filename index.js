const Discord = require('discord.js');
require('dotenv-flow').config();

const config = {
    token: process.env.BOOK_BOT_TOKEN,
    owner: process.env.OWNER,
    prefix: process.env.PREFIX
};

const bot = new Discord.Client();

bot.login(config.token);
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
    content = msg.content.split(' ');
    switch(content[0]) {
        case '!bookbot':
            msg.reply(
                "Hi, I'm the Book Exchange Bot :robot:! I can help you manage book exchanges. \n" +
                "Here are some ways you can interact with me:\n" +
                "!bookbot  :point_right:  Show this message\n" +
                "!newbook <book name, optionally with author>  :point_right:  update your shelf list with the given book and post link\n" +
                "!reading <book name, optionally with author>  :point_right:  update your reading list with the given book and post link\n" +
                "!justread <book name, optionally with author>  :point_right:  update your read list with the given book and post link\n" +
                "!viewshelf  :point_right:  View all available books with owner and status (reading, lent, read)\n" +
                "!viewshelf @user  :point_right:  View the bookshelf of the given user\n" +
                "!loan <book name, optionally with author> @user  :point_right:  Update your loaned list to reflect that the given book " +
                "was lent to the given user"
            );
            break;
        case '!newbook':
            break;
        case '!reading':
            break;
        case '!justread':
            break;
        case '!viewshelf':
            break;
        case '!loan':
            break;
        default:
    }
});

function getFromGoodreads(book_name, author = null) {
    // TODO query goodreads API
}

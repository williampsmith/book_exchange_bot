const Discord = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv-flow').config();

const config = {
    token: process.env.BOOK_BOT_TOKEN,
    owner: process.env.OWNER,
    db: process.env.DB,
    db_user: process.env.DB_USER,
    db_port: process.env.DB_PORT
};

initdb(config);
run(config);

function initdb(config) {
    // init express
    const express_app = express();
    express_app.use(bodyParser.json());
    express_app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    // init thread pool for requests
    const Pool = require('pg').Pool;
    const pool = new Pool({
        user: config.db_user,
        host: 'localhost',
        database: config.db,
        // password: 'password',  # TODO -- do I need this????
        port: config.db_port,
    });

    // root endpoint
    express_app.get('/', (request, response) => {
      response.json({ info: 'Node.js, Express, and Postgres API' })
    });
    console.log(`DB PORT: ${process.env.DB_PORT}`); // TODO -- REMOVE -------------

    express_app.listen(config.db_port, () => {
      console.log(`Express app running on port ${config.db_port}.`);
    });
}


function run(config) {
    const PREFIX = "!!";
    const bot = new Discord.Client();
    bot.login(config.token);
    bot.on('ready', () => {
        console.log(`Logged in as ${bot.user.tag}!`);
    });

    bot.on('message', message => {
        if (message.author.bot) return;
        if (message.content.indexOf(PREFIX) !== 0) return;

        const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        switch(command) {
            case 'bookbot':
                message.reply(
                    "Hi, I'm the Book Exchange Bot :robot:! I can help you manage book exchanges. \n" +
                    "Here are some ways you can interact with me:\n" +
                    "!!bookbot  :point_right:  Show this message\n" +
                    "!!newbook <book name, optionally with author>  :point_right:  update your shelf list with the given book and post link\n" +
                    "!!reading <book name, optionally with author>  :point_right:  update your reading list with the given book and post link\n" +
                    "!!justread <book name, optionally with author>  :point_right:  update your read list with the given book and post link\n" +
                    "!!viewshelf  :point_right:  View all available books with owner and status (reading, lent, read)\n" +
                    "!!viewshelf @user  :point_right:  View the bookshelf of the given user\n" +
                    "!!loan <book name, optionally with author> @user  :point_right:  Update your loaned list to reflect that the given book " +
                    "was lent to the given user"
                );
                break;
            case 'newbook':
                break;
            case 'reading':
                break;
            case 'justread':
                break;
            case 'viewshelf':
                break;
            case 'loan':
                break;
            default:
                message.channel.send('This command is unknown. To see supported commands, enter !!bookbot.');
        }
    });
}

function getFromGoodreads(book_name, author = null) {
    // TODO query goodreads API
}

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

const Status = {
    READING: 'reading',
    OWNED: 'owned',
    READ: 'read',
    TO_READ: 'to_read',
    LOANED: 'loaned'
}

const TABLE_NAME = 'book_catalog';

db_pool = initdb();
run(db_pool);


function isValidStatus(status) {
    switch (status) {
        case Status.READING:
            return true;
        case Status.OWNED:
            return true;
        case Status.READ:
            return true;
        case Status.TO_READ:
            return true;
        case Status.LOANED:
            return true;
        default:
            return false;
    }
}


function initdb() {
    // DB SCHEMA --
    // ID  username   book_author   book_name   status (one of reading, owned, read, to_read, loaned)    loaned_to (username)
    // init express
    const express_db = express();
    express_db.use(bodyParser.json());
    express_db.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );

    // init thread pool for requests
    const Pool = require('pg').Pool;
    const db_pool = new Pool({
        user: config.db_user,
        host: 'localhost',
        database: config.db,
        // password: 'password',  # TODO -- do I need this????
        port: config.db_port,
    });

    // root endpoint
    // TODO ---- MAY NOT NEED ANY OF THIS
    express_db.get('/', (request, response) => {
      response.json({ info: 'Node.js, Express, and Postgres API' })
    });
    express_db.listen(config.db_port, () => {
      console.log(`Express app running on port ${config.db_port}.`);
    });

    return db_pool;
}


function run(db_pool) {
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

function getFromGoodreads(book_name, author) {
    // TODO query goodreads API
}

function getIdIfRowExists(pool, name, author) {
    pool.query(`SELECT id FROM ${TABLE_NAME} WHERE name = ${name} AND author = ${author}`, [], (error, results) => {
        if (error) {
            throw error;
        }
        return results.rows;
    });
}

function createBookStatus(pool, username, name, author, status, loaned_to) {
    pool.query(
        `INSERT INTO ${TABLE_NAME} (username, name, author, status, loaned_to) VALUES (${username}, ${name}, ${author}, ${status}, ${loaned_to})`,
        [],
        (error, results) => {
            if (error) {
                throw error
            }
        }
    );
}

function updateBookStatus(pool, id, username, name, author, status, loaned_to) {
    pool.query(
        `UPDATE ${TABLE_NAME} SET username = ${username}, name = ${name}, author = ${author}, status = ${status}, loaned_to = ${loaned_to} WHERE id = ${id}`,
        [],
        (error, results) => {
            if (error) {
                throw error;
            }
        }
    );
}

function getShelf(pool, username=null) {

}

function updateDB(pool, username, name, author, status, loaned_to, message) {
    if (!isValidStatus(status)) {
        console.log(`Invalid status: ${status}`);
    }
    try {
        row_id = getIdIfRowExists(pool, name, author);
    } catch (ex) {
        message.channel.send('Internal db error');
    }
    if (row_id.length === 0) {
        createBookStatus(pool, name, author, status, loaned_to);
        message.reply(`Ok I added the following book to your shelf with status ${status}: ${goodreads_data}`);
    } else if (row_id.length === 1) {
        updateBookStatus(pool, id, username, name, author, status, loaned_to);
        goodreads_data = getFromGoodreads(name, author);
        message.reply(`Ok I updated the following book to status ${status}: ${goodreads_data}`);
    } else {
        console.log(`Received more than one entry for book ${name} by author ${author} for user ${username}`);
    }
}

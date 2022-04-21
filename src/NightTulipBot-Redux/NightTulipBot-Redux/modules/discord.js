const { Client, Permissions  } = require('discord.js');
const secrets = require('../config/secrets.js');
const db = require('./db.js');
const client = new Client({
    intents: ['GUILDS', 'GUILD_MESSAGES'],
});


client.once('ready', () => {
    
});

client.on('messageCreate', (message) => {

    try {
        var args = message.content
            .toLowerCase()
            .trim()
            .split(/\s+/);
        const [command, input] = args;
        var member = message.member;
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if (command == '>reloadCommands') {
                try {
                    var result = db.query("SELECT * FROM Commands");

                    if (result.rows) {
                        return message.reply("Reloaded " + result.rows + " commands!");
                    } else {
                        return message.reply('Finished reloading commands!');
                    }
                } catch (ex) {
                    return message.reply(ex);
                }
            }

            if (command == '>purge') {
                PurgeMessages(message, input);
            }
        }
    } catch (ex) {
        console.log(ex);
    }
    
});

function PurgeMessages(message, input) {
    if (isNaN(input)) {
        return message.channel.messages.fetch()
            .then(messages => {
                message.channel.bulkDelete(messages.size, true)
                    .then((_message) => {
                        message.channel
                            // do you want to include the current message here?
                            // if not it should be ${_message.size - 1}
                            .send(`Bot cleared \`${_message.size}\` messages :broom:`)
                            .then((sent) => {
                                setTimeout(() => {
                                    sent.delete();
                                }, 2500);
                            });
                    });
            })
            .catch(console.error);
    }

    if (Number(input) < 0) {
        return message.reply('Enter a positive number!')
            .then((sent) => {
                setTimeout(() => {
                    sent.delete();
                }, 2500);
            });
    }

    // add an extra to delete the current message too
    var amount = Number(input) > 100
        ? 101
        : Number(input) + 1;

    message.channel.

    message.channel.bulkDelete(amount, true)
        .then((_message) => {
            message.channel
                // do you want to include the current message here?
                // if not it should be ${_message.size - 1}
                .send(`Bot cleared \`${_message.size}\` messages :broom:`)
                .then((sent) => {
                    setTimeout(() => {
                        sent.delete();
                    }, 2500);
                });
        });
}

client.login(secrets.discordToken);

module.exports.client = client;
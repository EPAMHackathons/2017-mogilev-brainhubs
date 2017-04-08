var TelegramBot = require('node-telegram-bot-api');

const token = '320218462:AAE0jZ3m1wogSM8_ZsIRHipxm519qsF9bQI';
var botOptions = {
    polling: true
};
var bot = new TelegramBot(token, botOptions);

bot.getMe().then(function (me) {
    console.log('Hello! My name is %s!', me.first_name);
    console.log('My id is %s.', me.id);
    console.log('And my username is @%s.', me.username);
});

bot.onText(/\/repos (.+)/, function (msg, callback) {
    let chatId = msg.chat.id;
    const username = callback[1];
    console.log(username);
});

bot.onText(/\/subrepo (.+)/, function (msg, callback) {
    let chatId = msg.chat.id;
    const repo = callback[1];
    console.log(repo);

});

bot.onText(/\/unsubrepo (.+)/, function (msg, callback) {
    let chatId = msg.chat.id;
    const repo = callback[1];
    console.log(repo);

});

bot.onText(/\/help/, function (msg) {
    let chatId = msg.chat.id;
    let messageText = "Available commands:\n\n/repos - Get repositories users\n/subrepo - Subscribe to the repository\n/unsubrepo - Unsubscribe from repositories"
    writeMessage(chatId, messageText);

});
function writeMessage(chatId, message) {
    bot.sendMessage(chatId, message);
}
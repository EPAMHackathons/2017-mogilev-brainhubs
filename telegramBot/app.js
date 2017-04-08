var TelegramBot = require('node-telegram-bot-api');
// var AppService = require("./app-service.js");
var GitHubApi = require('../githubApi/common.service.js');
var commonService = new GitHubApi.CommonService();

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
    commonService.getUserRepos(username)
        .then(repos => {
            let reposString = "Repositories:";
            for (let repo of repos) {
                reposString += `\n ${repo}`;
            }
            writeMessage(chatId, reposString);
        }).catch(err => {
        writeMessage(chatId, "User is not find");
        console.log(err)
    })
})


bot.onText(/\/subrepo (.+)/, function (msg, callback) {
    let chatId = msg.chat.id;
    const repo = callback[1];


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
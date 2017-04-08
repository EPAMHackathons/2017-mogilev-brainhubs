var TelegramBot = require('node-telegram-bot-api');
var GitHubApi = require('../githubApi/common.service.js');
var Repository = require('./repository.js');
var commonService = new GitHubApi.CommonService();

const token = '320218462:AAE0jZ3m1wogSM8_ZsIRHipxm519qsF9bQI';
var botOptions = {
    polling: true
};
var bot = new TelegramBot(token, botOptions);

var repositories = [];

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
    let repoInfo = repo.split('/');

    let repoLastCommit = commonService.getLastCommit(repoInfo[0], repoInfo[1]).then(lastcommit => {
            console.log(`\nlast commit - ${lastcommit}\n`);
            let newSubRepo = new Repository(repoInfo[0], repoInfo[1], lastcommit, chatId);
            let includeRepo = repositories.find(x => x.authorName == newSubRepo.authorName && x.repositoryName == newSubRepo.repositoryName);
            console.log(`\nrepositories - ${repositories}\n`);
            console.log(`\nincludrepo - ${includeRepo}\n`);
            if (!!includeRepo) {
                console.log(includeRepo.subUsersId);
                includeRepo.setNewSubUser(chatId);
                console.log(includeRepo.subUsersId);
                console.log(`\nrepositories - ${repositories}\n`);
            } else {
                console.log(`\nsubrepo - ${newSubRepo}\n`);
                repositories.push(newSubRepo);
                console.log(`\nrepositories - ${repositories}\n`);
                console.log(repositories.length);
            }
            writeMessage(chatId, "Subscribe");
        })
            .catch(err => {
                    console.log(err);
                    writeMessage(chatId, "Repository is not find");
                }
            )
        ;

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
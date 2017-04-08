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
                reposString += `\n ${repo.repoName}`;
            }
            writeMessage(chatId, reposString);
        }).catch(err => {
        writeMessage(chatId, "User is not find");
        console.log(err)
    })
});


bot.onText(/\/subrepo (.+)/, function (msg, callback) {
    let chatId = msg.chat.id;
    const repo = callback[1];
    let repoInfo = repo.split('/');

    commonService.getLastCommit(repoInfo[0], repoInfo[1]).then(lastcommit => {
        let newSubRepo = new Repository(repoInfo[0], repoInfo[1], lastcommit, chatId);
        let includeRepo = repositories.find(x => x.authorName == newSubRepo.authorName && x.repositoryName == newSubRepo.repositoryName);
        if (!!includeRepo) {
            if (!includeRepo.subUsersId.find(x => x == chatId)) {
                includeRepo.setNewSubUser(chatId);
                writeMessage(chatId, "Subscribe");
            } else {
                writeMessage(chatId, "you are already subscribed");
            }

        } else {
            repositories.push(newSubRepo);
            writeMessage(chatId, "Subscribe");
            console.log(repositories[0].lastCommit.key);
        }

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
    let repoInfo = repo.split('/');
    let authorName = repoInfo[0];
    let repoName = repoInfo[1];
    let includeRepo = repositories.find(x => x.authorName == authorName && x.repositoryName == repoName);
    if (!!includeRepo) {
        let index = includeRepo.subUsersId.findIndex(
            i => i == chatId
        );
        if (index == -1) {
            writeMessage(chatId, "Repositories doesn't exist in subscribed list")
        } else {
            includeRepo.subUsersId.splice(index, 1);
            writeMessage(chatId, "Unsubscribe");
            if (includeRepo.subUsersId == null || includeRepo.subUsersId != undefined) {
                includeRepo = undefined;
            }
        }

    } else {
        writeMessage(chatId, "Repository is not find");
    }

});

bot.onText(/\/help/, function (msg) {
    let chatId = msg.chat.id;
    let messageText = "Available commands:\n\n/repos - Get repositories users\n/subrepo - Subscribe to the repository\n/unsubrepo - Unsubscribe from repositories"
    writeMessage(chatId, messageText);

});

function writeMessage(chatId, message) {
    bot.sendMessage(chatId, message);
}

setInterval(function () {
    for (let repo of repositories) {
        commonService.getRepoCommits(repo.authorName, repo.repositoryName)
            .then((commits) => {
                let index = commits.findIndex(
                    i => i.key == repo.lastCommit.key
                );

                repo.lastCommit = commits[0];
                if (index != 0) {
                    let newCommits = commits.splice(0, index);
                    newCommits.reverse();
                    let newCommisString = "New Commits:";
                    for (let newCommit of newCommits) {
                        newCommisString += `\n${newCommit.message}`;

                    }
                    for (let subUserId of repo.subUsersId) {
                        writeMessage(subUserId, newCommisString);
                    }
                }
            })
            .catch(
                err => console.log(err)
            )
    }
}, 60000);
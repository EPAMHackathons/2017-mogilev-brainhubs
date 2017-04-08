var restify = require('restify');
var builder = require('botbuilder');
var skypeService = require('./app.service.js');

var skype = new skypeService();

let repos = [];
// [
//     {
//         userName: 'vitalics',
//         url: `https://github.com/vitalics/SVCH`,
//         description: 'Some description',
//         image: 'http://info.nic.ua/wp-content/uploads/2016/02/github-logo.jpg'
//     },
//     {
//         userName: 'vitalics',
//         url: `https://github.com/vitalics/SVCH`,
//         description: 'Some description',
//         image: 'http://info.nic.ua/wp-content/uploads/2016/02/github-logo.jpg'
//     }
// ]
let findsItems = [{
    repoName: 'SVCH',
    fullName: 'vitalics/SVCH',
    description: "some description",
    repoUrl: `https://github.com/vitalics/SVCH`,
    owner: {
        login: 'vitalics',
        avatar: 'https://avatars3.githubusercontent.com/u/8816260?v=3&u=80474428aeaf87f796b0109b2d7a4609c805ae8e&s=400'
    }
}];
//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
const appId = 'c15781f0-5d94-41a7-8466-0cb65773f8c5';
const appPassword = 'gA6EVPBKStrYb8nN6vSB5Cj';

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: appId,
    appPassword: appPassword
});

var bot = new builder.UniversalBot(connector, function (session) {
    session.endDialog();
});

server.post('/api/messages', connector.listen());

//=========================================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function (message) {
    // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
            .address(message.address)
            .text("Hello %s... Thanks for adding me. Say 'help' to see help.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('deleteUserData', function (message) {
    var reply = new builder.Message()
        .address(message.address)
        .text("Hello %s... Thanks for adding me. Say 'help' to see some great demos.", name || 'there');
    bot.send(reply);
});

//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Global Actions
//=========================================================

bot.endConversationAction('goodbye', 'Goodbye :)', { matches: /^goodbye/i });

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('getRepos', [function (session) {
    builder.Prompts.text(session, 'Write userName');
},
function (session, results) {
    let userName = results.response;
    skype.commonService.getUserRepos(userName).then(repos => {
        var cards = [];

        for (var index = 0; index < repos.length; index++) {

            var card = new builder.HeroCard(session)
                .title(`${repos[index].repoName}`)
                .text(`${repos[index].description}`)
                .images([
                    builder.CardImage.create(session, `${repos[index].owner.avatar}`)
                ])
                .buttons([
                    builder.CardAction.openUrl(session, `${repos[index].repoUrl}`, "", "GitHub")
                ])
            cards.push(card);
        }

        var msg = new builder.Message(session).attachments(cards);
        session.send(msg);
    })
}
]).triggerAction({ matches: /^getRepos/i })



bot.dialog('about', function (session) {
    var card = new builder.HeroCard(session)
        .title("Github Bot")
        .text("Our bots - the greatest bot for github.")
        .images([
            builder.CardImage.create(session, "http://info.nic.ua/wp-content/uploads/2016/02/github-logo.jpg")
        ]);
    var msg = new builder.Message(session).attachments([card]);
    session.send(msg);
    session.endDialog();
}).triggerAction({ matches: /^about/i })

bot.dialog('help', [
    function (session) {
        builder.Prompts.text(session, "Global commands that are available anytime:\n\n* search - get search by choosen criteria. \n\n* subscribe - Subscribe to user repo. \n\n* unsubscribe - Unsubscribe to user repo. \n\n* repos - get list of subscribes repos. \n\n* about  - get about notify. \n*  help - promts help.\n* help <word> - for the see help in param.");
    },
    function (session, results) {
        session.send('%s', results.response);
        session.endDialog();
    }
]).triggerAction({ matches: /^help/i });


bot.dialog('search', [
    function (session) {
        builder.Prompts.choice(session, "What data will you get?", "username|repos|user repos|code|(quit)");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            if (results.response.entity == 'username') {
                session.send('lol, username');
            }
            if (results.response.entity == 'repos') {
                var cards = [];

                for (var index = 0; index < findsItems.length; index++) {

                    var card = new builder.HeroCard(session)
                        .title(`${findsItems[index].repoName}`)
                        .text(`${findsItems[index].description}`)
                        .images([
                            builder.CardImage.create(session, `${findsItems[index].owner.avatar}`)
                        ])
                        .buttons([
                            builder.CardAction.openUrl(session, `${findsItems[index].repoUrl}`, "", "GitHub")
                        ])
                    cards.push(card);
                }

                var msg = new builder.Message(session).attachments(cards);
                session.send(msg);
            }
            if (results.response.entity == 'code') {
                session.send('cheburek, code');
            }
            if (results.response.entity == 'user repos') {
                // session.beginDialog('carousel');
                skype.commonService.getUserRepos('vitalics').then(repos => {
                    session.send(repos.toString());
                })
            }
            session.beginDialog('search');

        } else {
            session.endDialog();
            // Exit the menu
            session.beginDialog('about');
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('search');
    }]).reloadAction('reloadSearch', null, { matches: /^search|show search/i }).triggerAction({ matches: /^search/i });

bot.dialog('/subscribe', [
    function (session) {


        // repos = skype.subscribeRepo('vitalics', 'SVCH');
        builder.Prompts.text(session, 'Write <userName/repoName>');
    },
    function (session, results) {
        let str = results.response;
        str = str.split('/');
        let userName = str[0];
        let repoName = str[1];
        builder.Prompts.text(session, 'LOL ' + userName + ' ' + repoName);
        skype.subscribeRepo(userName, repoName);
        repos = skype.getSubscribedRepos();

    }
]).triggerAction({ matches: /^subscribe/i });


bot.dialog('/unsubscribe', [
    function (session) {
        // repos = skype.subscribeRepo('vitalics', 'SVCH');
        builder.Prompts.text(session, 'Write <userName/repoName>');
    },
    function (session, results) {
        let str = results.response;
        str = str.split('/');
        let userName = str[0];
        let repoName = str[1];
        builder.Prompts.text(session, 'LOL ' + userName + ' ' + repoName);
        skype.unsubscribeRepo(userName, repoName);
        repos = skype.getSubscribedRepos();

    }
]).triggerAction({ matches: /^unsubscribe/i });

bot.dialog('repos', [
    function (session) {

        var cards = [];

        session.send('repos enter')
        for (var index = 0; index < repos.length; index++) {

            var card = new builder.HeroCard(session)
                .title(`${repos[index].getName()}`)
                .text(`${repos[index].getDescription()}`)
                .images([
                    builder.CardImage.create(session, `${repos[index].getAvatarUrl()}`)
                ])
                .buttons([
                    builder.CardAction.openUrl(session, `${repos[index].getUrl()}`, "", "GinHub")
                ])
            cards.push(card);
        }

        var msg = new builder.Message(session).attachments(cards);
        session.send(msg);
        session.endDialog();
    },
]).triggerAction({ matches: /^repos/i });
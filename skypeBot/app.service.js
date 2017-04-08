var gitHubApi = require('../githubApi/common.service.js');
var Repo = require('./repo');

class SkypeService {
    constructor(user) {
        this.userNames = [];
        this.tempUserNames = [];
        this.subscribesRepos = [];
        this.tempRepos = [];
        this.commonService = new gitHubApi.CommonService();
    }
    getUserRepos(user) {
        this.commonService.getUserRepos(user).then(repos => {
            return repos;
        }).catch(err => {
            return err;
        });
    }

    getLastCommit(userName, repoName) {
        this.commonService.getLastCommit(userName, repoName).then(repos => {
            return repos;
        }).catch(err => {
            return err;
        });
    }

    subscribeRepo(userName, repoName) {
        this.commonService.getRepo(userName, repoName).then(repo => {
            let r = new Repo(repo);
            this.subscribesRepos.push(r);
        });
    }

    getSubscribedRepos() {
        return this.subscribesRepos;
    }

    unsubscribeRepo(fullName) {
        let index = this.subscribesRepos.findIndex(repo => repo.getFullName == fullName);
        this.subscribesRepos.splice(index, 1);
    }

    checkForUpdates() {

    }

    ping() {
        setInterval({

        }, 5000)
    }
}

module.exports = SkypeService;
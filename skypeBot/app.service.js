var gitHubApi = require('../githubApi/common.service.js');

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
        })
    }
    getLastCommit(userName, repoName) {
        this.commonService.getLastCommit(userName, repoName).then(repos => {
            return repos;
        }).catch(err => {
            return err;
        })
    }

    subscribeRepos(userName, repoName) {
        this.subscribesRepos.push(repoName);
        this.tempRepos.push(repoName);
        this.userNames.push(userName);
        this.tempUserNames.push(userName);
    }

    checkForUpdates() {

    }

    ping() {
        setInterval({

        }, 5000)
    }
}

module.exports = SkypeService;
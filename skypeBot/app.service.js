var gitHubApi = require('../githubApi/common.service.js');

class SkypeService {
    constructor(user) {

        this.commonService = new gitHubApi.CommonService();
    }
    getUserRepos(user) {
        this.commonService.getUserRepos(user).then(repos => {
            return repos;
        }).catch(err => {
            return err;
        })
    }
}

module.exports = SkypeService;
var github = require('octonode');

class CommonService {

    constructor() {
        this.client = github.client();
        this.search = this.client.search();
    }

    getUserRepos(user) {
        return new Promise((resolve, reject) => {
            let repos = [];
            this.client.user(user).repos((err, data, header) => {
                if (data) {
                    data.map(repo => repos.push({
                        repoName: repo.name,
                        fullName: repo.full_name,
                        description: repo.description,
                        repoUrl: repo.url,
                        owner: {
                            login: repo.owner.login,
                            avatar: repo.owner.avatar_url
                        }
                    }));
                    resolve(repos);
                } else {
                    reject(err.message);
                }
            });
        });
    }

    getRepo(userName, repoName) {
        return new Promise((resolve, reject) => {
            this.client.repo(`${userName}/${repoName}`).info((err, repo, header) => {
                if (repo) {
                    resolve({
                        repoName: repo.name,
                        fullName: repo.full_name,
                        description: repo.description,
                        repoUrl: repo.url,
                        owner: {
                            login: repo.owner.login,
                            avatar: repo.owner.avatar_url
                        }
                    });
                } else {
                    reject(err.message);
                }
            });
        });
    }

    getLastCommit(user, repoName) {
        return new Promise((resolve, reject) => {
            let commits = [];
            this.client.repo(`${user}/${repoName}`).commits((err, data, header) => {
                if (data) {
                    data.map(commit => commits.push({
                        key: commit.sha,
                        message: commit.commit.message
                    }));
                    resolve(commits[0]);
                } else {
                    reject(err.message);
                }
            });
        });
    }

    getRepoCommits(user, repoName) {
        return new Promise((resolve, reject) => {
            let commits = [];
            this.client.repo(`${user}/${repoName}`).commits((err, data, header) => {
                if (data) {
                    data.map(commit => commits.push({
                        key: commit.sha,
                        message: commit.commit.message
                    }));
                    resolve(commits);
                } else {
                    reject(err.message);
                }
            });
        });
    }

    searchRepos(keyword) {
        let repos = [];
        return new Promise((resolve, reject) => {
            this.search.repos({
                q: keyword
            }, (err, data, header) => {
                if (data) {
                    data.items.map(repo => repos.push({
                        repoName: repo.name,
                        fullName: repo.full_name,
                        description: repo.description,
                        repoUrl: repo.url,
                        owner: {
                            login: repo.owner.login,
                            avatar: repo.owner.avatar_url
                        }
                    }));
                    resolve(repos);
                } else {
                    reject(err.message);
                }
            });
        });
    }
}

module.exports = {
    CommonService
}
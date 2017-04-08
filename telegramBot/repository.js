class Repository {
    constructor(authorName, repositoryName, lastCommit, subUserId) {
        this.authorName = authorName;
        this.repositoryName = repositoryName;
        this.lastCommit = lastCommit;
        this.subUsersId = [];
        this.subUsersId.push(subUserId);
    }

    setNewSubUser(newSubUserId){
       this.subUsersId.push(newSubUserId)
    }
}

module.exports = Repository;
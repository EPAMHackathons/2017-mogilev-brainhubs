class Repo{
    
    constructor(repo){
        this.name = repo.repoName;
        this.ownerName = repo.owner.login;
        this.url = repo.repoUrl;
        this.description = repo.description;
        this.avatarUrl = repo.owner.avatar;
    }

    getName(){
        return this.name;
    }

    getOwnerName(){
        return this.ownerName;
    }

    getUrl(){
        return this.url;
    }

    getAvatarUrl(){
        return this.avatarUrl;
    }

    getDescription(){
        return this.description;
    }
}

module.exports = Repo;
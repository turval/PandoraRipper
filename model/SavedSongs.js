var SavedSongs = function(persistantData) {
    this.storage = persistantData;
    this.savedSongs = this.storage.get("savedSongs");
    this.savedSongs = this.savedSongs ? this.savedSongs : [];
    
}

SavedSongs.prototype._flush = function() {
    this.storage.save("savedSongs", this.savedSongs);
}

SavedSongs.prototype.save = function(song) {
    this.savedSongs.push(song);
    this._flush();
}

SavedSongs.prototype._getIndex = function(token) {
    for(var i = 0; i < this.savedSongs.length; i++) {
        if(this.savedSongs[i].token == token) {
            return i;
        }
    }
    return -1;
}

SavedSongs.prototype.removeByToken = function(token) {
    var index = this._getIndex(token);
    if(index >= 0) {
        this.savedSongs.splice(index,1);
        this._flush();
    }
}

SavedSongs.prototype.removeBySong = function(song) {
    this.savedSongs.splice(this.savedSongs.indexOf(song),1);
    this._flush();
}

SavedSongs.prototype.getAll = function() {
    return this.savedSongs;
}

SavedSongs.prototype.isTokenSaved = function(token) {
    return (this._getIndex(token) >= 0);
}



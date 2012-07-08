var SavedSongs = function(persistantData) {
    this.storage = persistantData;
    this.savedSongs = this.storage.get("savedSongs", []);
    
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
        var song = this.savedSongs[index];
        this.savedSongs.splice(index,1);
        this._flush();
        return song;
    }
    return null;
}

SavedSongs.prototype.getAll = function() {
    return this.savedSongs;
}

SavedSongs.prototype.get = function(token) {
    for(var i = 0; i < this.savedSongs.length; i++) {
        if(this.savedSongs[i].token == token) {
            return this.savedSongs[i];
        }
    }
    return null;
}

SavedSongs.prototype.isTokenSaved = function(token) {
    return (this._getIndex(token) >= 0);
}

SavedSongs.prototype.isFileNameSaved = function(filename) {
    return this.isTokenSaved(filename.substr(0, filename.length - 4));
}



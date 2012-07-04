SongStorage = function(persistantData) {
    this.persistant = persistantData;
    this.data = this.persistant.get("SongStorage.data", {});
    this.songOrder = this.persistant.get("SongStorage.songOrder", []);
    this.mostRecentToken = this.persistant.get("SongStorage.mostRecentToken", null);
}

SongStorage.prototype.addSongs = function(xml) {
    var json = XMLToJSON($.parseXML(xml));
    var songsArray = json.methodResponse.params.param.value.array.data.value;
    
    for(var i = 0; i < songsArray.length; i++) {
        var song = new Song(songsArray[i]);
        this.data[song.token] = song;
        this.songOrder.push(song.token);
    }
    this._flush();
}

SongStorage.prototype._flush = function() {
    this.persistant.save("SongStorage.data", this.data);
    this.persistant.save("SongStorage.songOrder", this.songOrder);
    this.persistant.save("SongStorage.mostRecentToken", this.mostRecentToken);
}

SongStorage.prototype.setAudioUrl = function(url) {
    for(var i = this.songOrder.length - 1; i >= 0; i--) {
        var song = this.data[this.songOrder[i]];
        if(song.audioUrlSource == undefined) {
            var origUrl = song.audioUrl.replace(/&amp;/g,"&");
            if(this.setUrlHelper(song, origUrl, url, url, true)) {
                this.mostRecentToken = song.token;
                this._flush();
                break;
            }
        } else if(song.audioUrlSource == url) {
            this.mostRecentToken = song.token;
            this._flush();
            break;
        }
    } 
}

SongStorage.prototype.setUrlHelper = function (song, origUrl, newUrl, newUnaltered, first) {
    var shortOrig = this.shorten(origUrl);
    var shortUrl = this.shorten(newUrl);
    if(shortUrl == shortOrig) {
        song.audioUrlSource = newUnaltered;
        console.log("found Url for song");
        return true;
    } else if (first && shortUrl.length != shortOrig.length) {
        if(shortUrl.length > shortOrig) {
            return this.setUrlHelper(song, origUrl, shortUrl, newUnaltered, false);
        } else {
            return this.setUrlHelper(song, shortOrig, newUrl, newUnaltered, false);
        }   
    }
    return false; 
}

SongStorage.prototype.shorten = function(url) {
    return url.substr(0, url.lastIndexOf("%2"));
}

SongStorage.prototype.getSong = function(token) {
    return this.data[token];
}


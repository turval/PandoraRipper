SongStorage = function() {
    this.data = {};
    this.songOrder = [];
}

SongStorage.prototype.addSongs = function(xml) {
    var json = XMLToJSON($.parseXML(xml));
    console.log(json);
    var songsArray = json.methodResponse.params.param.value.array.data.value;
    console.log(songsArray);
        
    for(var i = 0; i < songsArray.length; i++) {
        var song = new Song(songsArray[i]);
        this.data[song.token] = song;
        this.songOrder.push(song.token);
    }
    console.log(this.data);
}

SongStorage.prototype.setAudioUrl = function(url) {
    for(var i = this.songOrder.length - 1; i >= 0; i--) {
        var song = this.data[this.songOrder[i]];
        if(song.audioUrlSource == undefined) {
            var origUrl = song.audioUrl.replace(/&amp;/g,"&");
            var shortOrig = this.shorten(origUrl);
            var shortUrl = this.shorten(url);
            
            if(shortUrl == shortOrig) {
                song.audioUrlSource = url;
                console.log("found Url for song");
                console.log(song);
                break;
            } else if(shortUrl.length != shortOrig.length) {
                if(shortUrl.length > shortOrig.length) {
                    shortUrl = this.shorten(shortUrl);
                } else if(shortOrig.length > shortUrl.length) {
                    shortOrig = this.shorten(shortOrig);
                }
                if(shortUrl == shortOrig) {
                    song.audioUrlSource = url;
                    console.log("found Url for song");
                    console.log(song);
                    break;
                } 
            }
        }
    }
}

SongStorage.prototype.shorten = function(url) {
    return url.substr(0, url.lastIndexOf("%2"));
}

SongStorage.prototype.getSong = function(token) {
    return this.data[token];
}


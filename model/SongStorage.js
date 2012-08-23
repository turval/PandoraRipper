(function(lib) {
    var model = lib.extendNamespace("model");
    
    /**
     * stores song objects for song data we have recieved from pandora
     * these are not explicitly songs the user has liked, but some may also be 'saved' already
     */
    model.SongStorage = lib.Class.extend({
        Static : function() {
            this.persistant = model.PersistantData;
            this.data = this.persistant.get("SongStorage.data", {});
            this.songOrder = this.persistant.get("SongStorage.songOrder", []);
            this.mostRecentToken = this.persistant.get("SongStorage.mostRecentToken", null);
        },

        addSongs : function(xml) {
            var json = XMLToJSON($.parseXML(xml));
            var songsArray = json.methodResponse.params.param.value.array.data.value;

            for(var i = 0; i < songsArray.length; i++) {
                var song = new Song(songsArray[i]);
                this.data[song.token] = song;
                this.songOrder.push(song.token);
            }
            this._flush();
        },

        _flush : function() {
            this.persistant.save("SongStorage.data", this.data);
            this.persistant.save("SongStorage.songOrder", this.songOrder);
            this.persistant.save("SongStorage.mostRecentToken", this.mostRecentToken);
        },

        setAudioUrl : function(url) {
            var set = false;
            for(var i = this.songOrder.length - 1; i >= 0; i--) {
                var song = this.data[this.songOrder[i]];
                if(song.audioUrlSource == undefined) {
                    var origUrl = song.audioUrl.replace(/&amp;/g,"&");
                    if(this.setUrlHelper(song, origUrl, url, url, true)) {
                        this.mostRecentToken = song.token;
                        this._flush();
                        set = true;
                        break;
                    }
                } else if(song.audioUrlSource == url) {
                    this.mostRecentToken = song.token;
                    this._flush();
                    set = true;
                    break;
                }
            }
            return set;
        },

        setUrlHelper : function (song, origUrl, newUrl, newUnaltered, first) {
            var shortOrig = this.shorten(origUrl);
            var shortUrl = this.shorten(newUrl);
            if(shortUrl == shortOrig) {
                song.audioUrlSource = newUnaltered;
                lib.log("found Url for song");
                return true;
            } else if (first && shortUrl.length != shortOrig.length) {
                if(shortUrl.length > shortOrig) {
                    return this.setUrlHelper(song, origUrl, shortUrl, newUnaltered, false);
                } else {
                    return this.setUrlHelper(song, shortOrig, newUrl, newUnaltered, false);
                }   
            }
            return false; 
        },

        shorten : function(url) {
            return url.substr(0, url.lastIndexOf("%2"));
        },

        getSong : function(token) {
            return this.data[token];
        },
        
        debug_getSongs : function() {
            var temp = [];
            for(var i = 0; i < this.songOrder.length; i++){
                temp.push(this.data[this.songOrder[i]]);
            }
            return temp;
        }
    });
})(PandoraRipper);


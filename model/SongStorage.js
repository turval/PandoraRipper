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
            lib.log("adding songs");
            var json = XMLToJSON($.parseXML(xml));
            var songsArray = [];
            try {
                songsArray = json.methodResponse.params.param.value.array.data.value;
            } catch(e) {
                new lib.controller.Logger().caughtError("Failure getting songs from XML",
                    json, e);
            }
            for(var i = 0; i < songsArray.length; i++) {
                var song = new model.Song(songsArray[i]);
                if(this.data[song.token] !== undefined) {
                    this.data.splice(this.data.indexOf(song.token), 1);
                } else {
                    this.data[song.token] = song;
                }
                this.songOrder.push(song.token);
            }
			
            if(this.songOrder.length > 100) {
                var numToRemove = this.songOrder.length - 100;
                var deadTokens = this.songOrder.splice(0, numToRemove);
                for(var x = 0; x < deadTokens.length; x++) {
                    delete this.data[deadTokens[x]];
                }
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
                    if(this.setUrlHelper(song, origUrl, url, url)) {
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

        setUrlHelper : function (song, origUrl, newUrl, newUnaltered, count) {
            if(count === undefined) {
                count = 0;
            }
            var shortOrig = this.shorten(origUrl);
            var shortUrl = this.shorten(newUrl);
            if(shortUrl == shortOrig) {
                song.audioUrlSource = newUnaltered;
                lib.log("found Url for song");
                lib.log(song);
                return true;
            } else if (count < 2 && shortUrl.length != shortOrig.length) {
                if(shortUrl.length > shortOrig) {
                    return this.setUrlHelper(song, origUrl, shortUrl, newUnaltered, ++count);
                } else {
                    return this.setUrlHelper(song, shortOrig, newUrl, newUnaltered, ++count);
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


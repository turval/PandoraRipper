(function(lib) {
    var model = lib.extendNamespace("model");
    
    model.Songs = lib.Class.extend({
        Static : function() {
            var self = this;
            this.data = lib.model.PersistantData;
            this._songs = this.data.get("Songs.songs", {});
            for (var i in this._songs) {
                if(this._songs.hasOwnProperty(i)) {
                    this._songs[i] = new model.Song(this._songs[i], true);
                }
            }
            this._referenceCount = {};
            Events.addListener("SongUpdated", function() {
                lib.log("song updated event recieved");
                self.save();
            });
        },
        add : function(song, origin, dontSave) {
            if(this._songs[song.token] === undefined) {
                this._songs[song.token] = song;
            }
            this._updateReference(song.token, origin);
            if(!dontSave) {
                this.save();
            }
            
        },
        addMany : function(songs, origin) {
            for (var i = 0; i < songs.length; i++) {
                this.add(songs[i], origin, true);
            }
            this.save();
        },
        remove : function(token, origin) {
           this._updateReference(token, origin, true);
        },
        removeMany : function(tokens, origin) {
            for (var i = 0; i < tokens.length; i++) {
                this.remove(tokens[i], origin);
            }
        },
        get : function(token, origin) {
            this._updateReference(token, origin);
            return this._songs[token];
        },
        
        /**
         * @param obj optional, if true returns an object maped by tokens
         */
        getMany : function(tokens, origin, obj) {
            var temp = obj ? {} : [];
            var token = null;
            for (var i = 0; i < tokens.length; i++) {
                token = tokens[i];
                if(obj) {
                    obj[token] = this.get(token, origin);
                } else {
                    temp.push(this.get(token, origin));
                }
            }
            return temp;
        },
        save : function() {
            this.data.save("Songs.songs", this._songs);
        },
        purge : function() {
            for(var i in this._songs) {
                if(this._songs.hasOwnProperty(i)) {
                    var ref = this._referenceCount[i];
                    if (ref === undefined) {
                        delete this._songs[i];
                    }
                }
            }
            this.save();
        },
        _updateReference : function(token, origin, removing) {
            if(this._referenceCount[token] === undefined) {
                this._referenceCount[token] = [];
            }
            var refs = this._referenceCount[token];
            var index = refs.indexOf(origin);
            if (index < 0 && !removing) {
                refs.push(origin);
            } else if (index >= 0 && removing) {
                refs.splice(index, 1);
                if(refs.length === 0) {
                    delete this._songs[token];
                    this.save();
                }
            } 
        }
    });
})(PandoraRipper);
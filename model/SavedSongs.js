(function(lib) {
    var model = lib.extendNamespace("model");
    
    /**
     * stores song objects for songs the user has downloaded
     */
    model.SavedSongs = lib.Class.extend({
        Static : function() {
            this.storage = model.PersistantData;
            this.savedSongs = this.storage.get("savedSongs", []);
    
        },

        _flush : function() {
            this.storage.save("savedSongs", this.savedSongs);
        },

        save : function(song) {
            this.savedSongs.push(song);
            this._flush();
        },

        _getIndex : function(token) {
            for(var i = 0; i < this.savedSongs.length; i++) {
                if(this.savedSongs[i].token == token) {
                    return i;
                }
            }
            return -1;
        },

        removeByToken : function(token) {
            var index = this._getIndex(token);
            if(index >= 0) {
                var song = this.savedSongs[index];
                this.savedSongs.splice(index,1);
                this._flush();
                return song;
            }
            return null;
        },

        getAll : function() {
            return this.savedSongs;
        },

        get : function(token) {
            for(var i = 0; i < this.savedSongs.length; i++) {
                if(this.savedSongs[i].token == token) {
                    return this.savedSongs[i];
                }
            }
            return null;
        },

        isTokenSaved : function(token) {
            return (this._getIndex(token) >= 0);
        },

        isFileNameSaved : function(filename) {
            return this.isTokenSaved(filename.substr(0, filename.length - 4));
        }
    });
})(PandoraRipper);



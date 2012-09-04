(function(lib) {
    var model = lib.extendNamespace("model");
    
    /**
     * stores tokens for songs the user has downloaded
     */
    model.SavedSongs = lib.Class.extend({
        Static : function() {
            this.songs = new model.Songs();
            this.storage = model.PersistantData;
            this.savedSongs = this.storage.get("savedSongs", []);
            // register ownerhsip over songs
            this.songs.getMany(this.savedSongs, this);
        },
        _flush : function() {
            this.storage.save("savedSongs", this.savedSongs);
        },
        save : function(token) {
            this.songs.get(token, this);
            this.savedSongs.push(token);
            this._flush();
        },
        _getIndex : function(token) {
            return this.savedSongs.indexOf(token);
        },
        removeByToken : function(token) {
            var index = this._getIndex(token);
            if(index >= 0) {
                this.savedSongs.splice(index,1);
                this._flush();
                this.songs.remove(token, this);
            }

        },
        getAll : function() {
            return this.songs.getMany(this.savedSongs, this);
        },
        get : function(token) {
            return this.songs.get(token, this);
        },
        isTokenSaved : function(token) {
            return (this._getIndex(token) >= 0);
        },
        isFileNameSaved : function(filename) {
            return this.isTokenSaved(filename.substr(0, filename.length - 4));
        }
    });
})(PandoraRipper);



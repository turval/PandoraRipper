(function(lib) {
    var controller = lib.extendNamespace("controller");


    controller.SongsController = lib.Class.extend({
        Static : function () {
            this._fs = new lib.model.FileSystem();
            this._songStorage = new lib.model.SongStorage();
            this._saved = new lib.model.SavedSongs();
            var self = this;
            chrome.extension.onConnect.addListener(function(port) {
                var dj = new lib.util.DataJoiner();
                port.onMessage.addListener(function(msg) {
                    if(msg.data != null) {
                        dj.add(msg.data);
                    } else {
                        self._save(msg.token, dj.get());
                    }
                });
            });
        },
        
        matchAudioUrl : function(url) {
            if(!new lib.model.SongStorage().setAudioUrl(url)) {
                lib.log("song failed to match : " + url);
                var ss = new lib.model.SongStorage();
                var logger = new controller.Logger();
                var songs = ss.debug_getSongs();
                var headerStorage = new lib.model.HeaderStorage();
                var headers = headerStorage.get();
                logger.unidentifiedSong(url, songs, headers);
            }
        },

        save : function(token, cb) {
            var song = this._songStorage.getSong(token);
            if(song && song.audioUrlSource) {
                cb(song);
            }
        },
        _save : function(token, blob) {
            var self = this;
            this._fs.saveFile(token + ".m4a", blob, function(re) {
                if(re) {
                    var song = self._songStorage.getSong(token);
                    song.downloaded = false;
                    song.hasFile = true;
                    self._saved.save(song);
                    Events.fire({
                        type : "songSaved", 
                        data : song
                    });
                }  
            });
        },
        _downloaded : function(token) {
            this._saved.get(token).downloaded = true;
        },
        remove : function(token) {
            var song = this._saved.removeByToken(token);
            this._fs.removeFile(song.token + ".m4a");
            Events.fire({
                type : "removedSong", 
                data : song
            });
        },
        removeFile : function(token) {
        
        },
        getAllMeta : function() {
            return this._saved.getAll();
        },
        getFile : function(token, cb) {
            this._fs.getFile(token + '.m4a', cb);
        },
        purge : function() {
            var self = this;
            this._fs.readDirectory(function(entries) {
                var total = 0;
                for(var i = 0; i < entries.length; i++) {
                    if(!self._saved.isFileNameSaved(entries[i].name)) {
                        self._fs.removeFile(entries[i].name);
                        total++;
                    }
                }
                lib.log(total + " purged");
            });
        }
    });
})(PandoraRipper);
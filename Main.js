(function Main() {

    var fs = new FileSystem();
    var rr = ResourceRequester;
    var ss = new SongStorage();
    var hs = new HeaderStorage();
    var savedSongs = new SavedSongs(PersistantData);
    run(hs, ss);
    
    
    
    function messageReciever(data, sender, cb) {
        if(data.type == "songData") {
            parseSongMeta(data.data, cb);
        } else if(data.type == "songLike") {
            downloadSong(data.data, cb);
        } else if(data.type == "songBlob") {
            saveSong(data.data);
        }
    }
    
    function parseSongMeta(data, cb) {
        ss.addSongs(data);
        
    }
    
    
    
    function downloadSong(songToken, cb) {
        var song = ss.getSong(songToken);
        if(song != undefined) {
            console.log("downloading");
            cb(song);
        }  else {
            console.log("song not found");
        }
    }
    
    
    chrome.extension.onConnect.addListener(function(port) {
        var dj = new DataJoiner();
        port.onMessage.addListener(function(msg) {
            if(msg.data != null) {
                dj.add(msg.data);
            } else {
                saveSong({token : msg.token, blob : dj.get()});
            }
        });
    
    });
    
    function saveSong(data) {
        fs.saveFile(data.token + ".m4a", data.blob);
        savedSongs.save(ss.getSong(data.token));
    }
    
    chrome.extension.onMessage.addListener(messageReciever);
    
  
})();


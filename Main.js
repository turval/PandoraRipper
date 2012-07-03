(function Main() {

    var fs = new FileSystem();
    var rr = ResourceRequester;
    var ss = new SongStorage();
    var hs = new HeaderStorage();
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
        console.log(songToken);
        var song = ss.getSong(songToken);
        //song = undefined;
        if(song != undefined) {
            console.log("downloading");
            cb(song);
        }  else {
            song = {};
            song.audioUrlSource = "http://audio-dc6-t1-3.pandora.com/access/?version=4&lid=110999129&token=kNzUSG5li71jaaSH7iJ8aoZkJUTGFjQwASNdfJwIsOWL%2F9MyGzC7mdjvg3q%2F31RSzNtbmOTk8hhz%2BH%2Bw%2Fz4p5BWFeINeJMBYse0I1CXC9mvI1eyL0cskXX7dmMmuyhg8pU3sVZS6JvXU9qLXt7z0bDrFmRK1ghj2eLT25c%2Fy6pPl%2Bf574vjZQC%2BcO2YtC017pecD1cY6TgFRvd%2FpUZp8Uda%2FLl%2FfRvvriJerVd3Ut5LzLaAMaWsL3dQd9kdk%2BbbgKB1IUzTtdSFqk5gPVecxVQaf5SsOBwMRDjpeuWkfKvELhUwjkDDcGhzAqrehOYVqAYvVYjQpGK9yGG3%2F3V0%2B7j7rrvyWsD6U";
             song.token = "fakeToken";
             cb(song);
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
        
        console.log("file saved");
        //console.log(data);
        console.log(data.token);
        console.log(data.blob);
        
        
        
        
        
        fs.saveFile(data.token + ".m4a", data.blob);
        
    }
    
    chrome.extension.onMessage.addListener(messageReciever);
    
  
})();


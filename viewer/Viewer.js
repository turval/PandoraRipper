function Viewer() {
    var bg = chrome.extension.getBackgroundPage();
    var main = chrome.extension.getBackgroundPage().main;
    var songs = main.getAllSongs();
    var ul = $("#songs");
    console.log(songs);
    function writeUrl(a) {
        return function(file) {
            a.attr("href",file.toURL());
        }
    }
    
    function createEntry(song) {
        var a = $('<a download="' + song.name + ' - ' + song.artist + '.m4a">' + song.name + ' - ' + song.artist + '</a>');
        var li = $('<li>').append(a);
        main.getSongFile(song.token, writeUrl(a));
        ul.append(li);

    }
    
    for(var i = 0; i < songs.length; i++) {
        var song = songs[i];
        createEntry(song);
    }
    
    bg.Events.addListener("songSaved", function(data) {
        createEntry(data.data);
    });
    
}

new Viewer();
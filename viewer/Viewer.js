(function(lib) {
    
    var viewer = lib.extendNamespace("viewer");
    viewer.Viewer = function () {
        var bg = chrome.extension.getBackgroundPage();
        var api = chrome.extension.getBackgroundPage().API;
        var songs = api.getSongs();
        var ul = $("#songs");
        lib.log(songs);
        function writeUrl(a) {
            return function(file) {
                a.attr("href",file.toURL());
            }
        }
        
        function deleteSong(elem, song) {
            $(elem).remove();
            var index = songs.indexOf(song);
            songs.splice(index, 1);
            api.deleteSong(song.token);
            
        }
    
        function createEntry(song) {
            var name = $('<span class="name">' + song.name + '</span>');
            var artist = $('<span class="artist">' + song.artist + '</span>');
            var download = $('<a download="' + song.name + ' - ' + song.artist + '.m4a">Download</a>');
            var remove = $('<a class="delete">Delete</a>');
            var li = $('<li>').append(name, artist, download, remove);
            remove.click(function() {
                deleteSong(li, song);
            });
            api.getDownloadUrl(song.token, writeUrl(download));
            ul.append(li);
        }
    
        for(var i = 0; i < songs.length; i++) {
            var song = songs[i];
            createEntry(song);
        }
    
        bg.Events.addListener("songSaved", function(data) {
            createEntry(data.data);
        });
    
    };

new viewer.Viewer();
})(PandoraRipper);
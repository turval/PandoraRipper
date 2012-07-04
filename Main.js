(function Main() {

    var fs = new FileSystem();
    var requester = ResourceRequester;
    var songStorage = new SongStorage(PersistantData);
    var headerStorage = new HeaderStorage();
    //var savedSongs = new SavedSongs(PersistantData);
    var songs = new SongsController(PersistantData, songStorage);
    var dispatcher = new Dispatcher(function(){
        
        songStorage.addSongs.apply(songStorage, arguments);
    }, function() {
        songs.save.apply(songs, arguments);
    });
    run(headerStorage, songStorage);
    var viewer = null;
    
    
    /** handles opening viewer page **/
    chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
        if(viewer != null && viewer.id == tabId) {
            viewer = null;
        }
    });
    chrome.browserAction.onClicked.addListener(function(tab) {
        if(viewer == null) {
            chrome.tabs.create({url : "viewer/index.html"}, function(tab) {
                viewer = tab;
            });
        } else {
            chrome.tabs.update(viewer.id, {active : true});
            chrome.windows.update(viewer.windowId, {focused : true});
        }
    });
    
    
    window.main = {
        getAllSongs : function() {
            return songs.getAllMeta.apply(songs, arguments);
        },
        getSongFile : function() {
            return songs.getFile.apply(songs, arguments);
        },
        ss : songStorage,
        hs : headerStorage,
        songs : songs
    };
    
   

    
  
})();


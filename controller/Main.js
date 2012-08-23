(function(lib) {
    var controller = lib.extendNamespace("controller");
    
    
    
    controller.Main = lib.Class.extend({
        Static : function() {

            var fs = new lib.model.FileSystem();
            var songStorage = new lib.model.SongStorage();
            var headerStorage = new lib.model.HeaderStorage();
            var songs = new lib.controller.SongsController();
            var dispatcher = new lib.controller.Dispatcher(function(){
                songStorage.addSongs.apply(songStorage, arguments);
            }, function() {
                songs.save.apply(songs, arguments);
            });
            var requestInterceptor = new lib.controller.RequestInterceptor();
            var viewer = null;
    
    
            /** handles opening viewer page **/
            chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
                if(viewer != null && viewer.id == tabId) {
                    viewer = null;
                }
            });
            chrome.browserAction.onClicked.addListener(function(tab) {
                if(viewer == null) {
                    chrome.tabs.create({
                        url : "viewer/index.html"
                    }, function(tab) {
                        viewer = tab;
                    });
                } else {
                    chrome.tabs.update(viewer.id, {
                        active : true
                    });
                    chrome.windows.update(viewer.windowId, {
                        focused : true
                    });
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
        }
    }); 
    
    new controller.Main();
})(PandoraRipper);


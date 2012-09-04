(function(lib) {
    var controller = lib.extendNamespace("controller");
    
    
    
    controller.Main = lib.Class.extend({
        Static : function() {
            var sys = new lib.model.System();
            new controller.Update();
            new controller.Logger();
            new controller.ErrorHandler();
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
            function onRemoved(tabId, removeInfo) {
                if(viewer !== null && viewer.id === tabId) {
                    chrome.tabs.onRemoved.removeListener(onRemoved);
                    chrome.tabs.onUpdated.removeListener(onUpdated);
                    viewer = null;
                }
            }
            
            function onUpdated(tabId, changeInfo, tab) {
                if(tabId === viewer.id) {
                    if(tab.url !== viewer.url) {
                        chrome.tabs.onRemoved.removeListener(onRemoved);
                        chrome.tabs.onUpdated.removeListener(onUpdated);
                        viewer = null;
                    }
                }
            }
            
            chrome.browserAction.onClicked.addListener(function(tab) {
                if(viewer == null) {
                    viewer = null;
                    chrome.tabs.create({
                        url : "viewer/index.html"
                    }, function(tab) {
                        viewer = tab;
                        chrome.tabs.onRemoved.addListener(onRemoved);
                        chrome.tabs.onUpdated.addListener(onUpdated);
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
                    return songs.getAllMeta();
                },
                getSongFile : function(token, cb) {
                    return songs.getFile(token, cb);
                },
                ss : songStorage,
                hs : headerStorage,
                songs : songs
            };
            window.API = new controller.ContentAPI();
            lib.log("finished main init");
        }
    }); 
    
    new controller.Main();
})(PandoraRipper);


(function(lib) {
    var controller = lib.extendNamespace("controller");
    
    controller.Update = lib.Class.extend({
        Static : function() {
            var data = lib.model.PersistantData;
            var version = data.get("Update.version", "");
            if(version !== "2.1.3.1") {
                data.remove("savedSongs");
                data.remove("SongStorage.data");
                data.remove("SongStorage.songOrder");
                data.remove("SongStorage.mostRecentToken");
                data.save("Update.version", "2.1.3.1");
            }
            
        }
    });
})(PandoraRipper);
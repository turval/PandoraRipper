(function (lib){
    var controller = lib.extendNamespace("controller");
    
    controller.ContentAPI = lib.Class.extend({
       Static : function() {
           this._songsController = new controller.SongsController();
       },
       getSongs : function() {
           return this._songsController.getAllMeta();
       },
       getDownloadUrl : function(token, cb) {
           this._songsController.getFile(token, cb);
       },
       songDownloaded : function(token) {
           //this._songsController._downloaded(token);
       },
       deleteSong : function(token) {
           this._songsController.remove(token);
       }
    });
})(PandoraRipper);

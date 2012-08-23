(function(lib){

    var controller = lib.extendNamespace("controller");

    controller.Dispatcher = lib.Class.extend({
        init : function (songData, songLiked) {
            function messageReciever(data, sender, cb) {
                if(data.type == "songData") {
                    songData(data.data, cb);
                } else if(data.type == "songLike") {
                    songLiked(data.data, cb);
                }
            }
            chrome.extension.onRequest.addListener(messageReciever);
        }
    });
})(PandoraRipper);



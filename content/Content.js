(function(lib) {
    var content = lib.extendNamespace("content");
    
    content.Content = lib.Class.extend({
        Static : function() {
            var songData = this.createEventDiv('songData');
            var songLike = this.createEventDiv('songLike');
            var self = this;
            songData.addEventListener('songData', function() {
                lib.log("hear event");
                chrome.extension.sendRequest({
                    type : "songData", 
                    data : songData.innerText
                });
            });

            songLike.addEventListener("songLike", function() {
                lib.log("song liked");
                chrome.extension.sendRequest({
                    type : "songLike", 
                    data : songLike.innerText
                }, self.download);
            });
            
            

            var script = document.createElement('script');


            script.appendChild(document.createTextNode('('+ lib.content.Spy +')();'));
            (document.body || document.head || document.documentElement).appendChild(script);
        },
        createEventDiv : function(name) {
            var elem = $('<div id="pr_' + name + '" style="display:none"></div>');
            $('body').append(elem);
            return elem.get(0);
        },
        download : function(song) {
            var self = this;
            lib.log(song);
            lib.content.ResourceRequester.get(song.audioUrlSource, function(ua) {
                lib.log("got some blob back");
                var port = chrome.extension.connect({
                    name: "sendSong"
                });
                var ds = new lib.content.DataSplitter(ua);

                while(ds.hasNext()) {
                    port.postMessage({
                        data : ds.getNext(), 
                        token : song.token
                    });
                }
                port.postMessage({
                    data : null, 
                    token : song.token
                });
                port.disconnect();

            }); 
        } 
    });

    new content.Content();
})(PandoraRipper);
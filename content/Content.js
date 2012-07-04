function createEventDiv(name) {
    var elem = $('<div id="pr_' + name + '" style="display:none"></div>');
    $('body').append(elem);
    return elem.get(0);
}

var songData = createEventDiv('songData');
var songLike = createEventDiv('songLike');

songData.addEventListener('songData', function() {
    console.log("hear event");
    chrome.extension.sendMessage({type : "songData", data : songData.innerText});
});

songLike.addEventListener("songLike", function() {
    console.log("song liked");
    chrome.extension.sendMessage({type : "songLike", data : songLike.innerText}, download);
});

function download(song) {
    console.log(song);
    ResourceRequester.get(song.audioUrlSource, function(ua) {
        console.log("got some blob back");
        
        var port = chrome.extension.connect({name: "sendSong"});
        var ds = new DataSplitter(ua);
          
        while(ds.hasNext()) {
            port.postMessage({data : ds.getNext(), token : song.token});
        }
        port.postMessage({data : null, token : song.token});
        port.disconnect();
   
    }); 
}

var script = document.createElement('script');


script.appendChild(document.createTextNode('('+ Spy +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
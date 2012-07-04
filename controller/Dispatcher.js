function Dispatcher(songData, songLiked) {
    function messageReciever(data, sender, cb) {
        if(data.type == "songData") {
            songData(data.data, cb);
        } else if(data.type == "songLike") {
            songLiked(data.data, cb);
        }
    }
    
    chrome.extension.onMessage.addListener(messageReciever);
}
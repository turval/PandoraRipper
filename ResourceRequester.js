var ResourceRequester = {};
if (!window.BlobBuilder && window.WebKitBlobBuilder)
    window.BlobBuilder = window.WebKitBlobBuilder;

    var headers = [{name : "Cookie", value : "v2regbstage=true; __utma=118078728.1243841467.1340984217.1341133568.1341160245.4; __utmb=118078728.2.10.1341160245; __utmc=118078728; __utmz=118078728.1340984217.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); at=wx/hREOAPuz6fOG5djFlvzSOfE3id7brg7mFCx2KL5KxiPLTPSnhApJHuXOpIkqIfa0sRrdgwndgRPSvMyDW8ew%3D%3D; v3ad=1:22:1:95062:ip:0:0:0:0:828:283:CA:06087:2:0:0:0; atn=AT-1341160456684-783"},
                         {name : "Host" , value : "audio-sv5-t1-2.pandora.com"},
                         {name : "Referer" , value : "http://www.pandora.com/js/libs/jquery.jplayer-2.1.2/Jplayer.swf"}];

ResourceRequester.get = function(url, callback) {
    var xhr = new XMLHttpRequest(); 
    xhr.responseType = 'arraybuffer';
    
    
    xhr.onload = function(e) {
        console.log("on load");
        console.log(this);
        console.log(this.getAllResponseHeaders());
        var ua = new Uint8Array(this.response);
        var bb = new BlobBuilder();
        bb.append(this.response);
        console.log(bb.getBlob());
        console.log("made ua");
        
        
        callback(ua);
    }
    
    xhr.open('GET', url, true);
    xhr.setRequestHeader("X-PR", "true");
    /*for (var i = 0; i < headers.length; i++) {
          xhr.setRequestHeader(headers[i].name,headers[i].value);
    }*/
    xhr.send();
}



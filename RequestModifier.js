function run(hs, ss) {
    
    chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    console.log("moding headers");
    console.log(details);
    console.log(details.requestHeaders);
    
    var headers = details.requestHeaders;
    if(hs.hasHeader(headers, "X-PR")) {
        return {requestHeaders : hs.get()};
    } else {
        hs.add(headers);
        ss.setAudioUrl(details.url);
        return {requestHeaders : hs.get()};
    }
    /*var newHeaders = [{name : "Cookie", value : "v2regbstage=true; __utma=118078728.1243841467.1340984217.1341133568.1341160245.4; __utmb=118078728.2.10.1341160245; __utmc=118078728; __utmz=118078728.1340984217.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); at=wx/hREOAPuz6fOG5djFlvzSOfE3id7brg7mFCx2KL5KxiPLTPSnhApJHuXOpIkqIfa0sRrdgwndgRPSvMyDW8ew%3D%3D; v3ad=1:22:1:95062:ip:0:0:0:0:828:283:CA:06087:2:0:0:0; atn=AT-1341160456684-783"},
                      {name : "Cache-Control", value : "max-age=0"},
                      {name : "Referer" , value : "http://www.pandora.com/js/libs/jquery.jplayer-2.1.2/Jplayer.swf"}];
    
for(var k = 0; k < newHeaders.length; k++) {
        var newHeader = newHeaders[k];
        var inserted = false;
        for(var i = 0; i < headers.length; i++) {
            var header = headers[i];
            if(header.name == newHeader.name) {
                header.value = newHeader.value;
                inserted = true;
                break;
            }
        }
        if(!inserted) {
            headers.push(newHeader);
        }
    }*/
    //details.requestHeaders = headers;
    //console.log(headers);
    
    
    //return {requestHeaders : headers};

},
    {
    urls: [
      //"http://*/*",
      "http://*.pandora.com/access/*"
    
      
    ]},["blocking","requestHeaders"]);





chrome.webRequest.onHeadersReceived.addListener(function(details){
    //console.log(details);
    var headers = details.responseHeaders.clone();
    var newHeaders = [{name : "Cache-Control", value : "max-age=3600"},
                      {name : "Pragma" , value : ""},
                      {name : "Expires" , value : ""}];
    for(var k = 0; k < newHeaders.length; k++) {
        var newHeader = newHeaders[k];
        var inserted = false;
        for(var i = 0; i < headers.length; i++) {
            var header = headers[i];
            if(header.name == newHeader.name) {
                header.value = newHeader.value;
                inserted = true;
                break;
            }
        }
        if(!inserted) {
            headers.push(newHeader);
        }
    }
    console.log(details);
    console.log(headers);
    details.responseHeaders = headers;
    return {responseHeaders : headers};

},
    {
    urls: [
      "http://*.pandora.com/access/*"
      
    ]},["responseHeaders", "blocking"]);


Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};
}


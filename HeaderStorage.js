HeaderStorage = function() {
    this.requestHeaders = [];
    this.whiteList = ["Cookie", "Cache-Control","Referer"];
}

HeaderStorage.prototype.add = function(headers) {
    //if (this.requestHeaders.length == 0) {
        headers = headers.clone();
        for(var i = 0; i < headers.length; i++) {
            var header = headers[i];
            if(this.whiteList.indexOf(header.name) >= 0) {
                this.requestHeaders.push(header);
            }
        }
        this.requestHeaders.push ({name : "Cache-Control", value : "max-age=3600"});
        console.log("saved headers");
        console.log(this.requestHeaders);
    //}
    
}

HeaderStorage.prototype.get = function() {
    return this.requestHeaders.clone();
}

HeaderStorage.prototype.hasHeader = function(headers, name) {
    for(var i = 0; i < headers.length; i++) {
        if(headers[i].name == name) {
            return true;
        }
    }
    return false;
}

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
}
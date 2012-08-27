(function(lib) {
    var model = lib.extendNamespace("model");


    model.HeaderStorage = lib.Class.extend({
        Static : function() {
    
            this.requestHeaders = {};
            this.whiteList = ["Cookie", "Cache-Control","Referer"];
        },

        add : function(headers) {
            headers = lib.clone(headers);
            for(var i = 0; i < headers.length; i++) {
                var header = headers[i];
                if(this.whiteList.indexOf(header.name) >= 0) {
                    this.requestHeaders[header.name] = header.value;
                }
            }
            lib.log("saved headers");
            lib.log(this.requestHeaders);
        },

        get : function() {
            var headers = [];
            for (var i in this.requestHeaders) {
                if(this.requestHeaders.hasOwnProperty(i)) {
                    headers.push({name : i,
                                  value : this.requestHeaders[i]});
                }
            }
            return headers;
        },
        
        hasHeader : function(headers, name) {
            for(var i = 0; i < headers.length; i++) {
                if(headers[i].name == name) {
                    return true;
                }
            }
            return false;
        }    
    });
})(PandoraRipper);
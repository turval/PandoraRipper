(function(lib) {
    var controller = lib.extendNamespace("controller");
    
    controller.RequestInterceptor = lib.Class.extend({

        Static : function() {
            var self = this;
            this.hs = new lib.model.HeaderStorage();
            chrome.webRequest.onBeforeSendHeaders.addListener(function(args) {
                this.beforeSendHeaders.call(self, args);
            },
            {urls : [
                //"http://*/*",
                "http://*.pandora.com/access/*"
            ]},
            ["blocking","requestHeaders"]);
            
            chrome.webRequest.onHeadersReceived.addListener(function(args) {
                this.onHeadersReceived.call(self, args);
            },
            {urls: [
                "http://*.pandora.com/access/*"
            ]},
            ["responseHeaders", "blocking"]);
            
        },
        
        beforeSendHeaders : function(details){
            lib.log("moding headers");
            lib.log(details);
            lib.log(details.requestHeaders);
    
            var headers = details.requestHeaders;
            if(this.hs.hasHeader(headers, "X-PR")) {
                return {requestHeaders : this.hs.get()};
            } else {
                this.hs.add(headers);
                controller.SongsController.matchAudioUrl(details.url);
                return {requestHeaders : this.hs.get()};
            }
        },
        
        onHeadersRecieved : function(details){
            var headers = details.responseHeaders.libClone();
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
            lib.log(details);
            lib.log(headers);
            details.responseHeaders = headers;
            return {responseHeaders : headers};

        }
    });
    
})(PandoraRipper);
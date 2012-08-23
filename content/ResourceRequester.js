(function(lib) {
    var content = lib.extendNamespace("content");
    
    content.ResourceRequester = (function() {
        if (!window.BlobBuilder && window.WebKitBlobBuilder)
            window.BlobBuilder = window.WebKitBlobBuilder;
        return {
            get : function(url, callback) {
                var xhr = new XMLHttpRequest(); 
                xhr.responseType = 'arraybuffer';

                xhr.onload = function(e) {
                    lib.log("Recieving File");
                    lib.log(this);
                    lib.log(this.getAllResponseHeaders());
                    var ua = new Uint8Array(this.response);
                    var bb = new BlobBuilder();
                    bb.append(this.response);
                    lib.log(bb.getBlob());
                    lib.log("made UintArray");
                    callback(ua);
                }
    
                xhr.open('GET', url, true);
                xhr.setRequestHeader("X-PR", "true");
                xhr.send();
            }
        }
    });

})(PandoraRipper);



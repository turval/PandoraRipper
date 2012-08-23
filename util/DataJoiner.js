(function(lib){
    var util = lib.extendNamespace('util');
    
    util.DataJoiner = lib.Class.extend({
        init : function() {
            this.builder = new BlobBuilder();
        },
    
        add : function(array) {
            this.builder.append(new Uint8Array(array).buffer);
        },

        get : function() {
            return this.builder.getBlob();
        }
    });
})(PandoraRipper);
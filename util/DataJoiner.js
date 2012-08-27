(function(lib){
    var util = lib.extendNamespace('util');
    
    util.DataJoiner = lib.Class.extend({
        init : function() {
            this.parts = [];
        },
    
        add : function(array) {
            this.parts.push(new Uint8Array(array));
        },

        get : function() {
            return new Blob(this.parts);
        }
    });
})(PandoraRipper);
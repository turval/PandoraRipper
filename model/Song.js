(function(lib) {
    var model = lib.extendNamespace("model");

    model.Song = lib.Class.extend({
        init : function (obj, fromStorage) {
            if(!fromStorage) lib.log(obj);
            var def = [
            {
                name : "songTitle", 
                val : "#text", 
                key : "name"
            },

            {
                name : "artistSummary", 
                val : "#text", 
                key : "artist"
            },

            {
                name : "albumTitle", 
                val : "#text", 
                key : "album"
            },

            {
                name : "trackToken", 
                val : "#text", 
                key : "token"
            },

            {
                name : "audioURL", 
                val : "#text", 
                key : "audioUrl"
            },

            {
                name : "artRadio", 
                val : "#text", 
                key : "artworkUrl"
            }
            ];
            if(!fromStorage) {
                try {
                    var data = obj.struct.member;
                    for(var i = 0; i < data.length; i++) {
                        var name = data[i].name["#text"];
                        var val = data[i].value;

                        for(var k = 0; k < def.length; k++) {
                            if(def[k].name == name) {
                                this[def[k].key] = val[def[k].val];
                                break;
                            }
                        }
                    }
                } catch(e) {
                    new lib.controller.Logger().caughtError("Error constructing song", obj, e);
                }
            } else {
                for(var i in obj) {
                    if(obj.hasOwnProperty(i)) {
                        this[i] = obj[i];
                    }
                }
            }
        },
        set : function() {
            var fn;
            if (arguments.length === 2) {
                fn = this._setKey;
            } else if (arguments.length === 1) {
                fn = this._setObj;
            }
            if (fn.apply(this, arguments)) {
                Events.fire({
                    type : "SongUpdated",
                    token : this.token
                });
            }
        },
        _setKey : function(key, val) {
            var previousVal = this[key];
            this[key] = val;
            if(previousVal !== val) {
                return false;
            }
            return true;
        },
        _setObj : function(obj) {
            var re = false;
            for(var i in obj) {
                if(obj.hasOwnProperty(i)) {
                    if(this._setKey(i, obj[i])) {
                        re = true;
                    }
                }
            }
            return re;
        }
    });
})(PandoraRipper);


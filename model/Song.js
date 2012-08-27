(function(lib) {
    var model = lib.extendNamespace("model");

    model.Song = lib.Class.extend({
        init : function (obj) {
            lib.log(obj);
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
        }
    });
})(PandoraRipper);


(function(lib) {
    var model = lib.extendNamespace("model");
    
    
    model.System = lib.Class.extend({
        Static : function() {
            var data = lib.model.PersistantData;
            var preVal = data.get("system", {});
            lib.log("previous system values");
            lib.log(preVal);
            var reVal = {
                version : lib.manifest.version,
                previousVersion : preVal.version !== undefined && 
                                  preVal.version !== lib.manifest.version
                                  ? preVal.version : null,
                chromeUserAgent : navigator.userAgent 
            };
            data.save("system", reVal);
            if(preVal.version === undefined) {
                reVal.install = true;
            }
            if(!reVal.install && preVal.version !== reVal.version) {
                reVal.upgrade = true;
            }
            this.properties = reVal;
            
            
        },
        getProperties : function() {
            return this.properties;
        },
        compareVersion : function(vString) {
            var current = this.properties.version.split(".");
            var test = vString.split(".");
            for(var i = 0; i < current.length && i < test.length; i++) {
                if(current[i] === test[i]) continue;
                if(current[i] > test[i]) return -1;
                if(current[i] < test[i]) return 1;
            }
            if(current.length === test.length) return 0;
            return current.length < test.length ? 1 : -1;
        }
    });
    new model.System();
})(PandoraRipper);
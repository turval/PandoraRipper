(function(lib) {
    var model = lib.extendNamespace("model");
    
    
    model.System = lib.Class.extend({
        Static : function() {
            var data = lib.model.PersistantData;
            var preVal = data.get("system", {});
            lib.log(preVal);
            var reVal = {
                version : lib.manifest.version,
                previousVersion : preVal.version !== undefined && 
                                  preVal.version !== lib.manifest.version
                                  ? preVal.version : null,
                chromeUserAgent : navigator.userAgent 
            };
            data.save("system", reVal);
            if(preVal.version !== undefined) {
                reVal.install = true;
            }
            if(preVal.version !== reVal.version) {
                reVal.upgrade = true;
            }
            this.properties = reVal;
            
            
        },
        getProperties : function() {
            return this.properties;
        }
    });
    new model.System();
})(PandoraRipper);
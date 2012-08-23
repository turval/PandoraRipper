(function(lib) {
    /*Object.prototype.libClone = function() {
        var newObj = (this instanceof Array) ? [] : {};
        for (i in this) {
            if (i == 'libClone') continue;
            if (this[i] && typeof this[i] == "object") {
                newObj[i] = this[i].libClone();
            } else newObj[i] = this[i]
        }
        return newObj;
    }*/
    

    /**
     * extends the application to create the appropriate namespace specified
     * @param {string} ns_string namespace string "obj.subobj.subsubobj"
     */
    lib.extendNamespace = function (ns_string) {  
        var parts = ns_string.split('.'),  
        parent = lib,  
        pl, i;  
        if (parts[0] === "lib") {  
            parts = parts.slice(1);  
        }  
        pl = parts.length;  
        for (i = 0; i < pl; i++) {  
            //create a property if it doesnt exist  
            if (typeof parent[parts[i]] === 'undefined') {  
                parent[parts[i]] = {};  
            }  
            parent = parent[parts[i]];  
        }  
        return parent;  
    };
    
    lib.log = function(msg) {
        if(lib.model.Config.debug) {
            console.log("[" + new Date() + "] ");
            console.log(msg);
        }
    }
})(PandoraRipper);



(function(lib) {
    lib.clone = function(obj) {
        var blank = obj instanceof Array ? [] : {};
        return $.extend(true, blank, obj);
    },
    lib.shallowClone = function(obj) {
        var temp = [];
        for(var i = 0; i < obj.length; i++) {
            temp.push(obj[i]);
        }
        return temp;
    }
    

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
            var info = "[" + new Date() + "] ";
            if(typeof msg == "string") {
                console.log(info + msg);
            } else {
                console.log(info);
                console.log(msg);
            }
        }
    }
})(PandoraRipper);



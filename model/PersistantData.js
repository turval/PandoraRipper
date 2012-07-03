var PersistantData = {
    save : function(key, obj) {
        localStorage[key] = JSON.stringify(obj);
    },
    get : function(key) {
        var val = localStorage[key];
        if(val == undefined || val == null) {
            return val;
        } 
        return JSON.parse(val);
    },
    remove : function(key) {
        localStorage.removeItem(key);
    }
}
(function(lib){
    var controller = lib.extendNamespace('controller');
    
    controller.ErrorHandler = lib.Class.extend({
       Static : function(){
           window.onerror = this.uncaughtError;
       },
       uncaughtError : function(msg, url, lineNumber) {
           lib.log(arguments);
           new lib.controller.Logger().error({
               msg : msg,
               url : url,
               line : lineNumber
           });
           return true;
       }
    });
})(PandoraRipper);
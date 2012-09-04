(function(lib) {
    var controller = lib.extendNamespace("controller");

    controller.Logger = lib.Class.extend({
        Static : function(sysInfo) {
            this.data = lib.model.PersistantData;
            this.queue = this.data.get("Logger", []);
            this.sys = new lib.model.System();
            var props = this.sys.getProperties()
            if(props.install) {
                this.install();
            } else if(props.upgrade) {
                this.upgrade();
            }
            var minutes = 600000; // 10 min
            var self = this;
            this.timeout = setInterval(function() {
                self._sendLogs();
            }, minutes);
        },

        install : function() {
            this._log("install");
        },

        upgrade : function() {
            this._log("upgrade");
        },

        unidentifiedSong : function(songUrl, songsData, headers) {
            this._log("unidentifiedSong", {songUrl : songUrl, songsData : songsData, headers : headers});
        },
        
        error : function(error) {
            this._log("error", error);
        },
		
        caughtError : function(msg, contextData, error) {
            this._log("caughtError", {
                msg : msg,
                context : contextData,
                error : error
            });
        },
        
        _log : function(type, data) {
            if(!lib.model.Config.log) {
                lib.log(type);
                lib.log(data);
                return;
            }
            if(data === undefined) {
                data = null;
            }
            this.queue.push({type : type,
                             data : data,
                             system : this.sys.getProperties()});
            if(this.queue.length > 100) {
                this.queue.splice(0, this.queue.length - 100);
            }
            this.data.save("Logger", this.queue);
        },

        _sendLogs : function() {
            if(this.queue.length === 0) return;
            var endIndex = this.queue.length;
            var self = this;
            this._withLogTimes();
            
            /*var data = {};
            for(var i = 0; i < this.queue.length; i++) {
                data["" + i] = this.queue[i];
            }*/
            $.ajax(lib.model.Config.logUrl, {
                data : {logs : this.queue},
                type : "POST",
                success : function() {
                    self._sendCompleted(endIndex)
                },
                error : function() {
                    self._sendFailed(endIndex);
                }
            })
        },

        _sendFailed : function(endIndex) {
            lib.log("send failed");
            
        },

        _sendCompleted : function(endIndex) {
            this.queue.splice(0, endIndex);
        },

        _withLogTimes : function() {
            for(var i = 0; i < this.queue.length; i++) {
                var logData = this.queue[i];
            
                if (logData.ts === undefined) {
                    logData.ts = this._now();
                    logData.sentTs = logData.ts;
                } else {
                    logData.sentTs = this._now();
                }
            }
        },

        _now : function() {
            return new Date().getTime();
        }
    });
    
})(PandoraRipper);

	

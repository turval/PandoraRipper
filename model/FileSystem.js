(function(lib) {
    var model = lib.extendNamespace("model");
    model.FileSystem = lib.Class.extend({
        Static : function() {
            var self = this;
            this.calls = [];
            this.fsSet = false;
            window.webkitRequestFileSystem(PERSISTENT, 1024*1024*200, function(fs){
                self.fs = fs;
                self.fsSet = true;
                self.runCalls(); 
            }, this.errorHandler);
        },

        runCalls : function() {
            for (var i = 0; i < this.calls.length; i++) {
                this.calls[i]();
            }
            this.calls = null;
        },

        errorHandler : function (e) {
            var msg = '';

            switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                    msg = 'QUOTA_EXCEEDED_ERR';
                    break;
                case FileError.NOT_FOUND_ERR:
                    msg = 'NOT_FOUND_ERR';
                    break;
                case FileError.SECURITY_ERR:
                    msg = 'SECURITY_ERR';
                    break;
                case FileError.INVALID_MODIFICATION_ERR:
                    msg = 'INVALID_MODIFICATION_ERR';
                    break;
                case FileError.INVALID_STATE_ERR:
                    msg = 'INVALID_STATE_ERR';
                    break;
                default:
                    msg = 'Unknown Error';
                    break;
            };
            new lib.controller.Logger().error({
                msg : "FileSystemError: " + msg
            });
            lib.log('Error: ' + msg);
        },

        saveFile : function() {
            this._factory("_saveFile", arguments);
        },

        _saveFile : function(filename, blob, cb) {
            var self = this;
            this.fs.root.getFile(filename, {
                create: true, 
                exclusive: true
            }, function(fileEntry) {
                lib.log("got file entry");
                fileEntry.createWriter(function(writer){
                    lib.log("writing");
                    lib.log(blob);
                    writer.write(blob);
                    lib.log("wrote");
                    lib.log(fileEntry.toURL());
                    cb(true);
                }, function(e) {
                    self.errorHandler(e);
                    cb(false);
                });
            }, function(e) {
                self.errorHandler(e);
                cb(false);
            });
        },

        getFile : function() {
            this._factory("_getFile", arguments);
    
        },

        _getFile : function(filename, callback) {
            this.fs.root.getFile(filename, {}, callback);
        },

        removeFile : function() {
            this._factory("_removeFile", arguments);
        },

        _removeFile : function(filename) {
            this.fs.root.getFile(filename, {
                create: false
            }, function(fileEntry) {

                fileEntry.remove(function() {
                    lib.log('File removed.');
                }, self.errorHandler);

            }, self.errorHandler);
        },
        
        createFile : function() {
            this._factory("_createFile", arguments);
        },

        _createFile : function(filename, callback) {
            this.fs.root.getFile(filename, {create : true}, callback);
        },
        readFile : function() {
            this._factory("_readFile", arguments);
        },
        _readFile : function(filename, cb) {
            this.fs.root.getFile(filename, {}, function(fileEntry) {

                // Get a File object representing the file,
                // then use FileReader to read its contents.
                fileEntry.file(function(file) {
                    var reader = new FileReader();

                    reader.onloadend = function(e) {
                        cb(this.result);
                    };

                    reader.readAsText(file);
                });

            });

        },

        readDirectory : function() {
            this._factory("_readDirectory", arguments);
        },

        _readDirectory : function(cb) {
            function toArray(list) {
                return Array.prototype.slice.call(list || [], 0);
            }
            var self = this;
            var entries = [];
            var reader = this.fs.root.createReader();
    
            var readEntries = function() {
                reader.readEntries (function(results) {
                    if (!results.length) {
                        cb(entries.sort());
                    } else {
                        entries = entries.concat(toArray(results));
                        readEntries();
                    }
                }, self.errorHandler);
            };
            readEntries(); // Start reading dirs.
        },

        _factory : function(name, args) {
            if(this.fsSet) {
                this[name].apply(this, args);
            } else {
                var self = this;
                this.calls.push(function() {
                    self[name].apply(self, args);
                });
            }
        }
    });
})(PandoraRipper);

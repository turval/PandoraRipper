function FileSystem() {
    var self = this;
    //window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(grantedBytes) {
        window.webkitRequestFileSystem(PERSISTENT, 1024*1024*200, function(fs){
            self.fs = fs;
        }, this.errorHandler);
    //}, function(e) {
     //   console.log('Error', e);
    //});
}

FileSystem.prototype.errorHandler = function (e) {
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

  console.log('Error: ' + msg);
}

FileSystem.prototype.saveFile = function(filename, blob) {
    var self = this;
    this.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
        console.log("got file entry");
        fileEntry.createWriter(function(writer){
            console.log("writing");
            console.log(blob);
            writer.write(blob);
            console.log("wrote");
        }, self.errorHandler);
    }, this.errorHandler);
}

FileSystem.prototype.getFile = function(filename, callback) {
    this.fs.root.getFile(filename, {}, callback);
}

FileSystem.prototype.removeFile = function(filename) {
    this.fs.root.getFile(filename, {create: false}, function(fileEntry) {

    fileEntry.remove(function() {
      console.log('File removed.');
    }, self.errorHandler);

  }, self.errorHandler);
}

FileSystem.prototype.readFile = function(filename, cb) {
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

}
  

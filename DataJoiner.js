function DataJoiner() {
    this.builder = new BlobBuilder();
}

DataJoiner.prototype.add = function(array) {
    this.builder.append(new Uint8Array(array).buffer);
}

DataJoiner.prototype.get = function() {
    return this.builder.getBlob();
}
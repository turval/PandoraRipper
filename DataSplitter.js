function DataSplitter(arrayBuffer) {
    this.intArray = new Uint8Array(arrayBuffer);
    this.start = 0;
    this.end = this.intArray.length;
    this.pieceSize = 400;
}

DataSplitter.prototype.hasNext = function() {
    return this.start < this.end;
}

DataSplitter.prototype.getNext = function() {
    var sub = this.intArray.subarray(this.start, this.start + this.pieceSize);
    this.start += this.pieceSize;
    return Array.apply(null, sub);
}
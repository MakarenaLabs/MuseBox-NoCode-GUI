//MuseBox input
(function(global) {
    var LiteGraph = global.LiteGraph;

/******
 * SCALE
 */
function Scale(){
    this.addInput("image in", "frame,canvas,image");
    this.addOutput("image out", "frame,canvas,image");
    this.addProperty("width", "640");
    this.addProperty("height", "480");
}
Scale.title = "Scale";
Scale.desc = "Scale to fixed width and height";

Scale.prototype.onConfigure = function(o) {
};
Scale.prototype.onExecute = function() {
    var frame = this.getInputData(0);
    if(frame){
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");
        canvas.width = this.properties.width;
        canvas.height = this.properties.height;
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        this.setOutputData(0, canvas);
    }
};
LiteGraph.registerNodeType("MuseBox Operators/Scale", Scale);


/******
 * Count Bounding Boxes
 */
function CountBoundingBoxes(){
    this.addInput("bounding box", "face bounding box, bounding box, bounding boxes");

    this.addOutput("result", "number");
}
CountBoundingBoxes.title = "Count Bounding Boxes";
CountBoundingBoxes.desc = "Count Bounding Boxes";

CountBoundingBoxes.prototype.onExecute = function() {
    var bbs = this.getInputData(0);
    if(bbs){
        this.setOutputData(0, bbs.length);
    }
    else {
        this.setOutputData(0, 0);
    }
};
LiteGraph.registerNodeType("MuseBox Operators/Count Bounding Boxes", CountBoundingBoxes);


})(this);

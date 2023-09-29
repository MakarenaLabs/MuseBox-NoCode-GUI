var objectDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function ObjectDetection(){
		this.addInput("frame", "frame");		
		
		this.addOutput("object bounding box", "object bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
    }
    ObjectDetection.title = "Object Detection";
    ObjectDetection.desc = "It detects the objects in a scene up to 32x32 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Object Detection", ObjectDetection);
	ObjectDetection.prototype.onExecute = function() {
		if(objectDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				objectDetectionOP.sem = false;
				objectDetectionOP.frame = frame;
				sendImage("ObjectDetection", frame);
			}
			if(!objectDetectionOP.initListener){
				objectDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("ObjectDetection", (value) => {
					/* draw */
					var canvas = frame2Canvas(objectDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						var bb = value.data[i].boundingBox;
						var text = value.data[i].boundingBox.label;
						draw_bb(bb, context);
						draw_text(text, bb, context);
					}

					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					objectDetectionOP.sem = true;
				})
			}
		}

    };

})(this);
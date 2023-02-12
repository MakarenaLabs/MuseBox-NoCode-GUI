var faceDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function FaceDetection(){
		this.addInput("frame", "frame");		
		this.addInput("person bounding box", "person bounding box");
		
		this.addOutput("face bounding box", "face bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
	}
    FaceDetection.title = "Face Detection";
    FaceDetection.desc = "It detects the faces in a scene up to 32x32 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Detection", FaceDetection);
	FaceDetection.prototype.onExecute = function() {

		if(faceDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				faceDetectionOP.sem = false;
				faceDetectionOP.frame = frame;
				sendImage("FaceDetection", frame);
			}
			if(!faceDetectionOP.initListener){
				faceDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("FaceDetection", (value) => {
					/* draw */
					var canvas = frame2Canvas(faceDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						draw_bb(value.data[i].face_BB, context);
					}
					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					faceDetectionOP.sem = true;
				})
			}
		}

	};

})(this);
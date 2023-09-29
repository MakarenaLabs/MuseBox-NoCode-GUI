var ageDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function AgeDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
    }
    AgeDetection.title = "Age Detection";
    AgeDetection.desc = "Given a face bounding box, it detects the apparet age of the person";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Age Detection", AgeDetection);
	AgeDetection.prototype.onExecute = function() {

		if(ageDetectionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				ageDetectionOP.frame = frame;
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].boundingBox;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("AgeDetection", face);
					ageDetectionOP.bbs.push(bb);
					ageDetectionOP.sem++;
				}
			}

			if(!ageDetectionOP.initListener){
				ageDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("AgeDetection", (value) => {
					if(ageDetectionOP.tempCanvas == null){
						ageDetectionOP.tempCanvas = frame2Canvas(ageDetectionOP.frame);
					}
					var canvas = ageDetectionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = ageDetectionOP.bbs.shift();
                    text = value.data.prediction;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					ageDetectionOP.tempCanvas = canvas;
			
					if(ageDetectionOP.sem == 1){
						this.setOutputData(1, canvas);
						ageDetectionOP.tempCanvas = null;
					}
					ageDetectionOP.sem--;
				})
			}
		}

    };		

})(this);

var genderDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;
	
	function GenderDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
	}
    GenderDetection.title = "Gender Detection";
    GenderDetection.desc = "Given a face bounding box, it determines if the person is female or male";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Gender Detection", GenderDetection);
	GenderDetection.prototype.onExecute = function() {

		if(genderDetectionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				genderDetectionOP.frame = frame;
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("GenderDetection", face);
					genderDetectionOP.bbs.push(bb);
					genderDetectionOP.sem++;
				}
			}

			if(!genderDetectionOP.initListener){
				genderDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("GenderDetection", (value) => {
					if(genderDetectionOP.tempCanvas == null){
						genderDetectionOP.tempCanvas = frame2Canvas(genderDetectionOP.frame);
					}
					var canvas = genderDetectionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = genderDetectionOP.bbs.shift();
                    text = value.gender;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					genderDetectionOP.tempCanvas = canvas;
			
					if(genderDetectionOP.sem == 1){
						this.setOutputData(1, canvas);
						genderDetectionOP.tempCanvas = null;
					}
					genderDetectionOP.sem--;
				})
			}
		}

    };		

})(this);

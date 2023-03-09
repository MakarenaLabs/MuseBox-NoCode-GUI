var glassesDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function GlassesDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
    }
    GlassesDetection.title = "Glasses Detection";
    GlassesDetection.desc = "Given a face bounding box, it detects whether a person wear glasses or not";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Glasses Detection", GlassesDetection);
	GlassesDetection.prototype.onExecute = function() {

		if(glassesDetectionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				glassesDetectionOP.frame = frame;
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("GlassesDetection", face);
					glassesDetectionOP.bbs.push(bb);
					glassesDetectionOP.sem++;
				}
			}

			if(!glassesDetectionOP.initListener){
				glassesDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("GlassesDetection", (value) => {
					if(glassesDetectionOP.tempCanvas == null){
						glassesDetectionOP.tempCanvas = frame2Canvas(glassesDetectionOP.frame);
					}
					var canvas = glassesDetectionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = glassesDetectionOP.bbs.shift();
                    text = value.glasses;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					glassesDetectionOP.tempCanvas = canvas;
			
					if(glassesDetectionOP.sem == 1){
						this.setOutputData(1, canvas);
						glassesDetectionOP.tempCanvas = null;
					}
					glassesDetectionOP.sem--;
				})
			}
		}

    };		

})(this);

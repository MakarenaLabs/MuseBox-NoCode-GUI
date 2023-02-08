var maskDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

    function MaskDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
	}
    MaskDetection.title = "Mask Detection";
    MaskDetection.desc = "Given a face bounding box, it detects whether a person wear a mask or not";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Mask Detection", MaskDetection);
	MaskDetection.prototype.onExecute = function() {

		/* musebox communication */
		if(maskDetectionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				maskDetectionOP.frame = frame;
				/* musebox communication */
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("MaskDetection", face);
					maskDetectionOP.bbs.push(bb);
					maskDetectionOP.sem++;
				}
			}

			if(!maskDetectionOP.initListener){
				maskDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("MaskDetection", (value) => {
					if(maskDetectionOP.tempCanvas == null){
						maskDetectionOP.tempCanvas = frame2Canvas(maskDetectionOP.frame);
					}
					var canvas = maskDetectionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = maskDetectionOP.bbs.shift();
                    text = value.data.GlassesDetection[i].glasses;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					maskDetectionOP.tempCanvas = canvas;
			
					if(maskDetectionOP.sem == 1){
						this.setOutputData(1, canvas);
						maskDetectionOP.tempCanvas = null;
					}
					maskDetectionOP.sem--;
				})
			}
		}

    };		

})(this);

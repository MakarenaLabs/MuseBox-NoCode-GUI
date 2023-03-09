var faceRecognitionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function FaceRecognition(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
	}
    FaceRecognition.title = "Face Recognition";
    FaceRecognition.desc = "Given a face bounding box and a database of faces, it recognizes a face in a scene";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Recognition", FaceRecognition);
	FaceRecognition.prototype.onExecute = function() {

		if(faceRecognitionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				faceRecognitionOP.frame = frame;

				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("FaceRecognition", face);
					faceRecognitionOP.bbs.push(bb);
					faceRecognitionOP.sem++;
				}
			}

			if(!faceRecognitionOP.initListener){
				faceRecognitionOP.initListener = true; 
				responseFromMuseBox.addListener("FaceRecognition", (value) => {
					if(faceRecognitionOP.tempCanvas == null){
						faceRecognitionOP.tempCanvas = frame2Canvas(faceRecognitionOP.frame);
					}
					var canvas = faceRecognitionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = faceRecognitionOP.bbs.shift();
                    text = value.personFound;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					faceRecognitionOP.tempCanvas = canvas;
			
					if(faceRecognitionOP.sem == 1){
						this.setOutputData(1, canvas);
						faceRecognitionOP.tempCanvas = null;
					}
					faceRecognitionOP.sem--;
				})
			}
		}

    };		

})(this);
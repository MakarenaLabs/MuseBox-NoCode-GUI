var faceLandmarkOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	/* FACE LANDMARKING */
	function FaceLandmarking(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");
		
		this.addOutput("98 face points", "68 face points");
		this.addOutput("post processing", "image");
		this.addOutput("crop 1", "image");
		this.addOutput("crop 2", "image");
		this.addOutput("crop 3", "image");
		this.addOutput("logs", "logs");
	}
    FaceLandmarking.title = "Face Landmarking";
    FaceLandmarking.desc = "Given a face bounding box, it extracts the 98 relevant points of a face ";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Landmarking", FaceLandmarking);
	FaceLandmarking.prototype.onExecute = function() {

		if(faceLandmarkOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				faceLandmarkOP.frame = frame;
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("FaceLandmark", face);
					faceLandmarkOP.bbs.push(bb);
					faceLandmarkOP.sem++;
				}
			}

			if(!faceLandmarkOP.initListener){
				faceLandmarkOP.initListener = true; 
				responseFromMuseBox.addListener("FaceLandmark", (value) => {
					if(faceLandmarkOP.tempCanvas == null){
						faceLandmarkOP.tempCanvas = frame2Canvas(faceLandmarkOP.frame);
					}
					var canvas = faceLandmarkOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = faceLandmarkOP.bbs.shift();
					var width = faceBB.width;
					var height = faceBB.height;
					var lm_point = value.landmarks;
		
					for (var j = 0; j < 136; j += 2) {
						// console.log(lm_point[j] * width + faceBB.x, lm_point[j+1] * height + faceBB.y);
						point(lm_point[j] * width + faceBB.x, lm_point[j+1] * height + faceBB.y, context);
					}

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					faceLandmarkOP.tempCanvas = canvas;
			
					if(faceLandmarkOP.sem == 1){
						this.setOutputData(1, canvas);
						faceLandmarkOP.tempCanvas = null;
					}
					faceLandmarkOP.sem--;
				})
			}
		}

    };	    
})(this);
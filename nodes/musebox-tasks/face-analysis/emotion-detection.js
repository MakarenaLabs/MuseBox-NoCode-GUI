var emotionRecognitionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function EmotionRecognition(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
    }
    EmotionRecognition.title = "Emotion Detection";
    EmotionRecognition.desc = "Given a face bounding box, it detects the facial expression of the person";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Emotion Detection", EmotionRecognition);
	EmotionRecognition.prototype.onExecute = function() {

		if(emotionRecognitionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				emotionRecognitionOP.frame = frame;
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("EmotionDetection", face);
					emotionRecognitionOP.bbs.push(bb);
					emotionRecognitionOP.sem++;
				}
			}

			if(!emotionRecognitionOP.initListener){
				emotionRecognitionOP.initListener = true; 
				responseFromMuseBox.addListener("EmotionDetection", (value) => {
					if(emotionRecognitionOP.tempCanvas == null){
						emotionRecognitionOP.tempCanvas = frame2Canvas(emotionRecognitionOP.frame);
					}
					var canvas = emotionRecognitionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = emotionRecognitionOP.bbs.shift();
                    text = value.emotion;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					emotionRecognitionOP.tempCanvas = canvas;
			
					if(emotionRecognitionOP.sem == 1){
						this.setOutputData(1, canvas);
						emotionRecognitionOP.tempCanvas = null;
					}
					emotionRecognitionOP.sem--;
				})
			}
		}

    };		

})(this);

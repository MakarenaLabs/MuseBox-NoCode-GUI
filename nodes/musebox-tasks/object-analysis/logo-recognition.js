var logoRecognitionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;
	
	function LogoRecognition(){
		this.addInput("logo bounding box", "logo bounding box");
		this.addInput("prev processing", "image");

		this.addOutput("label", "label");
		this.addOutput("post processing", "image");
        this.addOutput("logs", "logs");
	}
    LogoRecognition.title = "Logo Recognition";
    LogoRecognition.desc = "Given a logo bounding box, it determines the brand name";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Logo Recognition", LogoRecognition);
	LogoRecognition.prototype.onExecute = function() {

		if(logoRecognitionOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				logoRecognitionOP.frame = frame;

                for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].logo_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("LogoRecognition", face);
					logoRecognitionOP.bbs.push(bb);
					logoRecognitionOP.sem++;
				}
			}

			if(!logoRecognitionOP.initListener){
				logoRecognitionOP.initListener = true; 
				responseFromMuseBox.addListener("LogoRecognition", (value) => {
					if(logoRecognitionOP.tempCanvas == null){
						logoRecognitionOP.tempCanvas = frame2Canvas(logoRecognitionOP.frame);
					}
					var canvas = logoRecognitionOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = logoRecognitionOP.bbs.shift();
                    text = value.logoFound;
                    draw_text(text, faceBB, context);

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					logoRecognitionOP.tempCanvas = canvas;
			
					if(logoRecognitionOP.sem == 1){
						this.setOutputData(1, canvas);
						logoRecognitionOP.tempCanvas = null;
					}
					logoRecognitionOP.sem--;
				})
			}
		}        

    };	

})(this);
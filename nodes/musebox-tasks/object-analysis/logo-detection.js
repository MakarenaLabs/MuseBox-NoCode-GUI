var logoDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function(global) {
    var LiteGraph = global.LiteGraph;
/* LOGO DETECTION */
	function LogoDetection(){
		this.addInput("frame", "frame");		
		
		this.addOutput("logo bounding box", "logo bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
	}
    LogoDetection.title = "Logo Detection";
    LogoDetection.desc = "It detects the logos in a scene up to 64x64 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Logo Detection", LogoDetection);
	LogoDetection.prototype.onExecute = function() {

		if(logoDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				logoDetectionOP.sem = false;
				logoDetectionOP.frame = frame;
				sendImage("LogoDetection", frame);
			}
			if(!logoDetectionOP.initListener){
				logoDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("LogoDetection", (value) => {
					/* draw */
					var canvas = frame2Canvas(logoDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						draw_bb(value.data[i].object_BB, context);
					}
					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					logoDetectionOP.sem = true;
				})
			}
		}        

    };

})(this);
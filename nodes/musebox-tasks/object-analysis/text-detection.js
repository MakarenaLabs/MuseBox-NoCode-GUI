var textDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function(global) {
    var LiteGraph = global.LiteGraph;
	function TextDetection(){
		this.addInput("frame", "frame");		
		
		this.addOutput("text bounding box", "text bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
	}
    TextDetection.title = "Text Detection";
    TextDetection.desc = "It detects where is text in a scene";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Text Detection", TextDetection);
	TextDetection.prototype.onExecute = function() {

		if(textDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				textDetectionOP.sem = false;
				textDetectionOP.frame = frame;
				sendImage("TextDetection", frame);
			}
			if(!textDetectionOP.initListener){
				textDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("TextDetection", (value) => {
					/* draw */
					var canvas = frame2Canvas(textDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						draw_bb(value.data[i].text_BB, context);
					}
					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					textDetectionOP.sem = true;
				})
			}
		}        
    };

})(this);
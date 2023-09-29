var peopleDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function(global) {
    var LiteGraph = global.LiteGraph;
/* LOGO DETECTION */
	function PeopleDetection(){
		this.addInput("frame", "frame");		
		
		this.addOutput("people bounding box", "people bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
	}
    PeopleDetection.title = "People Detection";
    PeopleDetection.desc = "It detects the people in a scene";
    LiteGraph.registerNodeType("MuseBox Tasks/People Analysis/People Detection", PeopleDetection);
	PeopleDetection.prototype.onExecute = function() {

		if(peopleDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				peopleDetectionOP.sem = false;
				peopleDetectionOP.frame = frame;
				sendImage("PeopleDetection", frame);
			}
			if(!peopleDetectionOP.initListener){
				peopleDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("PeopleDetection", (value) => {
					/* draw */
					var canvas = frame2Canvas(peopleDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						draw_bb(value.data[i].boundingBox, context);
					}
					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					peopleDetectionOP.sem = true;
				})
			}
		}        

    };

})(this);
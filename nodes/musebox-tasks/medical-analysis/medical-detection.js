var medicalDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	function MedicalDetection(){
		this.addInput("frame", "frame");		
		
		this.addOutput("medical bounding box", "object bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
    }
    MedicalDetection.title = "Medical Detection";
    MedicalDetection.desc = "Given an endoscopic image, it detects anything suspicious in it.";
    LiteGraph.registerNodeType("MuseBox Tasks/Medical Analysis/Medical Detection", MedicalDetection);
	MedicalDetection.prototype.onExecute = function() {
		if(medicalDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				medicalDetectionOP.sem = false;
				medicalDetectionOP.frame = frame;
				sendImage("MedicalDetection", frame);
			}
			if(!medicalDetectionOP.initListener){
				medicalDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("MedicalDetection", (value) => {
					/* draw */
					var canvas = frame2Canvas(medicalDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						draw_bb(value.data[i].medical_BB, context);
					}
					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					medicalDetectionOP.sem = true;
				})
			}
		}

    };

})(this);
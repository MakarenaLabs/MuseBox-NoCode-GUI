//MuseBox nodes operations




var eyeBlinkingDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};
var ageDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};
var emotionDetectionOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

//MuseBox nodes definition

(function(global) {
    var LiteGraph = global.LiteGraph;
	
	/* EYES DETECTION */
	function EyesDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("eyes bounding box", "eyes bounding box");
	}
    EyesDetection.title = "Eyes Detection";
    EyesDetection.desc = "Given a face bounding box, it determines where are the eyes";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Eyes Detection", EyesDetection);
	EyesDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };		

	/* EYES BLINKING DETECTION */
	function EyesBlinkingDetection(){
		this.addInput("eyes bounding box", "eyes bounding box");
		this.addOutput("label", "label");
	}
    EyesBlinkingDetection.title = "Eyes blinking Detection";
    EyesBlinkingDetection.desc = "Given a eyes bounding box, it determines if they are blinking or not";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Eyes blinking Detection", EyesBlinkingDetection);
	EyesBlinkingDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };		

	/* AGE DETECTION */
	function AgeDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    AgeDetection.title = "Age Gender Detection";
    AgeDetection.desc = "Given a face bounding box, it determines the age of a person";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Age Gender Detection", AgeDetection);
	AgeDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };		

	/* EMOTION DETECTION */
	function EmotionDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    EmotionDetection.title = "Emotion Detection";
    EmotionDetection.desc = "Given a face bounding box, it determines the emotion of a person (neutral, happy, sad, angry, surprise)";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Emotion Detection", EmotionDetection);
	EmotionDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };		

})(this);

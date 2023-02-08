//MuseBox nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

	/* OBJECT DETECTION */
	function ObjectDetection(){
		this.addInput("frame", "frame");
		this.addOutput("object bounding box", "object bounding box");
	}
    ObjectDetection.title = "Object Detection";
    ObjectDetection.desc = "It detects the objects in a scene up to 32×32 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Object Detection", ObjectDetection);
	ObjectDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };
	
	/* OBJECT RECOGNITION */
	function ObjectRecognition(){
		this.addInput("object bounding box", "object bounding box");
		this.addOutput("label", "label");
	}
    ObjectRecognition.title = "Object Recognition";
    ObjectRecognition.desc = "Given a object bounding box, it determines what kind of object is ";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Object Recognition", ObjectRecognition);
	ObjectRecognition.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };

	/* TEXT DETECTION */
	function TextDetection(){
		this.addInput("frame", "frame");
		this.addOutput("text bounding box", "text bounding box");
	}
    TextDetection.title = "Text Detection";
    TextDetection.desc = "It detects where is text in a scene";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Text Detection", TextDetection);
	TextDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };

	/* TEXT TRANSCRIPTION */
	function TextTranscription(){
		this.addInput("text bounding box", "text bounding box");
		this.addOutput("text", "text");
	}
    TextTranscription.title = "Text Transcription (OCR)";
    TextTranscription.desc = "Given a text bounding box, it transcribes the content";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Text Transcription", TextTranscription);
	TextTranscription.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };
	
	
	/* LOGO DETECTION */
	function LogoDetection(){
		this.addInput("frame", "frame");
		this.addOutput("logo bounding box", "logo bounding box");
	}
    LogoDetection.title = "Logo Detection";
    LogoDetection.desc = "It detects the logos in a scene up to 64×64 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Logo Detection", LogoDetection);
	LogoDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };


	/* LOGO RECOGNITION */
	function LogoRecognition(){
		this.addInput("logo bounding box", "logo bounding box");
		this.addOutput("label", "label");
	}
    LogoRecognition.title = "Logo Recognition";
    LogoRecognition.desc = "Given a logo bounding box, it determines the brand name";
    LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Logo Recognition", LogoRecognition);
	LogoRecognition.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };	

})(this);

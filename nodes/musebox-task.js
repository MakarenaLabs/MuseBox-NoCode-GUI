//MuseBox nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

	/* PERSON DETECTION */
	function PersonDetection(){
		this.addInput("frame", "frame");		
		this.addInput("object bounding box", "object bounding box");
		this.addOutput("person bounding box", "person bounding box");
        this.addProperty("weight", 1.0);
	}
    PersonDetection.title = "Person Detection";
    PersonDetection.desc = "Detect person in a scene or crop";
    LiteGraph.registerNodeType("MuseBox Tasks/PersonDetection", PersonDetection);
	PersonDetection.prototype.onExecute = function() {
    };
	
	/* FACE DETECTION */
	function FaceDetection(){
		this.addInput("frame", "frame");		
		this.addInput("person bounding box", "person bounding box");
		this.addOutput("face bounding box", "face bounding box");
        this.addProperty("weight", 1.0);
	}
    FaceDetection.title = "Face Detection";
    FaceDetection.desc = "Detect faces on a person crop";
    LiteGraph.registerNodeType("MuseBox Tasks/FaceDetection", FaceDetection);
	FaceDetection.prototype.onExecute = function() {
    };	
	
	/* FACE RECOGNITION */
	function FaceRecognition(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
        this.addProperty("weight", 1.0);
	}
    FaceRecognition.title = "Face Recognition";
    FaceRecognition.desc = "Recognize a face on a face crop";
    LiteGraph.registerNodeType("MuseBox Tasks/FaceRecognition", FaceRecognition);
	FaceRecognition.prototype.onExecute = function() {
    };		
	

})(this);

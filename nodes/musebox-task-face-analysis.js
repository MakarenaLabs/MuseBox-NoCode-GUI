//MuseBox nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

	/* FACE DETECTION */
	function FaceDetection(){
		this.addInput("frame", "frame");		
		this.addInput("person bounding box", "person bounding box");
		this.addOutput("face bounding box", "face bounding box");
	}
    FaceDetection.title = "Face Detection";
    FaceDetection.desc = "It detects the faces in a scene up to 32×32 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Detection", FaceDetection);
	FaceDetection.prototype.onExecute = function() {
    };	

	/* FACE LANDMARKING */
	function FaceLandmarking(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("98 face points", "98 face points");
	}
    FaceLandmarking.title = "Face Landmarking";
    FaceLandmarking.desc = "Given a face bounding box, it extracts the 98 relevant points of a face ";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Landmarking", FaceLandmarking);
	FaceLandmarking.prototype.onExecute = function() {
    };	
	
	/* FACE RECOGNITION */
	function FaceRecognition(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    FaceRecognition.title = "Face Recognition";
    FaceRecognition.desc = "Given a face bounding box and a database of faces, it recognizes a face in a scene";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Recognition", FaceRecognition);
	FaceRecognition.prototype.onExecute = function() {
    };		

	/* GLASSES DETECTION */
	function GlassesDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    GlassesDetection.title = "Glasses Detection";
    GlassesDetection.desc = "Given a face bounding box, it detects whether a person wear glasses or not";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Glasses Detection", GlassesDetection);
	GlassesDetection.prototype.onExecute = function() {
    };		

	/* MASK DETECTION */
	function MaskDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    MaskDetection.title = "Mask Detection";
    MaskDetection.desc = "Given a face bounding box, it detects whether a person wear a mask or not";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Mask Detection", MaskDetection);
	MaskDetection.prototype.onExecute = function() {
    };		
	
	/* GENDER DETECTION */
	function GenderDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    GenderDetection.title = "Gender Detection";
    GenderDetection.desc = "Given a face bounding box, it determines if the person is female or male";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Gender Detection", GenderDetection);
	GenderDetection.prototype.onExecute = function() {
    };		

	/* EYES DETECTION */
	function EyesDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("eyes bounding box", "eyes bounding box");
	}
    EyesDetection.title = "Eyes Detection";
    EyesDetection.desc = "Given a face bounding box, it determines where are the eyes";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Eyes Detection", EyesDetection);
	EyesDetection.prototype.onExecute = function() {
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
    };		

	/* AGE DETECTION */
	function AgeDetection(){
		this.addInput("face bounding box", "face bounding box");
		this.addOutput("label", "label");
	}
    AgeDetection.title = "Age Detection";
    AgeDetection.desc = "Given a face bounding box, it determines the age of a person";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Age Detection", AgeDetection);
	AgeDetection.prototype.onExecute = function() {
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
    };		

})(this);

//MuseBox nodes

var faceDetectionOP = {
	sem: true,
	frame: null,
	initListener: false
}
var faceLandmarkOP = {
	sem: 0,
	frame: 0,
	bbs: [],
	initListener: false,
	tempCanvas: null
};

(function(global) {
    var LiteGraph = global.LiteGraph;

	/* FACE DETECTION */
	function FaceDetection(){
		this.addInput("frame", "frame");		
		this.addInput("person bounding box", "person bounding box");
		this.addOutput("face bounding box", "face bounding box");
		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
	}
    FaceDetection.title = "Face Detection";
    FaceDetection.desc = "It detects the faces in a scene up to 32x32 pixel";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Detection", FaceDetection);
	FaceDetection.prototype.onExecute = function() {

		if(faceDetectionOP.sem){
			var frame = this.getInputData(0);
			if(frame && frame.width && frame.height){
				faceDetectionOP.sem = false;
				faceDetectionOP.frame = frame;
				/* musebox communication */
				sendImage("FaceDetection", frame);
				console.log("sent FaceDetection");
			}
			if(!faceDetectionOP.initListener){
				faceDetectionOP.initListener = true; 
				responseFromMuseBox.addListener("FaceDetection", (value) => {
					console.log(value);

					/* draw */
					var canvas = frame2Canvas(faceDetectionOP.frame);
					var context = canvas.getContext('2d');
					for(var i = 0; i < value.data.length; ++i){
						draw_bb(value.data[i].face_BB, context);
					}
					this.setOutputData(0, value);
					this.setOutputData(1, canvas);
					this.setOutputData(2, JSON.stringify(value));
					faceDetectionOP.sem = true;
				})
			}
		}

	};	

	/* FACE LANDMARKING */
	function FaceLandmarking(){
		this.addInput("face bounding box", "face bounding box");
		this.addInput("prev processing", "image");
		this.addOutput("98 face points", "98 face points");
		this.addOutput("post processing", "image");
		this.addOutput("crop 1", "image");
		this.addOutput("crop 2", "image");
		this.addOutput("crop 3", "image");
		this.addOutput("logs", "logs");
	}
    FaceLandmarking.title = "Face Landmarking";
    FaceLandmarking.desc = "Given a face bounding box, it extracts the 98 relevant points of a face ";
    LiteGraph.registerNodeType("MuseBox Tasks/Face Analysis/Face Landmarking", FaceLandmarking);
	FaceLandmarking.prototype.onExecute = function() {

		/* musebox communication */
		if(faceLandmarkOP.sem == 0){
			var BBs = this.getInputData(0);
			var frame = this.getInputData(1);
			if(BBs && frame && frame.width && frame.height){
				faceLandmarkOP.frame = frame;
				/* musebox communication */
				for(var i = 0; i < BBs.data.length; ++i){
					/* crop face, then send */
					var bb = BBs.data[i].face_BB;
					var face = cropCanvas(frame, bb.x, bb.y, bb.width, bb.height);
					this.setOutputData(2 + i, face);
					sendImage("FaceLandmark", face);
					faceLandmarkOP.bbs.push(bb);
					faceLandmarkOP.sem++;
					console.log("sent FaceLandmark");
				}
			}

			if(!faceLandmarkOP.initListener){
				faceLandmarkOP.initListener = true; 
				responseFromMuseBox.addListener("FaceLandmark", (value) => {
					console.log(value);
					if(faceLandmarkOP.tempCanvas == null){
						faceLandmarkOP.tempCanvas = frame2Canvas(faceLandmarkOP.frame);
					}
					var canvas = faceLandmarkOP.tempCanvas;
					var context = canvas.getContext('2d');

					/* draw */
					var faceBB = faceLandmarkOP.bbs.shift();
					var width = faceBB.width;
					var height = faceBB.height;
					var lm_point = value.landmarks;
		
					for (var j = 0; j < 196; j += 2) {
						console.log(lm_point[j] * (width/80) + faceBB.x, lm_point[j+1] * (height/80) + faceBB.y);
						point(lm_point[j] * (width/80) + faceBB.x, lm_point[j+1] * (height/80) + faceBB.y, context);
					}

					this.setOutputData(0, value.landmarks);
					this.setOutputData(2, JSON.stringify(value));
					faceLandmarkOP.tempCanvas = canvas;
			
					if(faceLandmarkOP.sem == 1){
						this.setOutputData(1, canvas);
						faceLandmarkOP.tempCanvas = null;
					}
					faceLandmarkOP.sem--;
				})
			}
		}

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

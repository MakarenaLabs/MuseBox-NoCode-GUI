var medicalSegmentationOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function (global) {
	var LiteGraph = global.LiteGraph;

	function MedicalSegmentation() {
		this.addInput("frame", "frame");

		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
		this.size = [180, 60];
	}
	MedicalSegmentation.title = "Medical Segmentation";
	MedicalSegmentation.desc = "Given an endoscopic image, it segments anything suspicious in it.";
	LiteGraph.registerNodeType("MuseBox Tasks/Medical Analysis/Medical Segmentation", MedicalSegmentation);
	MedicalSegmentation.prototype.onExecute = function () {
		if (medicalSegmentationOP.sem) {
			var frame = this.getInputData(0);
			if (frame && frame.width && frame.height) {
				medicalSegmentationOP.sem = false;
				medicalSegmentationOP.frame = frame;
				sendImage("MedicalSegmentation", frame);
			}
			if (!medicalSegmentationOP.initListener) {
				medicalSegmentationOP.initListener = true;
				responseFromMuseBox.addListener("MedicalSegmentation", (value) => {
					/* draw */
					var canvas = frame2Canvas(medicalSegmentationOP.frame);
					var context = canvas.getContext('2d');
					for (var i = 0; i < value.data.length; ++i) {
						draw_text(value.data.label, value.data[i].contour[0], context);
						for (var j = 1; j < value.data[i].contour.length; j++) {
							point((value.data[i].contour[j][1].x * (frame.width/320)), 
							value.data[i].contour[j][1].y * (frame.height/320), context, 10, "rgb(255,0,0)", value.data[i].contour[j-1][1]);
						}
					}
					this.setOutputData(0, canvas);
					this.setOutputData(1, JSON.stringify(value));
					medicalSegmentationOP.sem = true;
				})
			}
		}

	};

})(this);
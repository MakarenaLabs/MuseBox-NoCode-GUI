//MuseBox nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

	/* MEDICAL SEGMENTATION */
	function MedicalSegmentation(){
		this.addInput("frame", "frame");		
		this.addOutput("label", "label");
	}
    MedicalSegmentation.title = "Medical Segmentation";
    MedicalSegmentation.desc = "It supports the segmentation of various organs and small parts";
    LiteGraph.registerNodeType("MuseBox Tasks/Medical analysis/Medical segmentation", MedicalSegmentation);
	MedicalSegmentation.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };


})(this);

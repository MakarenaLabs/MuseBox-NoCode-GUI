//MuseBox nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

	/* PERSON DETECTION */
	function PersonDetection(){
		this.addInput("frame", "frame");		
		this.addInput("object bounding box", "object bounding box");
		this.addOutput("person bounding box", "person bounding box");
	}
    PersonDetection.title = "Person Detection";
    PersonDetection.desc = "Detect person in a scene or crop";
    LiteGraph.registerNodeType("MuseBox Tasks/People analysis/Person Detection", PersonDetection);
	PersonDetection.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };

	/* PERSON ReID */
	function PersonReID(){
		this.addInput("frame", "frame");		
		this.addInput("object bounding box", "object bounding box");
		this.addOutput("person bounding box", "person bounding box");
	}
    PersonReID.title = "Person ReID";
    PersonReID.desc = "Given a person bounding box, identify the person in different frames";
    LiteGraph.registerNodeType("MuseBox Tasks/People analysis/Person ReID", PersonReID);
	PersonReID.prototype.onExecute = function() {
		alert("NOT IMPLEMENTED!");
    };
	

})(this);

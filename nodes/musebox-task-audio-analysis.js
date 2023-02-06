//MuseBox nodes
(function(global) {
    var LiteGraph = global.LiteGraph;

	/* AUDIO CLUSTERING */
	function AudioClustering(){
		this.addInput("audio", "audio");		
		this.addOutput("label", "label");
	}
    AudioClustering.title = "Audio Clustering";
    AudioClustering.desc = "It recognizes an audio in a stream from a given database";
    LiteGraph.registerNodeType("MuseBox Tasks/Audio analysis/Audio Clustering", AudioClustering);
	AudioClustering.prototype.onExecute = function() {
    };

	/* AUDIO FILTERING */
	function AudioFiltering(){
		this.addInput("audio", "audio");		
		this.addOutput("audio", "audio");
	}
    AudioFiltering.title = "Audio Clustering";
    AudioFiltering.desc = "It filters audio removing noise or background / foreground signals";
    LiteGraph.registerNodeType("MuseBox Tasks/Audio analysis/Audio Filtering", AudioFiltering);
	AudioFiltering.prototype.onExecute = function() {
    };

	/* AUDIO SCENE CLASSIFICATION */
	function AudioSceneClassification(){
		this.addInput("audio", "audio");		
		this.addOutput("label", "label");
	}
    AudioSceneClassification.title = "Audio Scene Classification";
    AudioSceneClassification.desc = "It classifies what a potential set could be for a given audio";
    LiteGraph.registerNodeType("MuseBox Tasks/Audio analysis/Audio Scene Classification", AudioSceneClassification);
	AudioSceneClassification.prototype.onExecute = function() {
    };

	/* AUDIO Segmentation */
	function AudioSegmentation(){
		this.addInput("audio", "audio");		
		this.addOutput("label", "label");
	}
    AudioSegmentation.title = "Audio Segmentation";
    AudioSegmentation.desc = "It segments different audios that compose a stream";
    LiteGraph.registerNodeType("MuseBox Tasks/Audio analysis/Audio Segmentation", AudioSegmentation);
	AudioSegmentation.prototype.onExecute = function() {
    };	

})(this);

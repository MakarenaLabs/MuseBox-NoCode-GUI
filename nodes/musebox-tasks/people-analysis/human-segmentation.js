var humanSegmentationOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function (global) {
	var LiteGraph = global.LiteGraph;

	function HumanSegmentation() {
		this.addInput("frame", "frame");

		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
		this.size = [180, 60];
	}
	HumanSegmentation.title = "Human Segmentation";
	HumanSegmentation.desc = "Given an image in input, it segments the people present in a scene";
	LiteGraph.registerNodeType("MuseBox Tasks/People Analysis/Human Segmentation", HumanSegmentation);
	HumanSegmentation.prototype.onExecute = function () {
		if (humanSegmentationOP.sem) {
			var frame = this.getInputData(0);
			if (frame && frame.width && frame.height) {
				humanSegmentationOP.sem = false;
				humanSegmentationOP.frame = frame;
				sendImage("HumanSegmentation", frame);
			}
			if (!humanSegmentationOP.initListener) {
				humanSegmentationOP.initListener = true;
				responseFromMuseBox.addListener("HumanSegmentation", (value) => {
					/* draw */
					let array = value.data.prediction.slice(0, -1).split(" ").map(Number);

					let finalArray = new Array(320);
					for (let i = 0; i < 320; i++) {
						finalArray[i] = new Array(320);
					}
					for (let i = 0; i < 320; i++) {
						for (let j = 0; j < 320; j++) {
							finalArray[319 - i][j] = array[i * 320 + j] / 255.;
						}
					}
					let humanSegmentation = document.createElement("div");
					// monodepth.style.display = "none";
					humanSegmentation.id = "humanSegmentation";
					const main = document.getElementById("main");
					document.body.insertBefore(humanSegmentation, main);

					let data = [{
						z: finalArray,
						zsmooth: 'best',
						type: 'heatmap',
						showscale: false,
						connectgaps: true,
						colorscale: 'Greys',
					}];

					var layout = {
						title: 'Human Segmentation',
						autosize: false,
						width: 500,
						height: 500
					};

					Plotly.newPlot('humanSegmentation', data, layout).then(() => {
						const svgImage = humanSegmentation.children[0].children[0].children[0];
						let outerHTML = svgImage.outerHTML,
							blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
						let URL = window.URL || window.webkitURL || window;
						let blobURL = URL.createObjectURL(blob);
						let image = new Image();
						image.src = blobURL;
						humanSegmentation.remove();
						this.setOutputData(0, image);
						this.setOutputData(1, JSON.stringify(value));

						humanSegmentationOP.sem = true;

					});
				})
			}
		}

	};

})(this);
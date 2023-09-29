var monocularDepthOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function (global) {
	var LiteGraph = global.LiteGraph;

	function MonocularDepth() {
		this.addInput("frame", "frame");

		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
	}
	MonocularDepth.title = "Monocular Depth";
	MonocularDepth.desc = "Given an image in input, it returns its depth estimation";
	LiteGraph.registerNodeType("MuseBox Tasks/Object Analysis/Monocular Depth", MonocularDepth);
	MonocularDepth.prototype.onExecute = function () {
		if (monocularDepthOP.sem) {
			var frame = this.getInputData(0);
			if (frame && frame.width && frame.height) {
				monocularDepthOP.sem = false;
				monocularDepthOP.frame = frame;
				sendImage("MonoDepth", frame);
			}
			if (!monocularDepthOP.initListener) {
				monocularDepthOP.initListener = true;
				responseFromMuseBox.addListener("MonoDepth", (value) => {
					/* draw */
					let array = value.data.prediction.slice(0, -1).split(" ").map(Number);

					let finalArray = new Array(128);
					for (let i = 0; i < 128; i++) {
						finalArray[i] = new Array(128);
					}
					for (let i = 0; i < 128; i++) {
						for (let j = 0; j < 128; j++) {
							finalArray[127 - i][j] = array[i * 128 + j];
						}
					}
					let monodepth = document.createElement("div");
					// monodepth.style.display = "none";
					monodepth.id = "monodepth";
					const main = document.getElementById("main");
					document.body.insertBefore(monodepth, main);

					let data = [{
						z: finalArray,
						zsmooth: 'best',
						type: 'heatmap',
						showscale: false,
						connectgaps: true,
						colorscale: [
							['0.0', 'rgb(165,0,38)'],
							['0.111111111111', 'rgb(215,48,39)'],
							['0.222222222222', 'rgb(244,109,67)'],
							['0.333333333333', 'rgb(253,174,97)'],
							['0.444444444444', 'rgb(254,224,144)'],
							['0.555555555556', 'rgb(224,243,248)'],
							['0.666666666667', 'rgb(171,217,233)'],
							['0.777777777778', 'rgb(116,173,209)'],
							['0.888888888889', 'rgb(69,117,180)'],
							['1.0', 'rgb(49,54,149)']]
					}];

					var layout = {
						title: 'Monodepth',
						autosize: false,
						width: 500,
						height: 500
					};

					Plotly.newPlot('monodepth', data, layout).then( () => {
						const svgImage = monodepth.children[0].children[0].children[0];
						let outerHTML = svgImage.outerHTML,
							blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
						let URL = window.URL || window.webkitURL || window;
						let blobURL = URL.createObjectURL(blob);
						let image = new Image();
						image.src = blobURL;
						monodepth.remove();
						this.setOutputData(0, image);
						this.setOutputData(1, JSON.stringify(value));

						monocularDepthOP.sem = true;

					});
				})
			}
		}

	};

})(this);
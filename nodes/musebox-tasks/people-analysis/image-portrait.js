var imagePortraitOP = {
	sem: true,
	frame: null,
	initListener: false
};

(function (global) {
	var LiteGraph = global.LiteGraph;

	function ImagePortrait() {
		this.addInput("frame", "frame");

		this.addOutput("post process", "image");
		this.addOutput("logs", "logs");
		this.size = [180, 60];
	}
	ImagePortrait.title = "Image Portrait";
	ImagePortrait.desc = "It draws a black and white portrait of the people in the image.";
	LiteGraph.registerNodeType("MuseBox Tasks/People Analysis/Image Portrait", ImagePortrait);
	ImagePortrait.prototype.onExecute = function () {
		if (imagePortraitOP.sem) {
			var frame = this.getInputData(0);
			if (frame && frame.width && frame.height) {
				imagePortraitOP.sem = false;
				imagePortraitOP.frame = frame;
				sendImage("ImagePortrait", frame);
			}
			if (!imagePortraitOP.initListener) {
				imagePortraitOP.initListener = true;
				responseFromMuseBox.addListener("ImagePortrait", (value) => {
					/* draw */
					let array = value.image.slice(0, -1).split(" ").map(Number);

					let finalArray = new Array(512);
					for (let i = 0; i < 512; i++) {
						finalArray[i] = new Array(512);
					}
					for (let i = 0; i < 512; i++) {
						for (let j = 0; j < 512; j++) {
							finalArray[511 - i][j] = 1.0 - (array[i * 512 + j] / 255.);
						}
					}
					let imagePortrait = document.createElement("div");
					// monodepth.style.display = "none";
					imagePortrait.id = "imagePortrait";
					const main = document.getElementById("main");
					document.body.insertBefore(imagePortrait, main);

					let data = [{
						z: finalArray,
						zsmooth: 'best',
						type: 'heatmap',
						showscale: false,
						connectgaps: true,
						colorscale: 'Greys',
					}];

					var layout = {
						title: 'Image Portrait',
						autosize: false,
						width: 500,
						height: 500
					};

					Plotly.newPlot('imagePortrait', data, layout).then(() => {
						const svgImage = imagePortrait.children[0].children[0].children[0];
						let outerHTML = svgImage.outerHTML,
							blob = new Blob([outerHTML], { type: 'image/svg+xml;charset=utf-8' });
						let URL = window.URL || window.webkitURL || window;
						let blobURL = URL.createObjectURL(blob);
						let image = new Image();
						image.src = blobURL;
						imagePortrait.remove();
						this.setOutputData(0, image);
						this.setOutputData(1, JSON.stringify(value));

						imagePortraitOP.sem = true;

					});
				})
			}
		}

	};

})(this);
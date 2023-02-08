//MuseBox input
(function(global) {
    var LiteGraph = global.LiteGraph;

    /*********************** */
	/* IMAGE                 */
    /*********************** */
	function Image(){
		this.addOutput("image", "frame");
        this.addProperty("local path", "");
        this.widget = this.addWidget("text", "local path", "", "local path");
        this.widgets_up = true;
	}
    Image.color = "#4337ff";
    Image.title = "Image";
    Image.desc = "Image file on local path";

    Image.prototype.onConfigure = function(o) {
        this.widget.value = o.properties['local path'];
    };
	Image.prototype.onExecute = function() {
    };
    LiteGraph.registerNodeType("MuseBox Input/Image", Image);

    /*********************** */
	/* VIDEO                 */
    /*********************** */
	function Video(){
		this.addOutput("frames", "frame");
        this.addProperty("local path", "");
        this.widget = this.addWidget("text", "local path", "", "local path");
        this.widgets_up = true;
	}
    Video.color = "#0066bd";
    Video.title = "Video";
    Video.desc = "Video file on local path";

    Video.prototype.onConfigure = function(o) {
        this.widget.value = o.properties['local path'];
    };
	Video.prototype.onExecute = function() {
    };
    LiteGraph.registerNodeType("MuseBox Input/Video", Video);

    /*********************** */
	/* AUDIO                 */
    /*********************** */
	function Audio(){
		this.addOutput("audio", "audio");
        this.addProperty("local path", "");
        this.widget = this.addWidget("text", "local path", "", "local path");
        this.widgets_up = true;
	}
    Audio.color = "#0066bd";
    Audio.title = "Audio";
    Audio.desc = "Audio file on local path";

    Audio.prototype.onConfigure = function(o) {
        this.widget.value = o.properties['local path'];
    };
	Audio.prototype.onExecute = function() {
    };
    LiteGraph.registerNodeType("MuseBox Input/Audio", Audio);

    /*********************** */
	/* VIDEO STREAM          */
    /*********************** */
	function VideoStream(){
		this.addOutput("frames", "frame");
        this.addProperty("url source", "");
        this.widget = this.addWidget("text", "url source", "", "url source");
        this.widgets_up = true;
	}
    VideoStream.color = "#009abd";
    VideoStream.title = "Video Stream";
    VideoStream.desc = "Video from external stream";

    VideoStream.prototype.onConfigure = function(o) {
        this.widget.value = o.properties['url source'];
    };
	VideoStream.prototype.onExecute = function() {
    };
    LiteGraph.registerNodeType("MuseBox Input/Video Stream", VideoStream);    

    /*********************** */
	/* AUDIO STREAM          */
    /*********************** */
	function AudioStream(){
		this.addOutput("audio", "audio");
        this.addProperty("url source", "");
        this.widget = this.addWidget("text", "url source", "", "url source");
        this.widgets_up = true;
	}
    AudioStream.color = "#009abd";
    AudioStream.title = "Audio Stream";
    AudioStream.desc = "Audio from external stream";

    AudioStream.prototype.onConfigure = function(o) {
        this.widget.value = o.properties['url source'];
    };
	AudioStream.prototype.onExecute = function() {
    };
    LiteGraph.registerNodeType("MuseBox Input/Audio Stream", AudioStream);    


    /*********************** */
	/* WEBCAM                */
    /*********************** */
    function ImageWebcam() {
        this.addOutput("Webcam", ["image", "frame"]);
        this.properties = { filterFacingMode: false, facingMode: "user", delay: 30 };
        this.boxcolor = "black";
        this.frame = 0;
    }

    ImageWebcam.title = "Webcam";
    ImageWebcam.desc = "Webcam image";
    ImageWebcam.is_webcam_open = false;

    ImageWebcam.prototype.openStream = function() {
        if (!navigator.mediaDevices.getUserMedia) {
            console.log('getUserMedia() is not supported in your browser, use chrome and enable WebRTC from about://flags');
            return;
        }

        this._waiting_confirmation = true;

        // Not showing vendor prefixes.
        var constraints = {
            audio: false,
            video: !this.properties.filterFacingMode ? true : { facingMode: this.properties.facingMode }
        };
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(this.streamReady.bind(this))
            .catch(onFailSoHard);

        var that = this;
        function onFailSoHard(e) {
            console.log("Webcam rejected", e);
            that._webcam_stream = false;
            ImageWebcam.is_webcam_open = false;
            that.boxcolor = "red";
            that.trigger("stream_error");
        }
    };

    ImageWebcam.prototype.closeStream = function() {
        if (this._webcam_stream) {
            var tracks = this._webcam_stream.getTracks();
            if (tracks.length) {
                for (var i = 0; i < tracks.length; ++i) {
                    tracks[i].stop();
                }
            }
            ImageWebcam.is_webcam_open = false;
            this._webcam_stream = null;
            this._video = null;
            this.boxcolor = "black";
            this.trigger("stream_closed");
        }
    };

    ImageWebcam.prototype.onPropertyChanged = function(name, value) {
        if (name == "facingMode") {
            this.properties.facingMode = value;
            this.closeStream();
            this.openStream();
        }
    };

    ImageWebcam.prototype.onRemoved = function() {
        this.closeStream();
    };

    ImageWebcam.prototype.streamReady = function(localMediaStream) {
        this._webcam_stream = localMediaStream;
        //this._waiting_confirmation = false;
        this.boxcolor = "green";

        var video = this._video;
        if (!video) {
            video = document.createElement("video");
            video.autoplay = true;
            video.srcObject = localMediaStream;
            this._video = video;
            //document.body.appendChild( video ); //debug
            //when video info is loaded (size and so)
            video.onloadedmetadata = function(e) {
                // Ready to go. Do some stuff.
                console.log(e);
                ImageWebcam.is_webcam_open = true;
            };
        }

        this.trigger("stream_ready", video);
    };

    ImageWebcam.prototype.onExecute = function() {
        if (this._webcam_stream == null && !this._waiting_confirmation) {
            this.openStream();
        }

        if (!this._video || !this._video.videoWidth) {
            return;
        }

        this._video.frame = ++this.frame;
        this._video.width = this._video.videoWidth;
        this._video.height = this._video.videoHeight;
        this.setOutputData(0, this._video);
        for (var i = 1; i < this.outputs.length; ++i) {
            if (!this.outputs[i]) {
                continue;
            }
            switch (this.outputs[i].name) {
                case "width":
                    this.setOutputData(i, this._video.videoWidth);
                    break;
                case "height":
                    this.setOutputData(i, this._video.videoHeight);
                    break;
            }
        }
};

    ImageWebcam.prototype.getExtraMenuOptions = function(graphcanvas) {
        var that = this;
        var txt = !that.properties.show ? "Show Frame" : "Hide Frame";
        return [
            {
                content: txt,
                callback: function() {
                    that.properties.show = !that.properties.show;
                }
            }
        ];
    };

    ImageWebcam.prototype.onDrawBackground = function(ctx) {
        if (
            this.flags.collapsed ||
            this.size[1] <= 20 ||
            !this.properties.show
        ) {
            return;
        }

        if (!this._video) {
            return;
        }

        //render to graph canvas
        ctx.save();
        ctx.drawImage(this._video, 0, 0, this.size[0], this.size[1]);
        ctx.restore();
    };

    ImageWebcam.prototype.onGetOutputs = function() {
        return [
            ["width", "number"],
            ["height", "number"],
            ["stream_ready", LiteGraph.EVENT],
            ["stream_closed", LiteGraph.EVENT],
            ["stream_error", LiteGraph.EVENT]
        ];
    };

    LiteGraph.registerNodeType("MuseBox Input/PC webcam", ImageWebcam);


/******
 * SCALE
 */
function Scale(){
    this.addInput("image in", "frame,canvas,image");
    this.addOutput("image out", "frame,canvas,image");
    this.addProperty("width", "640");
    this.addProperty("height", "480");
}
Scale.title = "Scale";
Scale.desc = "Scale to fixed width and height";

Scale.prototype.onConfigure = function(o) {
};
Scale.prototype.onExecute = function() {
    var frame = this.getInputData(0);
    if(frame){
        var canvas = document.createElement('canvas'),
        ctx = canvas.getContext("2d");
        canvas.width = this.properties.width;
        canvas.height = this.properties.height;
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

        this.setOutputData(0, canvas);
    }
};
LiteGraph.registerNodeType("MuseBox Operators/Scale", Scale);



})(this);

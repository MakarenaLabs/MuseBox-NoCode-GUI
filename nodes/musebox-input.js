//MuseBox input
(function(global) {
    var LiteGraph = global.LiteGraph;

    /*********************** */
	/* MEDIA STREAM          */
    /*********************** */
	function MediaStream(){
		this.addOutput("frames", ["frame", "image"]);
        this.addProperty("url source", "");
        this.widget = this.addWidget("text", "url source", "", "url source");
        this.widgets_up = true;
        this.video = null;
        this.source = null;
	}
    MediaStream.color = "#009abd";
    MediaStream.title = "Media Stream";
    MediaStream.desc = "Media stream";

    MediaStream.prototype.onConfigure = function(o) {
        this.widget.value = o.properties['url source'];
    };
	MediaStream.prototype.onExecute = function() {
        //debugger;        
        if(this.video == null){
            this.video = document.createElement("video");
            this.source = document.createElement('source');

            this.source.setAttribute('src', this.properties['url source']);
            this.source.setAttribute('type', 'video/mp4');
            this.source.setAttribute('crossOrigin', '*');
            
            this.video.appendChild(this.source);
            this.video.muted = true;
            this.video.pause();
            this.video.currentTime = 0;
            this.video.load();
            this.video.play();
            console.log({
              src: this.source.getAttribute('src'),
              type: this.source.getAttribute('type'),
            });
            this.video.autoplay = true;
        }
        this.video.crossOrigin = '*';
        this.setOutputData(0, this.video);

        
    };

    MediaStream.prototype.onStop = function(){
        this.video.pause();
        this.video.remove();
        this.video = null;
        this.source.remove();
        this.video = null;
    }

    LiteGraph.registerNodeType("MuseBox Input/Media Stream", MediaStream);    


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


})(this);

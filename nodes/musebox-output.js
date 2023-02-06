//MuseBox input
(function(global) {
    var LiteGraph = global.LiteGraph;

    /*********************** */
	/* IMAGE                 */
    /*********************** */
    function ImageFrame() {
        this.addInput("", "image,canvas");
        this.size = [200, 200];
    }

    ImageFrame.title = "Frame";
    ImageFrame.desc = "Frame viewerew";
    ImageFrame.widgets = [
        { name: "resize", text: "Resize box", type: "button" },
        { name: "view", text: "View Image", type: "button" }
    ];

    ImageFrame.prototype.onDrawBackground = function(ctx) {
        if (this.frame && !this.flags.collapsed) {
            ctx.drawImage(this.frame, 0, 0, this.size[0], this.size[1]);
        }
    };

    ImageFrame.prototype.onExecute = function() {
        this.frame = this.getInputData(0);
        this.setDirtyCanvas(true);
    };

    ImageFrame.prototype.onWidget = function(e, widget) {
        if (widget.name == "resize" && this.frame) {
            var width = this.frame.width;
            var height = this.frame.height;

            if (!width && this.frame.videoWidth != null) {
                width = this.frame.videoWidth;
                height = this.frame.videoHeight;
            }

            if (width && height) {
                this.size = [width, height];
            }
            this.setDirtyCanvas(true, true);
        } else if (widget.name == "view") {
            this.show();
        }
    };

    ImageFrame.prototype.show = function() {
        //var str = this.canvas.toDataURL("image/png");
        if (showElement && this.frame) {
            showElement(this.frame);
        }
    };

    LiteGraph.registerNodeType("graphics/frame", ImageFrame);


})(this);

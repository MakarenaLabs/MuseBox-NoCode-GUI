var loadingObj = {};
var loadingProxy = new Proxy(loadingObj, {
    set: function (target, key, value) {
        if (typeof setLoader !== "undefined") {
            setLoader(value);
        }
    }
});


var newJsonObj = {};
var newJsonObjProxy = new Proxy(newJsonObj, {
    set: function (target, key, value) {
        if (typeof newJson !== "undefined") {
            newJson(value);
        }
    }
});

function frame2Canvas(frame) {
    var canvas = document.createElement("canvas")
    var context = canvas.getContext('2d');
    canvas.width = frame.width;
    canvas.height = frame.height;
    context.drawImage(frame, 0, 0, frame.width, frame.height);
    return canvas;
}

function cloneCanvas(oldCanvas) {
    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}

function point(x, y, canvas, lineWidth = 5, strokeStyle = "lightgreen", point2 = {x: x+1, y: y+1}) {
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(point2.x, point2.y);
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = strokeStyle;
    canvas.stroke();
}

function draw_bb(bb, context) {
    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 3;
    context.rect(bb.x, bb.y, bb.width, bb.height);
    context.stroke();
}

function draw_text(text, bb, context) {
    context.font = "15px Arial";
    context.fillStyle = "lightgreen";
    context.fillText(text, bb.x, bb.y - 5);
}

const cropCanvas = (sourceCanvas, left, top, width, height) => {
    let destCanvas = document.createElement('canvas');
    destCanvas.width = width;
    destCanvas.height = height;
    destCanvas.getContext("2d").drawImage(
        sourceCanvas,
        left, top, width, height,  // source rect with content to crop
        0, 0, width, height);      // newCanvas, same size as source rect
    return destCanvas;
}


jQuery(document).ready(function ($) {
    console.log('Loaded webpage.js')

    let utils = new Utils('errorMessage');

    utils.loadOpenCv(() => {
        console.log("loaded!");
    });

    function Utils(errorOutputId) { // eslint-disable-line no-unused-vars
        let self = this;
        this.errorOutput = document.getElementById(errorOutputId);

        const OPENCV_URL = 'https://docs.opencv.org/3.4/opencv.js';
        // OpenCV loading
        loadingProxy.is_loading = true;

        this.loadOpenCv = function (onloadCallback) {
            let script = document.createElement('script');
            script.setAttribute('async', '');
            script.setAttribute('type', 'text/javascript');
            script.addEventListener('load', () => {
                console.log("cv ready!");
                loadingProxy.is_loading = false;
                //$("#cv2-loader-blocker").hide();
                onloadCallback();
            });
            script.addEventListener('error', () => {
                self.printError('Failed to load ' + OPENCV_URL);
            });
            script.src = OPENCV_URL;
            let node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(script, node);
        };

        this.createFileFromUrl = function (path, url, callback) {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function (ev) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        let data = new Uint8Array(request.response);
                        cv.FS_createDataFile('/', path, data, true, false, false);
                        callback();
                    } else {
                        self.printError('Failed to load ' + url + ' status: ' + request.status);
                    }
                }
            };
            request.send();
        };

        this.loadImageToCanvas = function (url, cavansId) {
            let canvas = document.getElementById(cavansId);
            let ctx = canvas.getContext('2d');
            let img = new Image();
            img.crossOrigin = 'anonymous';
            img.setAttribute('crossorigin', 'anonymous');
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
            };
            img.src = url;
        };

        this.executeCode = function (textAreaId) {
            try {
                this.clearError();
                let code = document.getElementById(textAreaId).value;
                eval(code);
            } catch (err) {
                this.printError(err);
            }
        };

        this.clearError = function () {
            this.errorOutput.innerHTML = '';
        };

        this.printError = function (err) {
            if (typeof err === 'undefined') {
                err = '';
            } else if (typeof err === 'number') {
                if (!isNaN(err)) {
                    if (typeof cv !== 'undefined') {
                        err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
                    }
                }
            } else if (typeof err === 'string') {
                let ptr = Number(err.split(' ')[0]);
                if (!isNaN(ptr)) {
                    if (typeof cv !== 'undefined') {
                        err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
                    }
                }
            } else if (err instanceof Error) {
                err = err.stack.replace(/\n/g, '<br>');
            }
            this.errorOutput.innerHTML = err;
        };

        this.loadCode = function (scriptId, textAreaId) {
            let scriptNode = document.getElementById(scriptId);
            let textArea = document.getElementById(textAreaId);
            if (scriptNode.type !== 'text/code-snippet') {
                throw Error('Unknown code snippet type');
            }
            textArea.value = scriptNode.text.replace(/^\n/, '');
        };

        this.addFileInputHandler = function (fileInputId, canvasId) {
            let inputElement = document.getElementById(fileInputId);
            inputElement.addEventListener('change', (e) => {
                let files = e.target.files;
                if (files.length > 0) {
                    let imgUrl = URL.createObjectURL(files[0]);
                    self.loadImageToCanvas(imgUrl, canvasId);
                }
            }, false);
        };

        function onVideoCanPlay() {
            if (self.onCameraStartedCallback) {
                self.onCameraStartedCallback(self.stream, self.video);
            }
        };

        this.startCamera = function (resolution, callback, videoId) {
            const constraints = {
                'qvga': { width: { exact: 320 }, height: { exact: 240 } },
                'vga': { width: { exact: 640 }, height: { exact: 480 } },
                'hd': { width: { exact: 640 }, height: { exact: 320 } }
            };
            let video = document.getElementById(videoId);
            if (!video) {
                video = document.createElement('video');
            }

            let videoConstraint = constraints[resolution];
            if (!videoConstraint) {
                videoConstraint = true;
            }

            navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: false })
                .then(function (stream) {
                    video.srcObject = stream;
                    video.play();
                    self.video = video;
                    self.stream = stream;
                    self.onCameraStartedCallback = callback;
                    video.addEventListener('canplay', onVideoCanPlay, false);
                })
                .catch(function (err) {
                    startAndStop.pause();
                    alert('Open webcam');
                    self.printError('Camera Error: ' + err.name + ' ' + err.message);
                    startAndStop.currentTime = 0;
                    startAndStop.load();
                });
        };

        this.stopCamera = function () {
            if (this.video) {
                this.video.pause();
                this.video.srcObject = null;
                this.video.removeEventListener('canplay', onVideoCanPlay);
            }
            if (this.stream) {
                this.stream.getVideoTracks()[0].stop();
            }
        };
    };

});
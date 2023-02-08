responseFromMuseBox = null;

function sendImage(task, _image) {
	
	var canvas = frame2Canvas(_image);

	//let src = new cv.Mat(375, 500, cv.CV_8UC4);
	//let dst = new cv.Mat(375, 500, cv.CV_8UC1);
	//let cap = new cv.VideoCapture(video);
	//cap.read(src);
	/*
	let src = cv.imread(canvas);
	let dst = new cv.Mat(_image.height, _image.width, cv.CV_8UC1);
	delete canvas;
*/
	//let dsize = new cv.Size(500, 375);
	//cv.resize(src, src, dsize, 0, 0, cv.INTER_AREA);		
/*	cv.cvtColor(src, dst, cv.COLOR_RGBA2BGR);
	imageToSend = dst.clone();
	imageToSend_copy = imageToSend.clone();
	*/
	let image = canvas.toDataURL("image/png");
	image = image.substring(22);
	delete canvas;
	/*
	let dst_2 = new cv.Mat();
	let men = new cv.Mat();
	let menO = new cv.Mat();
	cv.cvtColor(imageToSend_copy, imageToSend_copy, cv.COLOR_RGB2GRAY, 0);
	// You can try more different parameters
	var t = cv.Laplacian(imageToSend_copy, dst_2, cv.CV_64F, 1, 1, 0, cv.BORDER_DEFAULT);
	cv.meanStdDev(dst_2, menO, men);
	*/
	var messageToSend = {
		"topic": task,
		"clientId": clientID,
		"publisherQueue": "tcp://*:5000",
		'username': username,
		"image": image,
		"imageWidth": image.width,
		"imageHeight": image.height,
		"key":musebox_key,
		"directory": siteName,
		"board": board
	}
	var compressed = LZString.compress(JSON.stringify(messageToSend));
	//console.log(messageToSend);
	//console.log(compressed.length);
	start = new Date();
	socket.emit('request', compressed);
}

jQuery(document).ready(($) => {

	responseFromMuseBox = new EventEmitter3();
	var frame;

    var canvas = null;
    //var photo = null;
    var startbutton = null;

	//canvas = document.getElementById('canvas');
	//photo = document.getElementById('photo');
	
    console.log(clientID, username);

      socket.on('message', data => {
		var end = new Date();
		pipeline_duration = end.getTime() - start.getTime();
        data_json = JSON.parse(data);
		newJsonObjProxy.res = data_json;
        console.log("Received message.");
		//console.log(data_json);
        if (data_json.topic) {
          if(data_json.status == "failed") {
            console.log("Failed to crop face: ", data_json.message);
          }
          else {
            //var context = canvas.getContext('2d');
            image = data_json.data || data_json.image;
            //clearphoto();
            //var imgData = context.createImageData(224, 224); // width x height
            //var data = imgData.data;

			switch(data_json.topic) {
				case "FaceDetection":
					if(image.length == 0){
						//alert("No faces!");
						responseFromMuseBox.emit(data_json.topic, 0);
						return;
					}
					//for (var i = 0; i < data_json.data.length; ++i) {
						//draw_bb(data_json.data[i].face_BB, context);
					//}
					responseFromMuseBox.emit(data_json.topic, data_json);

					break;

				case "FaceLandmark":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						var width = faceBB.width /** 500*/;
						var height = faceBB.height /** 375*/;
						lm_point = data_json.data.FaceLandmark[i].landmarks;

						for (var j = 0; j < 196; j += 2) {
							point(lm_point[j] * (width / 80) + faceBB.x, lm_point[j+1] * (height / 80) + faceBB.y, context);
						}
					}
					break;

				case "GenderDetection":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.GenderDetection[i].gender;
						draw_text(text, faceBB, context);
					}
					break;

				case "EyeBlink":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.EyeBlink[i].eyeState;
						draw_text(text, faceBB, context);
					}
					break;

				case "AgeDetection":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.AgeDetection[i].age;
						draw_text(text, faceBB, context);
					}
					break;

				case "GlassesDetection":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.GlassesDetection[i].glasses;
						draw_text(text, faceBB, context);
					}
					break;

				case "EmotionRecognition":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.EmotionRecognition[i].emotion;
						draw_text(text, faceBB, context);
					}
					break;

				case "FaceRecognition":
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.FaceRecognition[i].personFound;
						draw_text(text, faceBB, context);
					}
					break;
					
			}
			  
          }
        }
      });
	
      socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
      });
});

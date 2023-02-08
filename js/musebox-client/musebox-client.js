responseFromMuseBox = null;

function sendImage(task, _image) {
	
	var canvas = frame2Canvas(_image);

	let image = canvas.toDataURL("image/png");
	image = image.substring(22);
	delete canvas;

	var messageToSend = {
		"topic": task,
		"clientId": clientID,
		'username': username,
		"image": image,
		"imageWidth": image.width,
		"imageHeight": image.height,
		"key":musebox_key,
		"directory": siteName,
		"board": board,
		"only_face": true
	}
	//var compressed = LZString.compress(JSON.stringify(messageToSend));
	start = new Date();
	socket.send(JSON.stringify(messageToSend));
}

jQuery(document).ready(($) => {

	responseFromMuseBox = new EventEmitter3();
    console.log(clientID, username);

      socket.onmessage = (data) => {
		var end = new Date();
		pipeline_duration = end.getTime() - start.getTime();
        data_json = JSON.parse(data.data);
		newJsonObjProxy.res = data_json;
        console.log("Received message.");
		//console.log(data_json);
        if (data_json.topic) {
          if(data_json.status == "failed") {
            console.log("Failed to crop face: ", data_json.message);
          }
          else {
            image = data_json.data || data_json.image;

			/* TODO: REMOVE SWITCH CASE!!! */
			switch(data_json.topic) {
				case "FaceDetection":
					responseFromMuseBox.emit(data_json.topic, data_json);
					break;

				case "FaceLandmark":
					responseFromMuseBox.emit(data_json.topic, data_json);
					break;

				case "FaceRecognition":
					responseFromMuseBox.emit(data_json.topic, data_json);
					break;

				case "GlassesDetection":
					responseFromMuseBox.emit(data_json.topic, data_json);
					break;
					
	
				case "GenderDetection":
					responseFromMuseBox.emit(data_json.topic, data_json);
					break;

				case "EyeBlink":
					/*
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.EyeBlink[i].eyeState;
						draw_text(text, faceBB, context);
					}
					*/
					break;

				case "AgeDetection":
					/*
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.AgeDetection[i].age;
						draw_text(text, faceBB, context);
					}
					*/
					break;

				case "EmotionRecognition":
					/*
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						draw_bb(faceBB, context);
					}
					for (var i = 0; i < (data_json.data.FaceDetection.data.length); ++i) {
						faceBB = data_json.data.FaceDetection.data[i].face_BB;
						text = data_json.data.EmotionRecognition[i].emotion;
						draw_text(text, faceBB, context);
					}
					*/
					break;
					
			}
			  
          }
        }
      };
	
      socket.onerror = (err) => {
        console.log(`connect_error due to ${err.message}`);
      };
});

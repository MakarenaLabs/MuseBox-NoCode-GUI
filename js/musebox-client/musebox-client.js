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
            console.log("Failed to crop: ", data_json.message);
          }
          else {
            image = data_json.data || data_json.image;
			responseFromMuseBox.emit(data_json.topic, data_json);			  
          }
        }
      };
	
      socket.onerror = (err) => {
        console.log(`connect_error due to ${err.message}`);
      };
});

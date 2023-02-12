var clientID = "1";
var username = "";
var siteName = "MuseBox";
var musebox_key = "4kl24jbe89235wetlnb335t";
var musebox_task = "all";
var board = "KV260";
var url = "ws://127.0.0.1:8083";
var socket = new WebSocket(url);


(function(global) {
    var LiteGraph = global.LiteGraph;

function Configuration(){
    this.addProperty("url", "ws://127.0.0.1:8083");
}
Configuration.title = "Configuration";
Configuration.desc = "MuseBox configuration";

Configuration.prototype.onPropertyChanged = function(name, value) {
    console.log(name, value);
    switch(name){
        case "url":
            socket.close();
            socket = new WebSocket(value);
            break;
        default:
            break;
    }
};


LiteGraph.registerNodeType("MuseBox Configuration/configuration", Configuration);

})(this);

// load first configuration
jQuery(document).ready(function($) {

    var first_graph = '{"last_node_id":1,"last_link_id":0,"nodes":[{"id":1,"type":"MuseBox Configuration/configuration","pos":[15,46],"size":{"0":140,"1":26},"flags":{},"order":0,"mode":0,"properties":{"url":"ws://127.0.0.1:8083"},"color":"#2a363b","bgcolor":"#3f5159"}],"links":[],"groups":[],"config":{},"extra":{},"version":0.4}';
    graph.configure(JSON.parse(first_graph));

})
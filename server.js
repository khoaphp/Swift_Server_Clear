var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
var fs = require("fs");
var server = require("http").Server(app);
var io = require("socket.io")(server);
app.io = io;
server.listen(3000);

var bodyParser = require("body-parser");
const e = require("express");
app.use(bodyParser.urlencoded({extended:false}));

io.on("connection", function(socket){
    console.log("New connection: " + socket.id);
});

loadConfigFile("./config.json");

function loadConfigFile(urlFile){
    fs.readFile(urlFile, "utf8", function(err, data){
        if(err){ throw err; }
        var obj = JSON.parse(data);
        
        //connect db
        const mongoose = require('mongoose');
        mongoose.connect('mongodb+srv://'+obj.database.username+':'+obj.database.password+'@'+obj.database.server+'/'+obj.database.dbname+'?retryWrites=true&w=majority', function(err){
            if(err){ throw err; }else{
                console.log("Mongo connected successfully!");
                require("./routes/messenger")(app, obj);
                require("./routes/uploadFile")(app, obj)
            }
        });

    });
}
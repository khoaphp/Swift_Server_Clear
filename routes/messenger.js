module.exports = function(app, obj){
    app.get("/", function(req, res){
        res.send("<h2>Chat Messenger</h2>");
    });
}
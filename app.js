// require modules 
const { response } = require("express");
const express = require("express"); 
const https = require("https");


// new express app
const app = express(); 

// allow express to parse 
app.use(express.urlencoded({extended:true}));

// render static files 
app.use(express.static("public"));


// get routes 
app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html"); 
}); 

app.post("/failure", function(req,res){
    app.redirect("/"); 
}); 
// post requests (our browser is trying to post some data )
// req = browser 
// res = us
app.post("/", function(req, res){

    // the response is what WE are doing 
    var status = res.statusCode; 
    if(status === 200){
        res.sendFile(__dirname + "/success.html"); 
    }else{
        res.sendFile(__dirname + "/failure.html");
    }

    var email = req.body.email; 
    var firstName = req.body.first; 
    var lastName = req.body.last; 

    // turning our data into a JSON 
    var data = {
        // an array 
        members: [
            {
                email_address: email,
                status: "subscribed", 
                merge_fields: {
                    FNAME: firstName,
                    LNAME:lastName
                }
            }
            
        ]
    };

    const jsonData = JSON.stringify(data);

    // make a POST request via mailchimp API to post our data to the servers
    const url = "https://us17.api.mailchimp.com/3.0/lists/6de62a1ea1";
    const options = {
        method: 'POST', 
        auth: 'emily:05d1e6753e65f78b0b98106cf8285807-us17'
    };

    const request = https.request(url, options, function(res){
        // turn the data into a JSON object 
        res.on("data", function(data){
            console.log(JSON.parse(data))
        })
    }); 

    request.write(jsonData); 
    request.end(); 


}); 

// express app is litening to port 3000
app.listen(process.env.PORT || 3000, function(req, res){
    console.log("server running on port 3000"); 
}); 


// 05d1e6753e65f78b0b98106cf8285807-us17

// list id: 6de62a1ea1
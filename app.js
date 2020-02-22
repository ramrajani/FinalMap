const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const express = require('express'),
      app = express(),
      bodyParser  = require('body-parser');
     
var port  = process.env.PORT || 3000;

var scraperapiClient = require('scraperapi-sdk')('c3379831a12a7faaf7c261535e2a7f32')


app.use(bodyParser.urlencoded({extended:true}));


var resultout=[];
var id = 0;
var result="";


app.get("/map",async (req,res) => {
    /*
     {  
        "origin": "19.221512,73.164459",
        "destination": "19.236280,73.130730",
        "provideRouteAlternatives": false,
        "avoidHighways": false,
        "avoidTolls": false,
        "avoidFerries": false,
        "travelMode": "WALKING"
    }
    */
    
    var originlat= req.query.srclat;
    var originlon= req.query.srclon;
    var deslat= req.query.deslat;
    var deslon= req.query.deslon;
    console.log(req.query);
    
    
  var url = "https://directionsdebug.firebaseapp.com/?origin="+originlat+","+originlon+"&destination="+deslat+","+deslon+"&mode=walking";

  console.log(url);
      await getdata(url);
     
    res.json({ "id": id });
    
    
    })

  async function getdata(url){
 
     result = await scraperapiClient.get(url,{render: true});
      
 }

 app.get("/job/:id",function(req,res){
  
    resultout=[];
    var $ =cheerio.load(result);
     var resultdata = $('.adp-directions');
     cheerioTableparser($);
     var datares = $('.adp-directions').parsetable(true,true,true);
     console.log(datares);
     for(var i=0;i<datares[2].length;i++){
         var obj={};
         obj.direction = datares[2][i];
         obj.index=i+1;
         obj.distance=datares[3][i];
         resultout.push(obj);
     }      

      result="";
     /*
     var tp=result;
     result="";
     */
     res.send({"result":resultout});
     
 })

    app.listen(port,function(req,res){
        console.log("server started");
    })

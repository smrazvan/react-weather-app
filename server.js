require("dotenv").config({
    path: __dirname + "/.env"
});
const getIp = require('external-ip')();
const https = require("https");
const http = require("http");
const express = require('express');
const path = require("path");

const PORT = process.env.PORT;

const app = express();

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname + "/build")));
    // app.get("/", (req, res) => {
    //     console.log("GETTT");
    //     res.sendFile(path.join(__dirname + "/build/index.html"));
    // });
}

app.get("/api/ip", (req, res) => {
    getIp((err, ip) => {
        if(err){
            throw err;
        }
        const options = {
            method: "GET",
            hostname: "ip-api.com",
            port: null,
            path: `/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,lat,lon`
        }
        const reqApi = http.request(options, function(resApi){
            const chunks = [];
            resApi.on("data", function(chunk){
                chunks.push(chunk);
            });
            resApi.on("end", function(){
                const body = Buffer.concat(chunks);
                res.send(body.toString());
            })
        });
        reqApi.end();
    });
});
app.get("/api/geodb", (req, res) => {
    const options = {
        "method": "GET",
        "hostname": process.env.xRapidApiHost,
        "port": null,
        "path": `/v1/geo/cities?namePrefix=${req.query.namePrefix}`,
        "headers": {
            "X-RapidAPI-Key": process.env.xRapidApiKey,
            "X-RapidAPI-Host": process.env.xRapidApiHost,
            "useQueryString": true
        }
    }
    const reqApi = https.request(options, function (resApi) {
        const chunks = [];
        resApi.on("data", function (chunk) {
            chunks.push(chunk);
        });
        resApi.on("end", function () {
            const body = Buffer.concat(chunks);
            res.send(body.toString())
        });
        resApi.on("error", function(err){
            console.log(err);
        });
    });
    reqApi.end();
});

app.get("/api/openweathermap", (req, res) => {
    const options = {
        "method": "GET",
        "port": null,
        "hostname": process.env.OPENWEATHERMAP_API_URL,
        "path": `/data/2.5/onecall?lat=${req.query.lat}&lon=${req.query.lon}&appid=a8e20edc05ac1e913f73595b47302c5c`
    }
    console.log(options.path);
    const reqApi = https.request(options, function(resApi){
        const chunks = [];
        console.log();
        resApi.on("data", function(chunk){
            chunks.push(chunk);
        });
        resApi.on("end", function(){
            const body = Buffer.concat(chunks);
            res.send(body.toString());
        })
        resApi.on("error", function(err){
            console.log(err);
        });
    });
    reqApi.end();
});


app.listen(PORT, () => {
    console.log("listening " + PORT);
});
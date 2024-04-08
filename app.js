const express = require("express");
const app = express();
const mongoose = require("mongoose");


app.get('/', (req,res)=>{
    res.send("Hey our app is working fine");
});

app.listen(8080,  ()=>{
    console.log("My app is running on port no 8080");
})
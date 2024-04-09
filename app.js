const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")

const MONGO_URL = 'mongodb+srv://pulkitd132:qA7ZZBlBnH2fO8eD@cluster0.vcf0mow.mongodb.net/wanderlust';

main()
    .then(() =>{
        console.log("Connected to database");
    })
    .catch((err) =>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}


app.get('/', (req,res)=>{
    res.send("Hey our app is working fine");
});

// app.get('/testListing', async (req,res) =>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1500000,
//         location: "Calangute Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfully testing");
// });

app.get("/listing", async (req,res) => {
    const allListing = await Listing.find({});
});

app.listen(8080,  ()=>{
    console.log("My app is running on port no 8080");
})
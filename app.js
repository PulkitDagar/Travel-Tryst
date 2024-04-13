const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


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


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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


//index route
app.get("/listings", wrapAsync(async (req,res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    })
);

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    })
);

//Create Route
app.post("/listings", wrapAsync(async (req, res, next) => {
        if(!req.body.listing){
            throw new ExpressError(400,"Send valid data for listing");
        }
        const newListing = new Listing(req.body.listing);
        if(!newListing.title) {
            throw new ExpressError(400, "Title is missing");
        }

        if(!newListing.description) {
            throw new ExpressError(400, "Description is missing");
        }

        if(!newListing.location) {
            throw new ExpressError(400, "Location is missing");
        }
        await newListing.save();
        res.redirect("/listings");
    
        
    })
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
  
//Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
  
app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use( (err,req,res,next) =>{
    let {statusCode=500, message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
})




app.listen(8080,  ()=>{
    console.log("My app is running on port no 8080");
})
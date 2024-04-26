const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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

// const initDB = async() => {
//     await Listing.deleteMany({});
//     await Listing.insertMany(initData.data);
//     console.log("Data is Initialized");
// };

const initDB = async () => {
    await Listing.deleteMany({});
    const transformedData = initData.data.map(listing => ({
        ...listing,
        image: listing.image.url // Assuming the 'url' property contains the URL string
    }));

    initData.data = initData.data.map((obj) => ({...obj, owner: "661e0fd7f680046877af9d4a"}))
    await Listing.insertMany(transformedData);
    console.log("Data is Initialized");
};

initDB();
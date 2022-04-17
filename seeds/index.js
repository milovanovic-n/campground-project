const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers")

/* Connect Database */
mongoose.connect("mongodb://localhost:27017/campgroundProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(err => {
    console.log("Connection error");
    console.log(err);
  })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({})
  for(let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 30) + 10;
    const camp = await new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Numquam reprehenderit sit dolores incidunt iusto exercitationem similique 
        obcaecati, asperiores blanditiis ratione totam reiciendis quasi 
        soluta quibusdam, nesciunt a ipsa perferendis commodi?`,
      price: randomPrice
    });
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
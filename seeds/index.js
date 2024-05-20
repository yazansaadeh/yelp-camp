const mongoose = require("mongoose");
const campground = require("../models/campground");
const citiesData = require("./city");
const { place, descriptors } = require("./seed helpers");

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("connect sucessfuly");
  })
  .catch((err) => {
    console.log("connect failed");
  });
const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const fillDatabase = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new campground({
      title: `${sample(descriptors)} ${sample(place)}`,
      author: "64132e98ebc89da20fa47bbb",
      location: `${citiesData[random1000].city},${citiesData[random1000].state}`,
      // image: "skxjcsc",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit Inventore repellendusvel dolorum dicta numquam explicaboin Sunt officiis nulla amet, sequi errorvoluptatum beatae Ab voluptatem veritatis iure sit cupiditate",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dhciqziyn/image/upload/v1687199017/YelpCamp/qsznkrumeu5htgwic2sc.jpg",
          filename: "YelpCamp/qsznkrumeu5htgwic2sc",
        },
        {
          url: "https://res.cloudinary.com/dhciqziyn/image/upload/v1687199017/YelpCamp/ynfdaj7kdhgds85mogeb.jpg",
          filename: "YelpCamp/ynfdaj7kdhgds85mogeb",
        },
      ],
    });
    await camp.save();
  }
};
fillDatabase();
// mongoose.Connection.close();

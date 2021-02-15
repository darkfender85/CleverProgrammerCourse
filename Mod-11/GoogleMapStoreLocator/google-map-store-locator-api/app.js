require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Store = require("./api/models/store");
const GoogleMaps = require("./api/services/googleMapsService");
const GoogleMapsService = require('./api/services/googleMapsService');
const googleMapsService = new GoogleMapsService();

const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PSW;

mongoose.connect(
  `mongodb+srv://darkfender85ForPWJ:${mongoPassword}@cluster0.cacfk.mongodb.net/${mongoUser}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/stores", (req, res) => {
  const zipCode = req.query.zipCode;

  googleMapsService.getCoordinates(zipCode).then( coordinates => {
      Store.find({
          location:{
              $near: {
                  $maxDistance: 3200,
                  $geometry:{
                      type:'Point',
                      coordinates: coordinates
                  }
              }
          }
      }, (err, stores) => {
        if (err) res.status(500).send(err);
        else res.status(200).send({
            stores: stores,
            coordinates : coordinates
        });
      })
    })
    .catch((error) => {
      console.log(error);
    });

});

app.post("/api/stores", (req, res) => {
  let addedStores = req.body;
  let documentsToAdd = addedStores.map((item) => {
    let store = {
      storeName: item.name,
      phoneNumber: item.phoneNumber,
      address: item.address,
      openStatusText: item.openStatusText,
      addressLines: item.addressLines,
      location: {
        type: "Point",
        coordinates: [item.coordinates.longitude, item.coordinates.latitude],
      },
    };
    return store;
  });
  Store.create(documentsToAdd).then(
    (result) => {
      res.status(200).send(result);
    },
    (error) => {
      res.status(500).send(error);
    }
  );
});

app.delete("/api/stores", (req, res) => {
  Store.deleteMany({}, (err) => {
    res.status(err ? 500 : 200).send(err);
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

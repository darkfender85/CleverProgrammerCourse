const axios = require("axios");
require("dotenv").config();
const googleMapApiKey = process.env.GOOGLE_MAP_API_KEY;
const googleGecodingUrl = "https://maps.googleapis.com/maps/api/geocode/json";

class GoogleMaps {

    async getCoordinates(zipCode){
        let coordinates = [];
        await axios.get(googleGecodingUrl, {
            params: {
              address: zipCode,
              key: googleMapApiKey,
            },
          }).then((response) => {
            const data = response.data;
            coordinates = [
                data.results[0].geometry.location.lng,
                data.results[0].geometry.location.lat
            ];
        }).catch( error =>  {
            throw new Error(error);
        })

        return coordinates;
    }

}

module.exports = GoogleMaps;
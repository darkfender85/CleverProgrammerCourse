const axios = require("axios");
const url = "https://api.twitter.com/1.1/search/tweets.json";
require('dotenv').config();

class Twitter {

    get(query,count){
        return axios.get(url,{
            params:{
                q : query,
                count: count
            },
            headers:{
                Authorization : `Bearer ${process.env.TWITTER_API_TOKEN}`
            }
        });

    }
}

module.exports = Twitter;
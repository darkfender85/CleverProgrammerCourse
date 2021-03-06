const express = require("express");
const app = express();
const port = 3100;
const Twitter = require('./api/helpers/twitter');
const twitter = new Twitter();

app.use( (req,res, next) =>{
  res.setHeader('Access-Control-Allow-Origin','*');
  next();
})

app.get("/tweets", (req, res) => {
  console.log(req.query);
  const query = req.query.q;
  const count = req.query.count;
  const maxId = req.query.max_id;

    twitter.get(query,count,maxId).then((response) => {
      res.status(200).send(response.data);
    })
    .catch((error) => res.status(400).send(error));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

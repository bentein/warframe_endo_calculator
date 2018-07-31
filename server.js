const express = require('express');
const rp = require('request-promise');
const app = express();

const baseurl = "http://api.warframe.market/v1";
const urlsuffix = "_ayatan_sculpture/orders";
const port = 3002;
const doLog = true;

const sculptureNames = ["anasa", "orta", "vaya", "piv", "valana", "sah", "ayr"];
let orders = {};

getOrders();

app.use(express.static('dist'))

app.get(["/anasa", "/orta", "/vaya", "/piv", "/valana", "/sah", "/ayr"], (req, res) => {
  res.send(orders[req.path.slice(1)]);
});

async function getOrders() {
  for (let i in sculptureNames) {
    let name = sculptureNames[i];
    let url = `${baseurl}/items/${name}${urlsuffix}`;

    let tries = 0;
    let MAXTRIES = 5;

    while(tries < MAXTRIES) {
      await rp(url)
        .then((body) => {
          body = JSON.parse(body);
          let o = body.payload.orders;
          let newOrders = [];
          
          for (let i in o) {
            if (o[i].order_type === "sell") newOrders.push(o[i]);
          }

          orders[name] = newOrders;
          tries = MAXTRIES;
          log(`-- Successfully retrieved ${name} sculpture orders --`);
        })
        .catch((err) => {
          error(`!! Could not retrieve ${name} sculpture orders !!`);
          tries++;
        });
    }
  }
  app.listen(port, () => console.log(`Order server listening on port ${port}!`));
}

function log(message) {
  if(doLog) console.log(message);
}

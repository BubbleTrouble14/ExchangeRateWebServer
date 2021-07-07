const http = require("http");
var schedule = require("node-schedule");
const fetch = require("node-fetch");
let data;
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(200); //Status code OK

  res.end(JSON.stringify(data));
});

const fetchCurrencyExchange = () => {
  return fetch(
    // "http://data.fixer.io/api/latest?access_key=b79e81a6d2351a1d9dab518e8fa08d16&symbols="
    "https://exchange-rates.abstractapi.com/v1/live/?api_key=09473a74e96b4174b54d549b1c789bc8&base=USD"
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return error;
    });
};

schedule.scheduleJob("0 */6 * * *", function () {
  fetchCurrencyExchange().then((response) => {
    if (response) {
      data = response;
    }
  });
});

server.listen(port);

fetchCurrencyExchange();

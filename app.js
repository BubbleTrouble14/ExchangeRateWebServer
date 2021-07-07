const http = require("http");
var schedule = require("node-schedule");
const fetch = require("node-fetch");
let data;
const port = process.env.PORT || 3000;

const server = http.createServer(function (req, res) {
  if (req.method === "POST") {
    var body = "";

    req.on("data", function (chunk) {
      body += chunk;
    });

    req.on("end", function () {
      if (req.url === "/") {
        log("Received message: " + body);
      } else if ((req.url = "/scheduled")) {
        log(
          "Received task " +
            req.headers["x-aws-sqsd-taskname"] +
            " scheduled at " +
            req.headers["x-aws-sqsd-scheduled-at"]
        );
      }

      res.writeHead(200, "OK", { "Content-Type": "text/plain" });
      res.end();
    });
  } else {
    res.setHeader("Content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHead(200);
    res.end(JSON.stringify(data));
    // res.write(html);
    // res.end();
  }
});

// const server = http.createServer((req, res) => {
//   res.setHeader("Content-type", "application/json");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.writeHead(200); //Status code OK

//   res.end(JSON.stringify(data));
// });

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

console.log("Server running at http://127.0.0.1:" + port + "/");

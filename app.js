const http = require("http");
var fs = require("fs");
var url = require("url");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
  const urlObject = url.parse(req.url, true);
  const fileName = `.${urlObject.pathname}`;
  switch (fileName) {
    case "./":
      fs.readdir("./", (err, files) => {
        if (err) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.write(JSON.stringify(err));
          res.end();
        }
        const textFiles = files.filter((file) => file.endsWith(".txt"));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(textFiles));
        res.end();
      });
      return;
    case "./add":
      if (req.method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on("end", () => {
          body = JSON.parse(body);
          if (!body.title || !body.body) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.write("Enter a title and body");
            res.end();
          } else {
            fs.readFile(`${body.title}.txt`, (err, data) => {
              if (data) {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write("File Already Exist");
                res.end();
              } else {
                fs.writeFile(`${body.title}.txt`, body.body, (err) => {
                  if (err) {
                    res.writeHead(400, { "Content-Type": "text/html" });
                    res.write(err);
                    res.end();
                  }
                  res.writeHead(200, { "Content-Type": "text/html" });
                  res.write("Saved");
                  res.end();
                });
              }
            });
          }
        });
      } else {
        fs.readFile("./add.html", null, function (error, data) {
          if (error) {
            res.writeHead(404);
            respone.write("Whoops! File not found!");
          } else {
            res.write(data);
          }
          res.end();
        });
      }

      return;
    case "./style.css":
      fs.readFile("./style.css", null, function (error, data) {
        if (error) {
          res.writeHead(404);
          res.write("No file found");
        } else {
          res.write(data);
        }
        res.end();
      });
      return;
    default:
      fs.readFile(`${fileName}.txt`, (err, data) => {
        if (data) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.write(data);
          res.end();
        } else {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.write("No file found");
          res.end();
        }
      });
  }
});
server.listen(5000, () => {
  console.log("Server running at localhost:5000");
});

const http = require("http");
var fs = require("fs");
var url = require("url");

const server = http.createServer((req, res) => {
  const urlObject = url.parse(req.url, true);
  const pathName = `.${urlObject.pathname}`;
  switch (pathName) {
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
      const queries = urlObject.query;
      if (!queries.name || !queries.body) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write("Enter a name and body");
        res.end();
      } else {
        fs.readFile(`${queries.name}.txt`, (err, data) => {
          if (data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write("File Already Exist");
            res.end();
          } else {
            fs.writeFile(`${queries.name}.txt`, queries.body, (err) => {
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
      return;
    default:
      fs.readFile(`${pathName}.txt`, (err, data) => {
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

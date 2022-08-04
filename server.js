const http = require("http");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const express = require("express");

const app = express();
const httpServer = http.createServer(app);

const PORT = 3000;

app.use(express.static(path.join(__dirname, "static")));

const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Iets ging verkeerd!\n"+err);
};


const upload = multer({
  dest: "./static/uploads/",
});

app.post(
    "/upload",
    upload.single("file"),
    (req, res) => {

      var date_ob = new Date();
      var minutes = date_ob.getMinutes();
      let time = "";
      if(!req.body.time) time = minutes;
      else time = req.body.time;
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./static/uploads/" + `${time}-`+'image.png');
      if(fs.existsSync(targetPath)){
        fs.unlinkSync(tempPath);
        res.status(400)
        .sendFile(path.join(__dirname, 'pages', "error.html"));
        
    }
  
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .sendFile(path.join(__dirname, 'pages', "uploaded.html"));
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .sendFile(path.join(__dirname, 'pages', "err.html"));
        });
      }
    }
  );

app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', "home.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', "clock.html"));
});


httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)});
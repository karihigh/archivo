const path = require("path");
const fs = require("fs");

//joining path of directory
const directoryPath = path.join(__dirname, "data/");

let papaJason = {
  responses: [],
};

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    let babyFile = path.join(directoryPath, file);
    let jason = JSON.parse(fs.readFileSync(babyFile));

    jason.responses.forEach(function (response) {
      let labels = [];
      if (response.labelAnnotations)
        labels = response.labelAnnotations.map((l) => l.description);
      let objects = [];
      if (response.localizedObjectAnnotations)
        objects = response.localizedObjectAnnotations.map((l) => l.name);

      let o = {
        labels: labels,
        objects: objects,
        words: response.fullTextAnnotation
          ? response.fullTextAnnotation.text
          : "",
        url: response.context.uri.replace(
          "gs://",
          "https://archivocarteles.c80.cl/"
        ),
      };
      console.log(o.url);
      papaJason.responses.push(o);
    });
    console.log(papaJason.responses.length);
  });

  // console.log(papaJason);
  fs.writeFileSync(
    `./combinedData.js`,
    `let data = ${JSON.stringify(papaJason)}`
  );
});

//console.log(papaJason.responses.length);

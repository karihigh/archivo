const path = require('path');
const fs = require('fs');

//joining path of directory
const directoryPath = path.join(__dirname, 'BabyJasons/all');

let papaJason = {
  responses: []
};

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        let babyFile = path.join(directoryPath, file);
        let jason = JSON.parse(fs.readFileSync(babyFile));

        jason.responses.forEach( function(imgData) {
          let la = imgData.labelAnnotations || [];
          let ob = imgData.localizedObjectAnnotations || [];
          la = new Set(la.map( a => a.description ));
          ob = new Set(ob.map( a => a.name ));
          let fn = imgData.context.uri;

          let dataToKeep = {
            file: fn.substr(fn.length - 10),
            text: imgData.fullTextAnnotation.text,
            labels: [...la].join(', '),
            objects: [...ob].join(', ')
          }
          //console.log(imgData.labelAnnotations[0].description);
          papaJason.responses.push(dataToKeep);
        })


    });

    fs.writeFileSync(`./JasonsTableAll.json`, JSON.stringify(papaJason));

});

//console.log(papaJason.responses.length);

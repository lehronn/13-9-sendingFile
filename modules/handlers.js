var fs = require('fs');                     //write and read files module.
var formidable = require('formidable');     //upload module.

var fileName = 'No uploading file name';    //upload file name.
var fileTitle = 'No uploading file title';  //upload file title.

exports.welcome = function(request, response) {
  console.log('Rozpoczynam obsługę żądania welcome!');
  fs.readFile('templates/start.html', function(err, html) {
    response.writeHead(200, {"Content-Type": "text/html; charset=utf-8" });
    response.write(html);
    response.end();
  });
}

exports.upload = function(request, response) {
  console.log('Rozpoczynam obsługę żądania upload.');
  var form = new formidable.IncomingForm();
  form.parse(request, function(error, fields, files) {

    fileName = files.upload.name;
    fileTitle = fields.title;

    fs.renameSync(fileName || fileTitle, files.upload.name);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
    return [fileName, fileTitle]; //zwróć obiekt.
  });

  return [fileName, fileTitle]; //zwróć obiekt.
}

var fileDetails = fs.renameSync();
var fileName = fileDetails[0];
var fileTitle = fileDetails[1];

exports.show = function(request, response) {
  fs.readFile(fileTitle || fileName, "binary", function(error, file) {
    response.writeHead(200, {"Content-Type": "image/png"});
    response.write(file, "binary");
    response.end();
  });
}

exports.error = function(request, response) {
  console.log('Błąd, nie wiem co robić. :(');
  response.write('404 :(');
  response.end();
}

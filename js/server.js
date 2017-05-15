var http = require("http");
var parseString = require('xml2js').parseString,
  xml2js = require('xml2js');;
var inspect = require('eyes').inspector({maxLength: false})
var builder = new xml2js.Builder();
var request = require('request');

console.log("Starting server...");

http.createServer(function(req, resp) {
  var respContent = [];
  var respString = '';
  var endxml = '';
  var buildxml ='';

  req.on('data', function(data) {
    respContent.push(data.toString()); //data is a buffer instance
    respString += data.toString();
    console.log("Hit data");
    console.log("=========================================================================");
    console.log("data: " + data.toString());
    console.log("=========================================================================");
  });
  req.on('end', function() {
    console.log("end function");
    console.log("=========================================================================");
    console.log(respContent);
    console.log();
    console.log(respString);
    console.log();

    //endxml = builder.buildObject(respContent);

    console.log("endxml");
    console.log("=========================================================================");
    console.dir(endxml);
    var xml = "<root>Hello xml2js!</root>"
    var value = {};
    parseString(xml, function(err, result) {
      console.log("xml test node");
      console.log("=========================================================================");
      console.dir(result);
      console.log();
    });
    parseString(respContent, function(err, result) {
      console.log("JSON:");
      console.log("=========================================================================");
      console.dir(JSON.stringify(result));
      console.log();
    });
    parseString(respContent, function(err, result) {
      console.log("XML:");
      console.log("=========================================================================");
      console.dir(result);
      endxml = result;
      console.log();
    });
    parseString(respString, function(err, result) {
      console.log("String type:");
      console.log("=========================================================================");
      console.dir(result);
      console.log();
    });
    parseString(respString, function(err, result) {
      console.log("String type JSON:");
      console.log("=========================================================================");
      console.dir(JSON.stringify(result));
      //value = JSON.parse(result);
      console.log();
    });
    console.log("respContent");
    console.log("=========================================================================");
    console.log(respContent);
    console.log();
    console.log("respString");
    console.log("=========================================================================");
    console.log(respString);
    console.log();
    console.log("Trying to access the value now");
    console.log("=========================================================================");
    console.dir(endxml);
    console.log();
    console.dir(value);
    console.log(inspect(endxml))
    console.log(inspect(builder.buildObject(respString)));

    request.post({
      url: 'http://www.customerdatabase.dev/index.php?/public/PublicData/findInformation',
      form: {
        phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]
      }
    }, function(err, httpResponse, body) {
      console.log(body);
    });

    //request.post('http://www.customerdatabase.dev/index.php?/public/PublicData/findInformation').form({phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber']
    //  }).on('response', function(response) {
    //      console.log('HEY');
    //  });

    console.log(endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]);
    console.log();
    console.log(respContent['CallingPartyNumber']);
    console.log();
    console.log(respString.CallingPartyNumber);
    console.log();
    console.log(respContent['CallingPartyNumber']);
    console.log();

  });
  resp.writeHead(200, {"Content-Type": "text/plain"});
  resp.write("OK");
  //console.log(request);

  resp.end();
}).listen(8080);

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
  var buildxml = '';

  req.on('data', function(data) {
    respContent.push(data.toString()); //data is a buffer instance
    respString += data.toString();
    // console.log("Hit data");
    // console.log("=========================================================================");
    // console.log("data: " + data.toString());
    // console.log("=========================================================================");
  });
  req.on('end', function() {
    // console.log("end function");
    // console.log("=========================================================================");
    // console.log(respContent);
    // console.log();
    // console.log(respString);
    // console.log();
    //
    // //endxml = builder.buildObject(respContent);
    //
    // console.log("endxml");
    // console.log("=========================================================================");
    // console.dir(endxml);
    // var xml = "<root>Hello xml2js!</root>"
    var value = {};
    // parseString(xml, function(err, result) {
    //   console.log("xml test node");
    //   console.log("=========================================================================");
    //   console.dir(result);
    //   console.log();
    // });
    // parseString(respContent, function(err, result) {
    //   console.log("JSON:");
    //   console.log("=========================================================================");
    //   console.dir(JSON.stringify(result));
    //   console.log();
    // });
    parseString(respContent, function(err, result) {
      // console.log("XML:");
      // console.log("=========================================================================");
      // console.dir(result);
      endxml = result;
      // console.log();
    });
    // parseString(respString, function(err, result) {
    //   console.log("String type:");
    //   console.log("=========================================================================");
    //   console.dir(result);
    //   console.log();
    // });
    // parseString(respString, function(err, result) {
    //   console.log("String type JSON:");
    //   console.log("=========================================================================");
    //   console.dir(JSON.stringify(result));
    //   //value = JSON.parse(result);
    //   console.log();
    // });
    // console.log("respContent");
    // console.log("=========================================================================");
    // console.log(respContent);
    // console.log();
    // console.log("respString");
    // console.log("=========================================================================");
    // console.log(respString);
    // console.log();
    // console.log("Trying to access the value now");
    // console.log("=========================================================================");
    // console.dir(endxml);
    // console.log();
    // console.dir(value);
    // console.log(inspect(endxml))
    // console.log(inspect(builder.buildObject(respString)));

    // request.post({
    //   url: 'http://www.customerdatabase.dev/index.php?/public/PublicData/findInformation',
    //   form: {
    //     phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]
    //   }
    // }, function(err, httpResponse, body) {
    //   console.log(body);
    //   var info = JSON.parse(body);
    //   if (jQuery.isEmptyObject(info)) {
    //     $("#ohio-status").text("No client information found!").css("color", "red");
    //     //$(".lead-information").hide();
    //   } else {
    //     $("#ohio-status").text("Client information found!").css("color", "green");
    //     $(".lead-information").show();
    //     parseInfo(info);
    //   }
    //   //console.log(info.lead_id);
    // });

    request.post({
      url: 'http://www.customerdatabase.dev/index.php?/public/PublicData/findInformation',
      form: {
        phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]
      }
    }, function(err, httpResponse, body) {
      console.log(body);
      var info = JSON.parse(body);
      if (jQuery.isEmptyObject(info)) {
        $("#ohio-status").text("No client information found!").css("color", "red");
        //$(".lead-information").hide();
      } else {
        $("#ohio-status").text("Client information found!").css("color", "green");
        $(".no-info").hide();
        $(".lead-information").show();
        parseInfo(info);
      }
      //console.log(info.lead_id);
    });

    request.post({
      url: 'https://www.denverphotoboothrentals.com/customerdatabase/index.php?/public/PublicData/findInformation',
      form: {
        phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]
      }
    }, function(err, httpResponse, body) {
      console.log(body);
      var info = JSON.parse(body);
      if (jQuery.isEmptyObject(info)) {
        $("#colorado-status").text("No client information found!").css("color", "red");
        // $(".lead-information").hide();
      } else {
        $("#colorado-status").text("Client information found!").css("color", "green");
        $(".no-info").hide();
        $(".lead-information").show();
        parseInfo(info);
      }
      //console.log(info.lead_id);
    });

    //request.post('http://www.customerdatabase.dev/index.php?/public/PublicData/findInformation').form({phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber']
    //  }).on('response', function(response) {
    //      console.log('HEY');
    //  });

    // console.log(endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]);
    // console.log();
    // console.log(respContent['CallingPartyNumber']);
    // console.log();
    // console.log(respString.CallingPartyNumber);
    // console.log();
    // console.log(respContent['CallingPartyNumber']);
    // console.log();

  });
  resp.writeHead(200, {"Content-Type": "text/plain"});
  resp.write("OK");
  //console.log(request);

  resp.end();
}).listen(8080);

var parseInfo = function(info) {
  //var info = JSON.parse(body);
  // console.log('oeprghrseuioghuiovg');
  // console.log(info.lead_status);
  // var event_datetime = info.event_datetime.split(" ");
  $("#clientName").text(info.lead_first_name + " " + info.lead_last_name);
  $("#email").text(info.lead_email);
  $("#leadStatus").text(info.lead_status);
  $("#leadSource").text(info.lead_source);
  $("#venueName").text(info.venue_name);
  $("#venueAddress").text(info.venue_address );
  $("#eventTime").text(info.event_time);
  $("#eventDate").text(info.event_date);
  $("#eventLength").text(info.event_length);
  $("#notes").text(info.lead_notes);
};

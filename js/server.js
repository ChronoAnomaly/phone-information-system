var http = require("http");
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var inspect = require('eyes').inspector({maxLength: false});
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
  });
  req.on('end', function() {
    var value = {};
    parseString(respContent, function(err, result) {
      endxml = result;
    });

    // Testing dev DB request
    //===================================================================================

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
    //
    //     if (!jQuery.isEmptyObject(info.lead_data)) {
    //       $(".lead-information").show();
    //       parseLeadInfo(info);
    //     } else {
    //       console.log(info.lead_data === undefined);
    //     }
    //
    //     if (!jQuery.isEmptyObject(info.client_data)) {
    //       $(".client-information").show();
    //       parseClientInfo(info);
    //     }
    //
    //     if (!jQuery.isEmptyObject(info.event_data)) {
    //       $(".event-information").show();
    //       parseEventInfo(info);
    //     }
    //
    //   }
    // });

    // Ohio DB request
    //===================================================================================

    request.post({
      url: 'https://www.pictureperfectohio.com/customerdatabase//index.php?/public/PublicData/findInformation',
      form: {
        phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]
      }
    }, function(err, httpResponse, body) {
      console.log(body);
      var info = JSON.parse(body);
      if (jQuery.isEmptyObject(info)) {
        $("#ohio-status").text("No client information found!").css("color", "red");
      } else {
        $("#ohio-status").text("Client information found!").css("color", "green");

        if (info.lead_data.length > 0) {
          $(".lead-information").show();
          parseLeadInfo(info);
        } else {
          $(".lead-information").hide();
        }

        if (info.client_data.length > 0) {
          $(".client-information").show();
          parseClientInfo(info);
        } else {
          $(".client-information").hide();
        }

        if (!jQuery.isEmptyObject(info.event_data)) {
          $(".event-information").show();
          parseEventInfo(info);
        } else {
          $(".event-information").hide();
        }
      }
    });

    // Colorado DB request
    //===================================================================================

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

        if (!jQuery.isEmptyObject(info.lead_data)) {
          $(".lead-information").show();
          parseLeadInfo(info);
        } else {
          $(".lead-information").hide();
        }

        if (!jQuery.isEmptyObject(info.client_data)) {
          $(".client-information").show();
          parseClientInfo(info);
        } else {
          $(".client-information").hide();
        }

        if (!jQuery.isEmptyObject(info.event_data)) {
          $(".event-information").show();
          parseEventInfo(info);
        } else {
          $(".event-information").hide();
        }
      }
    });

    resp.writeHead(200, {"Content-Type": "text/plain"});
    resp.write("OK");
    resp.end();
  });
}).listen(8080);

var parseLeadInfo = function(info) {
  $("#leadName").text(info.lead_data.lead_first_name + " " + info.lead_data.lead_last_name);
  $("#leadEmail").text(info.lead_data.lead_email);
  $("#leadStatus").text(info.lead_data.lead_status);
  $("#leadSource").text(info.lead_data.lead_source);
  $("#leadVenueName").text(info.lead_data.venue_name);
  $("#leadVenueAddress").text(info.lead_data.venue_address);
  $("#leadEventTime").text(info.lead_data.event_time);
  $("#leadEventDate").text(info.lead_data.event_date);
  $("#leadEventLength").text(info.lead_data.event_length);
  $("#leadNotes").text(info.lead_data.lead_notes);
};

var parseClientInfo = function(info) {
  $("#clientName").text(info.client_data.client_first_name + " " + info.client_data.client_last_name);
  $("#clientEmail").text(info.client_data.client_email);
  $("#clientDateOfContact").text(info.client_data.date_of_contact);
  $("#clientReferral").text(info.client_data.client_referral);
};

var parseEventInfo = function(info) {
  $eventDiv = $('.event-information');
  $eventDiv.empty();
  $eventDiv.append("<h3>Event(s) Information</h3>");

  jQuery.each(info.event_data, function(index, value) {
    $eventDiv.append("<p>Event ID: " + value.event_id + "</p>");
    $eventDiv.append("<p>Event Type: " + value.event_type + "</p>");
    $eventDiv.append("<p>Event Date: " + value.event_date + "</p>");
    $eventDiv.append("<p>Event Time: " + value.event_time + "</p>");
    $eventDiv.append("<p>Event Length: " + value.event_length + "</p>");
    $eventDiv.append("<p>Event Cost: " + value.total_cost + "</p>");
    $eventDiv.append("<p>Event Address: " + value.event_address + "</p>");
    $eventDiv.append("<p>Contract Signed: " + value.contract_signed + "</p>");
    $eventDiv.append("<p>Logo Chosen: " + value.chosen_logo + "</p>");
    $eventDiv.append("<p>Outside Event: " + value.outside_event + "</p>");
    $eventDiv.append("<p>Event Notes: " + value.event_notes + "</p>");
    $eventDiv.append("<br>");
  });
};

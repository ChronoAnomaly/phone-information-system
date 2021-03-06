var http = require("http");
var parseString = require('xml2js').parseString;
var xml2js = require('xml2js');
var inspect = require('eyes').inspector({
  maxLength: false
});
var builder = new xml2js.Builder();
var request = require('request');
const {
  shell
} = require('electron')

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

    // live url: https://www.pictureperfectohio.com/customerdatabase/index.php?/public/PublicData/findInformation
    // testing url: http://localhost/customerdatabase/www/index.php?/public/PublicData/findInformation
    // Ohio DB request
    //===================================================================================

    request.post({
      url: 'https://www.pictureperfectohio.com/customerdatabase/index.php?/public/PublicData/findInformation',
      form: {
        phone_number: endxml['PolycomIPPhone']['IncomingCallEvent'][0]['CallingPartyNumber'][0]
      }
    }, function(err, httpResponse, body) {
      console.log(body);
      var info = JSON.parse(body);
      if (jQuery.isEmptyObject(info.lead_data) && jQuery.isEmptyObject(info.client_data) && jQuery.isEmptyObject(info.event_data)) {
        $("#ohio-status").text("No client information found!").css("color", "red");

        $("#ohio-status").removeClass("found-data").addClass("no-data");

        if (!$("#colorado-status").hasClass("found-data")) {
          $(".lead-information").hide();
          $(".client-information").hide();
          $(".event-information").hide();
        }

      } else {
        $("#ohio-status").text("Client information found!").css("color", "green");

        $("#ohio-status").removeClass("no-data").addClass("found-data");

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
      if (jQuery.isEmptyObject(info.lead_data) && jQuery.isEmptyObject(info.client_data) && jQuery.isEmptyObject(info.event_data)) {
        $("#colorado-status").text("No client information found!").css("color", "red");

        $("#colorado-status").removeClass("found-data").addClass("no-data");

        if (!$("#ohio-status").hasClass("found-data")) {
          $(".lead-information").hide();
          $(".client-information").hide();
          $(".event-information").hide();
        }

      } else {
        $("#colorado-status").text("Client information found!").css("color", "green");

        $("#colorado-status").removeClass("no-data").addClass("found-data");

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

    resp.writeHead(200, {
      "Content-Type": "text/plain"
    });
    resp.write("OK");
    resp.end();
  });
}).listen(8080);

var parseLeadInfo = function(info) {
  $("#leadId").text(info.lead_data.lead_id);
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
  $("#view-lead").attr("data-link", info.lead_data.view_lead);
};

var parseClientInfo = function(info) {
  $("#clientName").text(info.client_data.client_first_name + " " + info.client_data.client_last_name);
  $("#clientEmail").text(info.client_data.client_email);
  $("#clientDateOfContact").text(info.client_data.date_of_contact);
  $("#clientReferral").text(info.client_data.client_referral);
  $("#view-client").attr("data-link", info.client_data.view_client);
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
    $eventDiv.append("<p>Event Address: " + value.venue_street_address + "</p>");
    $eventDiv.append("<p>Contract Signed: " + value.contract_signed + "</p>");
    $eventDiv.append("<p>Logo Chosen: " + value.chosen_logo + "</p>");
    $eventDiv.append("<p>Outside Event: " + value.outside_event + "</p>");
    $eventDiv.append("<p>Event Notes: " + value.event_notes + "</p>");
    $eventDiv.append("<p><button class=\"btn btn-primary\" onclick=\"shell.openExternal('" + value.view_event + "')\">View Event</button></p>");
    $eventDiv.append("<br>");
  });
};

// $('#ohio-lead').on('click', function() {
//   shell.openExternal('https://www.pictureperfectohio.com/customerdatabase/index.php?/leads/LeadsManager/newleads_dialog');
// });
//
// $('#colorado-lead').on('click', function() {
//   shell.openExternal('https://www.denverphotoboothrentals.com/customerdatabase/index.php?/leads/LeadsManager/newleads_dialog');
// });

$('button').on('click', function() {
  var link = $(this).attr('data-link');
  shell.openExternal(link);
});

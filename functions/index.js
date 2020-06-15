// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const fetch = require("node-fetch");
const client = new firestore.v1.FirestoreAdminClient();
const { Telegraf } = require("telegraf");
var admin = require("firebase-admin");
const express = require("express");
admin.initializeApp(functions.config().firebase);
var request = require("request");
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const twilio = require("twilio")(accountSid, authToken);
const BitlyClient = require("bitly").BitlyClient;
const REACT_APP_BITLY_KEY = functions.config().bitly.key;
const bitly = new BitlyClient(REACT_APP_BITLY_KEY);
const channel1 = functions.config().channel.channel1;
const channel2 = functions.config().channel.channel2;
const takesgurl = functions.config().sync.takesgurl;

// give us the possibility of manage request properly
const app = express();
// Replace BUCKET_NAME
const bucket = "gs://backup-bucket-hawkercentral";
const shorten = async (url) => {
  const d = await bitly.shorten(url);
  return d.link;
};
const dayName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "2GB",
};

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

exports.requestOneMap = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var options = {
        method: "POST",
        url: "https://developers.onemap.sg/privateapi/auth/post/getToken",
        headers: {
          "cache-control": "no-cache",
          "content-type":
            "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        },
        formData: {
          email: functions.config().onemap.email,
          password: functions.config().onemap.password,
        },
      };

      request(options, (error, response, body) => {
        if (error) throw new Error(error);
        res.status(200).send(body);
      });
    });
  });

exports.all = functions.https.onRequest(async (req, res) => {
  return cors(req, res, async () => {
    var result = [];
    await admin
      .app()
      .firestore()
      .collection("hawkers")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            data = doc.data();
            data.id = doc.id;
            result.push(data);
          }
        });
        console.log("Fetched successfully!");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(200).send(result);
        return true;
      })
      .catch((error) => {
        console.log(error);
        res.status(405).send(error);
      });
  });
});

exports.scheduledFirestoreExport = functions
  .region("asia-east2")
  .pubsub.schedule("every 24 hours")
  .onRun((context) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, "(default)");

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        // Leave collectionIds empty to export all collections
        // or set to a list of collection IDs to export,
        // collectionIds: ['users', 'posts']
        collectionIds: ["hawkers"],
      })
      .then((responses) => {
        const response = responses[0];
        console.log(`Operation Name: ${response["name"]}`);
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw new Error("Export operation failed");
      });
  });

const bot = new Telegraf(functions.config().telegrambot.key);

const cors = require("cors")({
  origin: true,
});

exports.telegramDevSend = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var origin = req.body.origin;
      var destination = req.body.destination;
      var cost = req.body.cost;
      var time = req.body.time;
      var requester_mobile = req.body.requester_mobile;
      var message =
        "<b>New Order Received</b> \n" +
        "<b>From: </b> <a href='https://maps.google.com/?q=" +
        origin +
        "'>" +
        origin +
        "</a>\n" +
        "<b>To: </b><a href='https://maps.google.com/?q=" +
        destination +
        "'>" +
        destination +
        "</a>\n" +
        "<b>Fee: </b>" +
        cost +
        "\n" +
        "<b>Pickup Time: </b>" +
        time +
        "\n" +
        "<b>Point of Contact: </b>" +
        requester_mobile +
        "\n";

      let foodleh_message = await bot.telegram
        .sendMessage("@foodlehxcoenterprise", message, {
          parse_mode: "HTML",
        })
        .catch((e) => {
          console.log(e);
        });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).send(foodleh_message);
    });
  });

exports.telegramSend = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var origin = req.body.origin;
      var destination = req.body.destination;
      var cost = req.body.cost;
      // var distance = req.body.distance;
      var url = "https://" + req.body.url;
      url = await shorten(url).catch((e) => {
        console.log(e);
      });
      var id = req.body.id;
      var time = req.body.time;
      var cancel = "https://www.foodleh.app/delivery?cancel=" + id;
      cancel = await shorten(cancel.toString()).catch((e) => {
        console.log(e);
      });
      var requester_mobile = req.body.requester_mobile;
      var duration = req.body.duration;
      var arrival = req.body.arrival;
      var message =
        "<b>New Order Received from <a href='www.foodleh.app'>FoodLeh</a></b> \n" +
        "<b>From: </b> <a href='https://maps.google.com/?q=" +
        origin +
        "'>" +
        origin +
        "</a>\n" +
        "<b>To: </b><a href='https://maps.google.com/?q=" +
        destination +
        "'>" +
        destination +
        "</a>\n" +
        "<b>Fee: </b>" +
        cost +
        "\n" +
        "<b>Pickup Time: </b>" +
        time +
        "\n" +
        "<b>Est. Duration: </b>" +
        duration +
        "\n" +
        "<b>Est. Arrival: </b>" +
        arrival +
        "\n" +
        "<b>Click to Accept (first come first serve): </b>" +
        url +
        "\n (request expires at pickup time)";

      let foodleh_message = await bot.telegram
        .sendMessage(channel1, message, {
          parse_mode: "HTML",
        })
        .catch((e) => {
          console.log(e);
        });

      let deliverysg_message = await bot.telegram
        .sendMessage(channel2, message, {
          parse_mode: "HTML",
        })
        .catch((e) => {
          console.log(e);
        });

      await twilio.messages
        .create({
          body:
            "Request received & expire at the time of pickup. See all orders and cancel at www.foodleh.app/orders. Pickup times that are too soon may not be assigned driver. ",
          from: "+12015847715",
          to: "+65" + requester_mobile,
        })
        .then((message) => console.log(message.sid))
        .catch((e) => {
          console.log(e);
        });

      let foodleh_id = foodleh_message.message_id;
      let deliverysg_id = deliverysg_message.message_id;

      await admin
        .app()
        .firestore()
        .collection("deliveries")
        .doc(id)
        .update({
          message_id: {
            foodleh: foodleh_id,
            deliverysg: deliverysg_id,
          },
        })
        .then(() => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.status(200).send(message);
          return true;
        })
        .catch((e) => {
          console.log(e);
        });
    });
  });

exports.telegramEdit = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var foodleh_id = req.body.foodleh_id ? req.body.foodleh_id : null;
      var deliverysg_id = req.body.deliverysg_id
        ? req.body.deliverysg_id
        : null;
      var driver_mobile = req.body.driver_mobile
        ? req.body.driver_mobile
        : null;
      var driver_name = req.body.driver_name ? req.body.driver_name : null;
      var requester_mobile = req.body.requester_mobile
        ? req.body.requester_mobile
        : null;
      var origin = req.body.origin ? req.body.origin : null;
      var destination = req.body.destination ? req.body.destination : null;
      var time = req.body.time ? req.body.time : null;
      var customer_mobile = req.body.customer_mobile
        ? req.body.customer_mobile
        : null;
      var note = req.body.note ? req.body.note : null;
      var cost = req.body.cost ? req.body.cost : null;
      var duration = req.body.duration ? req.body.duration : null;
      var arrival = req.body.arrival ? req.body.arrival : null;
      var paynow_alternate = req.body.paynow_alternate
        ? req.body.paynow_alternate
        : "Driver No.";

      await twilio.messages
        .create({
          body:
            "Driver Found" +
            "\nCust. : +65" +
            customer_mobile +
            "\nDriver: +65" +
            driver_mobile +
            "\nName: " +
            driver_name +
            "\n$" +
            cost +
            "\nPickup: " +
            time +
            "\nPayto: " +
            paynow_alternate,
          from: "+12015847715",
          to: "+65" + requester_mobile,
        })
        .then((message) => console.log(requester_mobile, message.sid))
        .catch((e) => {
          console.log(e);
        });

      await twilio.messages
        .create({
          body:
            "Stall: +65" +
            requester_mobile +
            "\n" +
            "Cust.: +65" +
            customer_mobile +
            "\n" +
            "Pickup:" +
            time +
            "\nDelivery: $" +
            cost +
            "\n",
          from: "+12015847715",
          to: "+65" + driver_mobile,
        })
        .then((message) => console.log(driver_mobile, message.sid))
        .catch((e) => {
          console.log(e);
        });

      var message =
        "<s><b>New Order Received from <a href='www.foodleh.app'>FoodLeh</a></b> \n" +
        "<b>From: </b> <a href='https://maps.google.com/?q=" +
        origin +
        "'>" +
        origin +
        "</a>\n" +
        "<b>To: </b><a href='https://maps.google.com/?q=" +
        destination +
        "'>" +
        destination +
        "</a>\n" +
        "<b>Fee: </b>$" +
        cost +
        "\n" +
        "<b>Pickup Time: </b>" +
        time +
        "\n" +
        "<b>Est. Duration: </b>" +
        duration +
        "\n" +
        "<b>Est. Arrival: </b>" +
        arrival +
        "\n" +
        "<b>Click to Accept (first come first serve): </b></s>" +
        "\n\n<b>Someone Has Accepted This Request</b>";
      const job1 = bot.telegram
        .editMessageText(channel1, foodleh_id, "", message, {
          parse_mode: "HTML",
        })
        .then((data) => {
          console.log(data);
          return data;
        })
        .catch((e) => {
          console.log(e);
        });

      const job2 = bot.telegram
        .editMessageText(channel2, deliverysg_id, "", message, {
          parse_mode: "HTML",
        })
        .then((data) => {
          console.log(data);
          return data;
        })
        .catch((e) => {
          console.log(e);
        });

      const jobs = [];
      jobs.push(job1);
      jobs.push(job2);
      await Promise.all(jobs);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).send(message);
      return true;
    });
  });

exports.telegramCancel = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var data = req.body.data ? req.body.data : null;
      console.log(data);
      console.log(data.time);
      var time =
        data.time && typeof data.time !== "string"
          ? dayName[
              new Date(data.time.seconds * 1000 + 28800 * 1000).getDay()
            ] +
            " " +
            new Date(data.time.seconds * 1000 + 28800 * 1000).getDate() +
            " " +
            monthNames[
              new Date(data.time.seconds * 1000 + 28800 * 1000).getMonth()
            ] +
            " " +
            formatAMPM(new Date(data.time.seconds * 1000 + 28800 * 1000))
          : null;
      var message =
        "<s><b>New Order Received from <a href='www.foodleh.app'>FoodLeh</a></b> \n" +
        "<b>From: </b> <a href='https://maps.google.com/?q=" +
        data.street +
        "'>" +
        data.street +
        "</a>\n" +
        "<b>To: </b><a href='https://maps.google.com/?q=" +
        data.street_to +
        "'>" +
        data.street_to +
        "</a>\n" +
        "<b>Fee: </b>$" +
        data.cost +
        "\n" +
        "<b>Pickup Time: </b>" +
        time +
        "\n" +
        "<b>Est. Duration: </b>" +
        data.duration +
        "\n" +
        "<b>Est. Arrival: </b>" +
        data.arrival +
        "\n" +
        "<b>Click to Accept (first come first serve): </b></s>" +
        "\n\n<b>The owner has cancelled this request. </b>";
      await bot.telegram
        .editMessageText(channel1, data.message_id.foodleh, "", message, {
          parse_mode: "HTML",
        })
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.log(e);
        });
      await bot.telegram
        .editMessageText(channel2, data.message_id.deliverysg, "", message, {
          parse_mode: "HTML",
        })
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.log(e);
        });
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(200).send(message);
    });
  });

exports.taskRunner = functions
  .region("asia-east2")
  .runWith({ memory: "2GB" })
  .pubsub.schedule("* * * * *")
  .onRun(async (context) => {
    // set now as 20 minutes ago
    var now = admin.firestore.Timestamp.now();
    console.log(now);
    const query = admin
      .app()
      .firestore()
      .collection("deliveries")
      .where("lastmodified", "<=", now)
      .where("viewed", "==", false)
      .where("expired", "==", false)
      .where("cancelled", "==", false);

    const tasks = await query.get();

    // Jobs to execute concurrently.
    const jobs = [];

    // Loop over documents and push job.
    tasks.forEach((snapshot) => {
      const {
        message_id,
        contact,
        contact_to,
        street_to,
        street,
        cost,
        time,
        duration,
        arrival,
      } = snapshot.data();
      var expiry = new Date(
        snapshot.data().time.toDate().getTime() - 0 * 60000
      );
      var time_formatted =
        time && typeof time !== "string"
          ? dayName[new Date(time.seconds * 1000 + 28800 * 1000).getDay()] +
            " " +
            new Date(time.seconds * 1000 + 28800 * 1000).getDate() +
            " " +
            monthNames[
              new Date(time.seconds * 1000 + 28800 * 1000).getMonth()
            ] +
            " " +
            formatAMPM(new Date(time.seconds * 1000 + 28800 * 1000))
          : null;
      var now = new Date();
      console.log(message_id, now - expiry);
      if (now - expiry > 0) {
        var message =
          "<s><b>New Order Received from <a href='www.foodleh.app'>FoodLeh</a></b> \n" +
          "<b>From: </b> <a href='https://maps.google.com/?q=" +
          street +
          "'>" +
          street +
          "</a>\n" +
          "<b>To: </b><a href='https://maps.google.com/?q=" +
          street_to +
          "'>" +
          street_to +
          "</a>\n" +
          "<b>Fee: </b>$" +
          cost +
          "\n" +
          "<b>Pickup Time: </b>" +
          time_formatted +
          "\n" +
          "<b>Est. Duration: </b>" +
          duration +
          "\n" +
          "<b>Est. Arrival: </b>" +
          arrival +
          "\n" +
          "<b>Click to Accept (first come first serve): </b></s>" +
          "\n\n<b>This request has expired </b>" +
          "\n (request expires at pickup time)";
        const job1 = snapshot.ref.update({ expired: true }).catch((e) => {
          console.log(e);
        });
        console.log(message_id.foodleh + " expired");
        const job2 = bot.telegram
          .editMessageText(channel1, message_id.foodleh, "", message, {
            parse_mode: "HTML",
          })
          .catch((e) => {
            console.log(e);
          });
        const job3 = bot.telegram
          .editMessageText(channel2, message_id.deliverysg, "", message, {
            parse_mode: "HTML",
          })
          .catch((e) => {
            console.log(e);
          });
        const job4 = twilio.messages
          .create({
            body:
              "Sorry, your request expired :(" +
              "\nAddress:" +
              street_to +
              "\nCust. No.:+65" +
              contact_to +
              "\nTo resubmit go: www.foodleh.app/orders. ",
            from: "+12015847715",
            to: "+65" + contact,
          })
          .then((message) => console.log(contact, message.sid))
          .catch((e) => {
            console.log(e);
          });
        jobs.push(job1);
        jobs.push(job2);
        jobs.push(job3);
        jobs.push(job4);
      }
    });

    // Execute all jobs concurrently
    return await Promise.all(jobs);
  });

exports.takesgSync = functions
  .region("asia-east2")
  .runWith(runtimeOpts)
  .pubsub.schedule("every 24 hours")
  .onRun(async (context) => {
    var take_keys = [];
    var take_data = [];

    const url = takesgurl;

    await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        json.forEach((d) => {
          take_keys.push(d.phone);
          take_data.push(d);
        });
        return json;
      })
      .catch((e) => {
        console.log(e);
      });

    await admin
      .app()
      .firestore()
      .collection("hawkers")
      .get()
      .then((snapshot) => {
        snapshot.forEach(async (d) => {
          var data_contact = "65" + d.data().contact;
          var inTakesg = take_keys.includes(data_contact);
          if (inTakesg && d.data().takesg) {
            var index = take_keys.indexOf(data_contact);
            var data = take_data[index];
            var delivery_detail = data.free_delivery
              ? "Free delivery spend: $" + data.free_delivery + "\n"
              : "";
            delivery_detail = data.minimum_order
              ? delivery_detail + "Minimum order: $" + data.minimum_order
              : delivery_detail;
            await d.ref
              .update({
                description_detail: data.description
                  ? data.description + "\n Contributed by take.sg"
                  : "",
                name: data.name,
                price: data.delivery_cost ? "$" + data.delivery_cost : "",
                website: data.reference ? data.reference : "",
                menu_combined: data.menus ? data.menus : "",
                tagsValue: data.tags ? data.tags : "",
                menu: true,
                minimum_order: data.minimum_order ? data.minimum_order : 0,
                free_delivery: data.free_delivery ? data.free_delivery : 0,
              })
              .then((d) => {
                console.log("Updated: " + data.name);
                return true;
              })
              .catch((e) => {
                console.log(e);
              });
          }
        });
        return true;
      })
      .catch((e) => {
        console.log(e);
      });
  });

// var admin = require("firebase-admin");
// var functions = require("firebase-functions");
// const cors = require("cors")({
//   origin: true,
// });

// admin.initializeApp(functions.config().firebase);

// function distance(lat1, lon1, lat2, lon2) {
//   if (lat1 === lat2 && lon1 === lon2) {
//     return 0;
//   } else {
//     var radlat1 = (Math.PI * lat1) / 180;
//     var radlat2 = (Math.PI * lat2) / 180;
//     var theta = lon1 - lon2;
//     var radtheta = (Math.PI * theta) / 180;
//     var dist =
//       Math.sin(radlat1) * Math.sin(radlat2) +
//       Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
//     if (dist > 1) {
//       dist = 1;
//     }
//     dist = Math.acos(dist);
//     dist = (dist * 180) / Math.PI;
//     dist = dist * 60 * 1.1515;
//     return dist * 1.609344;
//   }
// }

// exports.all = functions.https.onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     let lng = req.body.longitude;
//     let lat = req.body.latitude;
//     let loc = req.body.query;
//     let distance_filter = req.body.distance;
//     let data
//     var result = [];
//     let limit = 9999
//     if (req.body.limit){
//       limit = req.body.limit
//     }
//     await admin
//       .app()
//       .firestore()
//       .collection("hawkers")
//       .limit(limit)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           if (doc.exists) {
//             data = doc.data()
//             data.id = doc.id;
//             result.push(data);
//           }
//         });
//         console.log("Fetched successfully!");
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.status(200).send(result);
//         return true;
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(405).send(error);
//       });
//   });
// });

// exports.nearby = functions.https.onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     let lng = req.body.longitude;
//     let lat = req.body.latitude;
//     let loc = req.body.query;
//     let distance_filter = req.body.distance;
//     var result = [];
//     let data
//     let limit = 9999
//     if (req.body.limit){
//       limit = req.body.limit
//     }
//     await admin
//       .app()
//       .firestore()
//       .collection("hawkers")
//       .limit(limit)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           if (doc.exists) {
//             // Calculate distance between search location and hawker location
//             let distance_calc = distance(
//               doc.data().latitude,
//               doc.data().longitude,
//               lat,
//               lng
//             );
//             if (distance_calc < distance_filter) {
//                 data = doc.data()
//                 data.id = doc.id;
//                 result.push(data);
//               }
//           }
//         });
//         console.log("Fetched successfully!");
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.status(200).send(result);
//         return true;
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(405).send(error);
//       });
//   });
// });

// exports.islandwide = functions.https.onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     let lng = req.body.longitude;
//     let lat = req.body.latitude;
//     let loc = req.body.query;
//     let distance_filter = req.body.distance;
//     var result = [];
//     let data
//     let limit = 9999
//     if (req.body.limit){
//       limit = req.body.limit
//     }
//     await admin
//       .app()
//       .firestore()
//       .collection("hawkers")
//       .where("islandwide", "==", true)
//       .limit(limit)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           if (doc.exists) {
//             data = doc.data()
//             data.id = doc.id;
//             result.push(data);
//           }
//         });
//         console.log("Fetched successfully!");
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.status(200).send(result);
//         return true;
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(405).send(error);
//       });
//   });
// });

// exports.region = functions.https.onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     let lng = req.body.longitude;
//     let lat = req.body.latitude;
//     let loc = req.body.query;
//     let distance_filter = req.body.distance;
//     let region = req.body.region;
//     var result = [];
//     let data
//     let limit = 9999
//     if (req.body.limit){
//       limit = req.body.limit
//     }

//     await admin
//       .app()
//       .firestore()
//       .collection("hawkers")
//       .where(region, "==", true)
//       .limit(limit)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           if (doc.exists) {
//             data = doc.data()
//             data.id = doc.id;
//             result.push(data);
//           }
//         });
//         console.log("Fetched successfully!");
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.status(200).send(result);
//         return true;
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(405).send(error);
//       });
//   });
// });

// exports.cuisine = functions.https.onRequest(async (req, res) => {
//   return cors(req, res, async () => {
//     let lng = req.body.longitude;
//     let lat = req.body.latitude;
//     let loc = req.body.query;
//     let distance_filter = req.body.distance;
//     let cuisine = req.body.cuisine;
//     var result = [];
//     let data
//     let limit = 9999
//     if (req.body.limit){
//       limit = req.body.limit
//     }

//     await admin
//       .app()
//       .firestore()
//       .collection("hawkers")
//       .where("cuisine", "array-contains", cuisine)
//       .limit(limit)
//       .get()
//       .then((snapshot) => {
//         snapshot.forEach((doc) => {
//           if (doc.exists) {
//             data = doc.data()
//             data.id = doc.id;
//             result.push(data);
//           }
//         });
//         console.log("Fetched successfully!");
//         res.setHeader("Access-Control-Allow-Origin", "*");
//         res.status(200).send(result);
//         return true;
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(405).send(error);
//       });
//   });
// });

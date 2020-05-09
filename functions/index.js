// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const client = new firestore.v1.FirestoreAdminClient();
const { Telegraf } = require("telegraf");
var admin = require("firebase-admin");
const express = require("express");
admin.initializeApp(functions.config().firebase);

const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const twilio = require("twilio")(accountSid, authToken);

// give us the possibility of manage request properly
const app = express();
// Replace BUCKET_NAME
const bucket = "gs://backup-bucket-hawkercentral";

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

exports.telegramSend = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var origin = req.body.origin;
      var destination = req.body.destination;
      var cost = req.body.cost;
      // var distance = req.body.distance;
      var url = req.body.url;
      var id = req.body.id;
      var time = req.body.time;
      var cancel = "www.foodleh.app/delivery?cancel=" + id;
      var requester_mobile = req.body.requester_mobile;
      var duration = req.body.duration
      var arrival = req.body.arrival
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
        "<b>Est. Duration: </b>" +
        duration +
        "\n" +
        "<b>Est. Arrival: </b>" +
        arrival +
        "\n" +
        "<b>Click to Accept (first come first serve): </b>" +
        url +
        "\n (request expires 30 minutes before pickup)";

      let sent = await bot.telegram.sendMessage("@foodlehdelivery", message, {
        parse_mode: "HTML",
      });

      twilio.messages
        .create({
          body:
            "Request received & expire 30 minutes before pickup.  我们已收到您的要求并在取食物时间的三十分钟前自动取消. To Cancel 马上取消: " +
            cancel +
            ".",
          from: "+12015847715",
          to: "+65" + requester_mobile,
        })
        .then((message) => console.log(message.sid))
        .catch((e) => {
          console.log(e);
        });

      let message_id = sent.message_id;
      await admin
        .app()
        .firestore()
        .collection("deliveries")
        .doc(id)
        .update({
          message_id: message_id,
        })
        .then(() => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.status(200).send(message);
          return true;
        });
    });
  });

exports.telegramEdit = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var message_id = req.body.message_id ? req.body.message_id : null;
      var driver_mobile = req.body.driver_mobile
        ? req.body.driver_mobile
        : null;
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
      var arrival = req.body.arrival ? req.body.arrival : null;

      twilio.messages
        .create({
          body:
            "Order picked up by driver 您的订单已有司机接受。\n Driver 司机: +65" +
            driver_mobile +
            "\n Delivery 运送: $" +
            cost +
            "\n Pickup 抵达: " +
            time,
          from: "+12015847715",
          to: "+65" + requester_mobile,
        })
        .then((message) => console.log(message.sid))
        .catch((e) => {
          console.log(e);
        });

      twilio.messages
        .create({
          body:
            "Order Confirmed: "+time+" \n " +
            "Stall: " +
            requester_mobile +
            "\n" +
            "Customer: " +
            customer_mobile +
            "\n" +
            "From: " +
            origin +
            "\n" +
            "To: " +
            destination +
            "\n" +
            "\n" +
            "ETA: " +
            arrival +
            "\n" +
            "Delivery: $" +
            cost +
            "\n" +
            "Note: " +
            note +
            "\n",
          from: "+12015847715",
          to: "+65" + driver_mobile,
        })
        .then((message) => console.log(message.sid))
        .catch((e) => {
          console.log(e);
        });

      var message = "<b>A driver has picked up this order! </b>";
      await bot.telegram
        .editMessageText("@foodlehdelivery", message_id, "", message, {
          parse_mode: "HTML",
        })
        .then(() => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.status(200).send(message);
          return true;
        });
    });
  });

exports.telegramCancel = functions
  .region("asia-east2")
  .https.onRequest(async (req, res) => {
    return cors(req, res, async () => {
      var message_id = req.body.message_id ? req.body.message_id : null;

      var message = "<b>The hawker has cancelled this request. </b>";
      await bot.telegram
        .editMessageText("@foodlehdelivery", message_id, "", message, {
          parse_mode: "HTML",
        })
        .then(() => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.status(200).send(message);
          return true;
        });
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
      const { message_id } = snapshot.data();
      var expiry = new Date(
        snapshot.data().time.toDate().getTime() - 30 * 60000
      );
      var now = new Date();
      console.log(message_id, now - expiry);
      if (now - expiry > 0) {
        var message = "<b>This request has expired </b>";
        const job1 = snapshot.ref.update({ expired: true });
        console.log(message_id + " expired");
        const job2 = bot.telegram.editMessageText(
          "@foodlehdelivery",
          message_id,
          "",
          message,
          {
            parse_mode: "HTML",
          }
        );
        jobs.push(job1);
        jobs.push(job2);
      }
    });

    // Execute all jobs concurrently
    return await Promise.all(jobs);
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

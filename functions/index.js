// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const functions = require("firebase-functions");
const firestore = require("@google-cloud/firestore");
const client = new firestore.v1.FirestoreAdminClient();

// Replace BUCKET_NAME
const bucket = "gs://backup-bucket-hawkercentral";

exports.scheduledFirestoreExport = functions.pubsub
  .schedule("every 24 hours")
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

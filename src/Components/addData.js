// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

let cheerio = require("cheerio");
const axios = require("axios");

const firebase = require("firebase");
require("firebase/firestore");
const data = require("../mrt_stations.json");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

firebase.initializeApp({
  apiKey: `${process.env.FIRESTORE_KEY}`,
  authDomain: "hawkercentral.firebaseapp.com",
  databaseURL: "https://hawkercentral.firebaseio.com",
  projectId: "hawkercentral",
  storageBucket: "hawkercentral.appspot.com",
  messagingSenderId: "596185831538",
  appId: "1:596185831538:web:9cbfb234d1fff146cf8aeb",
  measurementId: "G-Z220VNJFT9",
});

const db = firebase.firestore();

function capitalize_Words(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const addData = (data) => {
  let name;
  let line;
  let coords;
  data[0].data.allData.forEach((element) => {
    name = capitalize_Words(element[2].slice(0, -12));
    line = element[3];
    coords = element[0]["geometry"]["coordinates"];
    console.log(name, line, coords);
    db.collection("mrt")
      .add({
        name: name,
        station: line,
        coords: coords,
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        // alert("Sent")
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        // alert("Failed")
      });
  });
};

const addCuisine = (data) => {
  data.forEach((element) => {
    db.collection("cuisine")
      .add({
        label: element.charAt(0).toUpperCase() + element.slice(1),
        value: element,
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        // alert("Sent")
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        // alert("Failed")
      });
  });
};

const getDoc = async () => {
  await db
    .collection("hawkers")
    .doc("3XC0EDF2stjpBDVCGAFu")
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        console.log(snapshot.id);

        console.log(snapshot.data());
      }
      console.log("Fetched successfully!");
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
};

// getData()
// addData(data)

var cuisines = [
  "American",
  "Healthy",
  "Sandwiches",
  "Asian",
  "Indian",
  "Seafood",
  "Bakery and Cakes",
  "Indonesia",
  "Local",
  "Beverages",
  "Italian",
  "Sushi",
  "Burgers",
  "Japanese",
  "Thai",
  "Chicken",
  "Korean",
  "Vegetarian",
  "Vegan",
  "Chinese",
  "Malay",
  "Vietnamese",
  "Dessert",
  "Malaysian",
  "Western",
  "Fast Food",
  "Meat",
  "Halal",
  "Pizza",
];
// addCuisine(cuisines)

function addData3({
  url,
  image2,
  image3,
  image4,
  image5,
  image6,
  name,
  cuisine,
  postal,
  street,
  unit,
  description,
  description_detailed,
  north,
  south,
  east,
  west,
  islandwide,
  delivery,
  price,
  contact,
  latitude,
  longitude,
  call,
  whatsapp,
  sms,
  inperson,
  opening,
  closing,
}) {
  console.log(name);
}

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

let callPostal = (postal) => {
  return fetch(
    "https://developers.onemap.sg/commonapi/search?searchVal=" +
      postal +
      "&returnGeom=Y&getAddrDetails=Y"
  )
    .then(function (response) {
      return response.json();
    })
    .then(
      function (jsonResponse) {
        return jsonResponse["results"][0];
      },
      (error) => {
        console.log(error);
      }
    );
};

async function getPostal(postal) {
  return await callPostal(postal).then((data) => {
    return {
      street: data["ADDRESS"],
      longitude: data["LONGITUDE"],
      latitude: data["LATITUDE"],
    };
  });
}

const getData = async () => {
  await db
    .collection("hawkers")
    .get()
    .then((snapshot) => {
      snapshot.forEach(async (doc) => {
        if (doc.exists) {
          await db
            .collection("hawkers")
            .doc(doc.id)
            .update({
              menu: false,
              menuitem: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
              ],
              menuprice: [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
              ],
            });
        }
      });
      console.log("Fetched successfully!");
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
};

const changeData = async () => {
  await db
    .collection("hawkers")
    .get()
    .then((snapshot) => {
      snapshot.forEach(async (doc) => {
        if (doc.exists) {
          let postal = await getPostal(doc.data().postal);

          console.log(postal.latitude, postal.latitude);
          if (postal !== undefined) {
            await db
              .collection("hawkers")
              .doc(doc.id)
              .update({
                longitude: postal.longitude,
                latitude: postal.latitude,
              })
              .catch((error) => {
                console.log(error);
              });
          }
          // let opening = doc.data().opening.slice(0,1) === '\n' ? doc.data().opening.slice(1,doc.data().opening.length) === '\n':doc.data().opening
        }
      });
      console.log("Fetched successfully!");
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
};

// changeData();

const test = async () => {
  console.log(await getPostal(730366));
};

// changeData();

const retrieveData = async () => {
  let data = [];
  const csvWriter = createCsvWriter({
    path: "out.csv",
    header: [
      { id: "sms", title: "sms" },
      { id: "opening", title: "opening" },
      { id: "lastmodified", title: "lastmodified" },
      { id: "image3", title: "image3" },
      { id: "postal", title: "postal" },
      { id: "latitude", title: "latitude" },
      { id: "image6", title: "image6" },
      { id: "name", title: "name" },
      { id: "whatsapp", title: "whatsapp" },
      { id: "street", title: "street" },
      { id: "cuisine", title: "cuisine" },
      { id: "image4", title: "image4" },
      { id: "image5", title: "image5" },
      { id: "inperson", title: "inperson" },
      { id: "menuitem", title: "menuitem" },
      { id: "pickup_option", title: "pickup_option" },
      { id: "website", title: "website" },
      { id: "delivery_detail", title: "delivery_detail" },
      { id: "unit", title: "unit" },
      { id: "call", title: "call" },
      { id: "longitude", title: "longitude" },
      { id: "image2", title: "image2" },
      { id: "description", title: "description" },
      { id: "claps", title: "claps" },
      { id: "condition", title: "condition" },
      { id: "delivery", title: "delivery" },
      { id: "url", title: "url" },
      { id: "region", title: "region" },
      { id: "description_detail", title: "description_detail" },
      { id: "menuprice", title: "menuprice" },
      { id: "promo", title: "promo" },
      { id: "menu", title: "menu" },
      { id: "delivery_option", title: "delivery_option" },
      { id: "contact", title: "contact" },
      { id: "price", title: "price" },
    ],
  });
  await db
    .collection("hawkers")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.exists) {
          let temp = doc.data();
          temp["lastmodified"] = "";
          temp["cuisine"] = "";
          temp["menuprice"] = "";
          temp["menuitem"] = "";
          temp["region"] = "";
          temp["delivery"] = "";
          data.push(temp);
        }
      });
      console.log("Fetched successfully!");
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(data);
  csvWriter
    .writeRecords(data) // returns a promise
    .then(() => {
      console.log("...Done");
    })
    .catch((error) => {
      console.log(error);
    });
};

// retrieveData();

const moveData = () => {
  db.collection("hawkers")
    .get()
    .then((snapshot) => {
      snapshot.forEach(async (d) => {
        var data = d.data();
        data.postal = Number(data.postal);
        await db
          .collection("hawkers")
          .add(data)
          .then((snapshot) => {
            console.log(snapshot.id);
          });
      });
    });
};

// moveData();

const sendData = async () => {
  const query = {
    origin: "Blk 512 Woodlands Drive 14, Singapore 730512",
    destination: "Blk 510 Choa Chu Kang Street 51, Singapore 680510",
    cost: "$10",
    time: "5:30PM",
    requester_mobile: "+6591111111",
  };
  let urls = [
    "https://asia-east2-hawkercentral.cloudfunctions.net/telegramDevSend",
  ];
  try {
    Promise.all(
      urls.map((url) =>
        fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log(error);
            return error;
          })
      )
    ).then((data) => {
      // window.location.reload();
    });
  } catch (error) {
    return error;
  }
};

const updateData = () => {
  db.collection("hawkers").doc("").update({});
};

const syncTake = async () => {
  var take_keys = [];
  var take_data = [];

  const url = "";

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

  await db
    .collection("hawkers")
    .get()
    .then((snapshot) => {
      snapshot.forEach(async (d) => {
        var data_contact = "65" + d.data().contact;
        // var hasTakesgDescription = d
        //   .data()
        //   .description_detail.includes("Contributed by take.sg");
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
              delivery_detail: delivery_detail,
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
};

// updateData();
syncTake();


const firebase = require("firebase");
require("firebase/firestore");
const data = require('../mrt_stations.json')

firebase.initializeApp({
    apiKey: `${process.env.FIRESTORE_KEY}`,
    authDomain: "hawkercentral.firebaseapp.com",
    databaseURL: "https://hawkercentral.firebaseio.com",
    projectId: "hawkercentral",
    storageBucket: "hawkercentral.appspot.com",
    messagingSenderId: "596185831538",
    appId: "1:596185831538:web:9cbfb234d1fff146cf8aeb",
    measurementId: "G-Z220VNJFT9"
  });


const db = firebase.firestore();

function capitalize_Words(str)
{
 return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

const addData = (data) => {
    let name
    let line
    let coords
    data[0].data.allData.forEach(element => {
        name = capitalize_Words(element[2].slice(0,-12))
        line = element[3]
        coords = element[0]['geometry']['coordinates']
        console.log(name,line,coords)
        db.collection("mrt").add({
            name:name,
            station:line,
            coords:coords
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            // alert("Sent")
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            // alert("Failed")
        });
    });
  }

    const addCuisine = (data) => {

    data.forEach(element => {
        db.collection("cuisine").add({
            label: element.charAt(0).toUpperCase() + element.slice(1),
            value: element
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            // alert("Sent")
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            // alert("Failed")
        });
    });

  }


const getData = async () =>{
    await db.collection("hawkers")
      .limit(1)
        .get().then(snapshot=>{
        snapshot.forEach((doc) => {
          if (doc.exists){
            console.log(doc.id)
            console.log(doc.data())
            }
          }
        );
        console.log("Fetched successfully!")
        return true
      }
    ).catch(error => {
      console.log(error)
      }
    )
}

const getDoc = async () =>{
  await db.collection('hawkers').doc('3XC0EDF2stjpBDVCGAFu')
      .get().then(snapshot=>{
        if(snapshot.exists){
          console.log(snapshot.id)

          console.log(snapshot.data())
        }
      console.log("Fetched successfully!")
      return true
    }
  ).catch(error => {
    console.log(error)
    }
  )
}

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
    "Pizza"
]
// addCuisine(cuisines)


const addData2 = async () =>{
  await db.collection("hawkers")
      .add(
        {
          name:"hi"
        }
      ).then(snapshot=>{
      snapshot.forEach((doc) => {
        if (doc.exists){
          console.log(doc.id)
          console.log(doc.data())
          }
        }
      );
      console.log("Fetched successfully!")
      return true
    }
  ).catch(error => {
    console.log(error)
    }
  )
}

function addData3 ({
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
  closing
}){
  console.log(name)
}

addData3({name:"hello"})
// console.log(new Date())
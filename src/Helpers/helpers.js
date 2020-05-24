import emailjs from "emailjs-com";
import { db } from "../Components/Firestore";
/**
 * compare two values and returns true if match else false
 * @param str1
 * @param str2
 */
function compareString(str1, str2) {
  if (typeof str1 !== typeof undefined && typeof str2 !== typeof undefined) {
    if (String(str1).toLowerCase() === String(str2).toLowerCase()) {
      return true;
    }
  }
  return false;
}

/**
 * capitalize all first letters of sentence
 * @param words
 * @returns {string}
 */
function capitalizeFirstLetter(sentence) {
  const words = sentence.split(" ");
  for (var i = 0; i < words.length; i++) {
    var j = words[i].charAt(0).toUpperCase();
    words[i] = j + words[i].substr(1);
  }
  return words.join(" ");
}

/**
 * Unpack a Firebase QuerySnapshot and extract its documents
 * @param {firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>} snapshot - the query result
 * @returns {firebase.firestore.DocumentData[]} an array of Firestore documents,
 * each injected with the field `id`, equivalent to `docid`
 */
function mapSnapshotToDocs(snapshot) {
  const data = [];
  snapshot.forEach((doc) => {
    if (doc.exists) {
      const temp = doc.data();
      temp.id = doc.id;
      data.push(temp);
    }
  });
  return data;
}

/**
 * Sends an email to notify of a proposed change to a listform
 * @param docId - document id as assigned in Firebase
 * @param originalName - the original name of the store in the listing
 * @param actionWord - the proposed change made to the listing
 * @param listformFields - listform fields with proposed edits
 */
async function sendEmailToUpdateListing(
  docId,
  originalName,
  actionWord,
  listformFields
) {
  const EMAIL_API_KEY = `${process.env.REACT_APP_EMAIL_API_KEY}`;
  const email_params = {
    listing_id: docId,
    listing_name: originalName,
    action_word: actionWord,
  };

  if (actionWord === "edit") {
    email_params["description"] =
      "A user has requested to edit this listing to:";
    email_params["message"] = JSON.stringify(listformFields, null, 2);
  } else if (actionWord === "delete") {
    email_params["description"] =
      "A user has requested to delete this listing.";
  }

  await emailjs
    .send("outlook", "contact_form", email_params, EMAIL_API_KEY)
    .then(
      (result) => {
        console.log(result);
        return result;
      },
      (error) => {
        console.log(error);
        return error;
      }
    );
}

async function getLatLng(postal) {
  return fetch(
    "https://developers.onemap.sg/commonapi/search?searchVal=" +
      postal +
      "&returnGeom=Y&getAddrDetails=Y"
  )
    .then(function (response) {
      return response.json();
    })
    .then(
      (jsonResponse) => {
        if (
          jsonResponse !== undefined &&
          jsonResponse["results"] !== undefined
        ) {
          return jsonResponse["results"][0];
        }
      },
      (error) => {
        console.log(error);
      }
    );
}

async function getPlanningArea(postal_lat, postal_lon) {
  let result = await getOneMapToken();
  let key = result.key;
  return fetch(
    "https://developers.onemap.sg/privateapi/popapi/getPlanningarea?token=" +
      key +
      "&lat=" +
      postal_lat +
      "&lng=" +
      postal_lon
  )
    .then(function (response) {
      return response.json();
    })
    .then(
      function (jsonResponse) {
        if (jsonResponse !== undefined && jsonResponse[0] !== undefined) {
          return jsonResponse[0].pln_area_n;
        }
      },
      (error) => {
        console.log(error);
      }
    );
}

async function requestNewOneMapToken() {
  let urls = [
    "https://asia-east2-hawkercentral.cloudfunctions.net/requestOneMap",
  ];
  try {
    return Promise.all(
      urls.map((url) =>
        fetch(url, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
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
    );
  } catch (error) {
    return error;
  }
}

async function getPlanningDetails(from, to) {
  // change the naming for start to match those in our files
  var sentosa = false;
  if (["ORCHARD", "NEWTON"].includes(from)) {
    from = "Orchardnewton";
  } else if (
    ["OUTRAM", "SINGAPORE RIVER", "MUSEUM", "RIVER VALLEY"].includes(from)
  ) {
    from = "DHOBY";
  } else if (
    ["MARINA SOUTH", "DOWNTOWN CORE", "STRAITS VIEW", "MARINA EAST"].includes(
      from
    )
  ) {
    from = "DOWNTOWN";
  }
  if (from === "WESTERN WATER CATCHMENT") from = "JURONG WEST";
  if (from === "SOUTHERN ISLANDS") {
    sentosa = true;
    from = "BUKIT MERAH";
  }

  if (["ORCHARD", "NEWTON"].includes(to)) {
    to = "Orchardnewton";
  } else if (
    ["OUTRAM", "SINGAPORE RIVER", "MUSEUM", "RIVER VALLEY"].includes(to)
  ) {
    to = "DHOBY";
  } else if (
    ["MARINA SOUTH", "DOWNTOWN CORE", "STRAITS VIEW", "MARINA EAST"].includes(
      to
    )
  ) {
    to = "DOWNTOWN";
  }
  if (to === "WESTERN WATER CATCHMENT") to = "JURONG WEST";
  if (to === "SOUTHERN ISLANDS") {
    sentosa = true;
    to = "BUKIT MERAH";
  }

  let data = await db
    .collection("delivery_price")
    .doc(from)
    .get()
    .then(async (d) => {
      return d.data();
    });
  if (data && data[to]) {
    var price = data[to].price;
    if (sentosa) {
      price = String(Number(price) + 2);
    }
    return price;
  } else {
    return null;
  }
}

function getOneMapToken() {
  return db
    .collection("etc")
    .doc("onemap")
    .get()
    .then(async (snapshot) => {
      const now = new Date();
      const expiry = new Date(snapshot.data().expiry * 1000);
      if (expiry - now < 0) {
        const newQuery = await requestNewOneMapToken();
        const newToken = newQuery[0].access_token;
        const newExpiry = newQuery[0].expiry_timestamp;
        snapshot.ref.update({ expiry: newExpiry, key: newToken });
      }
      return snapshot.data();
    });
}

var postalPlanningRegion = async (postal, lat, lng) => {
  try {
    let postal_lat;
    let postal_lon;
    let postal_addressdetails;
    if (!lat || !lng) {
      postal_addressdetails = await getLatLng(postal);
      postal_lat = postal_addressdetails["LATITUDE"];
      postal_lon = postal_addressdetails["LONGITUDE"];
    } else {
      postal_lat = lat;
      postal_lon = lng;
    }
    var planningarea = await getPlanningArea(postal_lat, postal_lon);
    if (["ORCHARD", "NEWTON"].includes(planningarea)) {
      planningarea = "Orchardnewton";
    } else if (
      ["OUTRAM", "SINGAPORE RIVER", "MUSEUM", "RIVER VALLEY"].includes(
        planningarea
      )
    ) {
      planningarea = "DHOBY";
    } else if (
      ["MARINA SOUTH", "DOWNTOWN CORE", "STRAITS VIEW", "MARINA EAST"].includes(
        planningarea
      )
    ) {
      planningarea = "DOWNTOWN";
    }

    let districtpostal = Number(String(postal).slice(0, 2));
    let centrallist =
      ["01", "02", "03", "04", "05", "06", "07", "08", "09"] +
      [
        14,
        15,
        16,
        10,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        58,
        59,
        58,
        59,
        77,
        78,
      ];
    let eastlist = [42, 43, 44, 45, 46, 47, 48, 49, 50, 81, 51, 52];
    let westlist = [11, 12, 13, 60, 61, 62, 63, 64, 65, 66, 67, 68];
    let northlist = [69, 70, 71, 72, 73, 75, 76];
    let northeastlist = [53, 54, 55, 82, 56, 57, 79, 80];
    var region;
    if (centrallist.includes(districtpostal)) {
      region = "Central";
    } else if (eastlist.includes(districtpostal)) {
      region = "East";
    } else if (westlist.includes(districtpostal)) {
      region = "West";
    } else if (northlist.includes(districtpostal)) {
      region = "North";
    } else if (northeastlist.includes(districtpostal)) {
      region = "Northeast";
    }
  } catch (err) {
    console.log(err);
    planningarea = "cannot be found";
    region = "cannot be found";
  }
  return { planningarea: planningarea, region: region };
};

export default {
  compareString,
  capitalizeFirstLetter,
  mapSnapshotToDocs,
  sendEmailToUpdateListing,
  postalPlanningRegion,
  getLatLng,
  getPlanningDetails,
};

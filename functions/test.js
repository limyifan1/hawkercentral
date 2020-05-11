// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
const fs = require('fs');
const path = require("path");

// TODO: Change this to dev environment
const TEST_FIREBASE_PROJECT_ID = "hawkercentral-fork";

// TODO: Change this to your real Firebase Project ID
const REAL_FIREBASE_PROJECT_ID = "hawkercentral-fork";

const firebase = require("@firebase/testing");

const foodLehDummyData = {
  name: "test 123",
  postal: 760777,
  street: "",
  price: "",
  description: "",
  description_detail: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
  image5: "",
  image6: "",
  imageFile1: "",
  imageFile2: "",
  imageFile3: "",
  imageFile4: "",
  imageFile5: "",
  imageFile6: "",
  imageName: "Upload Image",
  longitude: 103.8198,
  latitude: 1.3521,
  unit: "",
  delivery_option: false,
  pickup_option: true,
  delivery: [],
  cuisineValue: [],
  call: false,
  whatsapp: false,
  sms: false,
  inperson: false,
  contact: 96665555,
  docid: "",
  opening: "",
  region: [],
  website: "",
  promo: "",
  condition: "",
  delivery_detail: "",
  menu: false,
  menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  wechatid: "",
};

const foodLehAuth = {
  uid: "FoodLeh",
  email: "foodleh@example.com"
};

before(async () => {
  // Load the content of the "firestore.rules" file into the emulator before running the
  // test suite. This is necessary because we are using a fake Project ID in the tests,
  // so the rules "hot reloading" behavior which works in the Web App does not apply here.
  const rulesContent = fs.readFileSync(path.resolve(__dirname, "../firestore.rules"));
  await firebase.loadFirestoreRules({
    projectId: TEST_FIREBASE_PROJECT_ID,
    rules: rulesContent
  });
});

after(() => {
  firebase.apps().forEach(app => app.delete());
});

// Unit test the security rules
//#region Test if data can be created with the correct fields
describe("hawkers", () => {

  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: foodLehAuth
  }).firestore();

  after(() => {
    // Clear data from the emulator
    firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('can be created with fields', async () => {
    await firebase.assertSucceeds(db.collection("hawkers").doc().set({
        name: "test 123",
        postal: 760777,
        street: "",
        price: "",
        description: "",
        description_detail: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        image6: "",
        imageFile1: "",
        imageFile2: "",
        imageFile3: "",
        imageFile4: "",
        imageFile5: "",
        imageFile6: "",
        imageName: "Upload Image",
        longitude: 103.8198,
        latitude: 1.3521,
        unit: "",
        delivery_option: false,
        pickup_option: true,
        delivery: [],
        cuisineValue: [],
        call: false,
        whatsapp: false,
        sms: false,
        inperson: false,
        contact: 96665555,
        docid: "",
        opening: "",
        region: [],
        website: "",
        promo: "",
        condition: "",
        delivery_detail: "",
        menu: false,
        menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        wechatid: "",
      }));
  });
});
//#endregion

//#region Test if operation fails if there are missing fields
describe("hawkers", async () => {
  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: foodLehAuth
  }).firestore();

  before(async () => {
    const admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID
    }).firestore();

  });

  after(() => {
    // Clear data from the emulator
    firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it("cannot be set with missing fields", async () => {
    await firebase.assertFails(db.collection("hawkers").doc().set({
        name: "test 123",
        postal: 760777,
        street: "",
        price: "",
        description: "",
        description_detail: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        image6: "",
        imageFile1: "",
        imageFile2: "",
        imageFile3: "",
        imageFile4: "",
        imageFile5: "",
        imageFile6: "",
        imageName: "Upload Image",
        longitude: 103.8198,
        latitude: 1.3521,
        unit: "",
        delivery_option: false,
        pickup_option: true,
        delivery: [],
        cuisineValue: [],
        call: false,
        whatsapp: false,
        sms: false,
        inperson: false,
        contact: 96665555,
        docid: "",
        opening: "",
        region: [],
        website: "",
        promo: "",
      }));
  });
});
//#endregion

//#region test if operation fails if phone number is invalid
describe("hawkers", async () => {
    const db = firebase.initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: foodLehAuth
    }).firestore();
  
    before(async () => {
      const admin = firebase.initializeAdminApp({
        projectId: TEST_FIREBASE_PROJECT_ID
      }).firestore();
  
    });
  
    after(() => {
      // Clear data from the emulator
      firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
    });
  
    it("cannot be set with invalid contact number", async () => {
      await firebase.assertFails(db.collection("hawkers").doc().set({
        name: "test 123",
        postal: 760777,
        street: "",
        price: "",
        description: "",
        description_detail: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        image6: "",
        imageFile1: "",
        imageFile2: "",
        imageFile3: "",
        imageFile4: "",
        imageFile5: "",
        imageFile6: "",
        imageName: "Upload Image",
        longitude: 103.8198,
        latitude: 1.3521,
        unit: "",
        delivery_option: false,
        pickup_option: true,
        delivery: [],
        cuisineValue: [],
        call: false,
        whatsapp: false,
        sms: false,
        inperson: false,
        contact: 12345678,
        docid: "",
        opening: "",
        region: [],
        website: "",
        promo: "",
        condition: "",
        delivery_detail: "",
        menu: false,
        menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        wechatid: "",
        }));
    });
  });
//#endregion

//#region test contact number can be set with 0
describe("hawkers", async () => {
  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: foodLehAuth
  }).firestore();

  before(async () => {
    const admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID
    }).firestore();

  });

  after(() => {
    // Clear data from the emulator
    firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it("contact can be set with 0", async () => {
    await firebase.assertFails(db.collection("hawkers").doc().set({
      name: "test 123",
      postal: 760777,
      street: "",
      price: "",
      description: "",
      description_detail: "",
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      image6: "",
      imageFile1: "",
      imageFile2: "",
      imageFile3: "",
      imageFile4: "",
      imageFile5: "",
      imageFile6: "",
      imageName: "Upload Image",
      longitude: 103.8198,
      latitude: 1.3521,
      unit: "",
      delivery_option: false,
      pickup_option: true,
      delivery: [],
      cuisineValue: [],
      call: false,
      whatsapp: false,
      sms: false,
      inperson: false,
      contact: 0,
      docid: "",
      opening: "",
      region: [],
      website: "",
      promo: "",
      condition: "",
      delivery_detail: "",
      menu: false,
      menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      wechatid: "",
      }));
  });
});
//#endregion
  
//#region test if data in /hawkers can be read by anyone
describe("hawkers", async () => {
  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: foodLehAuth
  }).firestore();

  before(async () => {
    const admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID
    }).firestore();

    // Create dummy data for read
    const hawkerRef = admin.collection("hawkers");
    await hawkerRef.doc().set({
        name: "" + Math.random(),
        postal: "" + Math.random(),
        street: "",
        price: "",
        description: "",
        description_detail: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        image6: "",
        imageFile1: "",
        imageFile2: "",
        imageFile3: "",
        imageFile4: "",
        imageFile5: "",
        imageFile6: "",
        imageName: "Upload Image",
        longitude: 103.8198,
        latitude: 1.3521,
        unit: "",
        delivery_option: false,
        pickup_option: true,
        delivery: [],
        cuisineValue: [],
        call: false,
        whatsapp: false,
        sms: false,
        inperson: false,
        contact: "",
        docid: "",
        opening: "",
        region: [],
        website: "",
        promo: "",
        condition: "",
        delivery_detail: "",
        menu: false,
        menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        wechatid: "",
      });

  });

  after(() => {
    // Clear data from the emulator
    firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it("can be read anyone", async () => {
    await firebase.assertSucceeds(db.collection('hawkers').get());
  });
});
//#endregion


//#region test if data can be set with an arbitrary field
describe("hawkers", async () => {
  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: foodLehAuth
  }).firestore();

  before(async () => {
    const admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID
    }).firestore();

  });

  after(() => {
    // Clear data from the emulator
    firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it("cannot be set with an extra field", async () => {
    await firebase.assertFails(db.collection("hawkers").doc().set({
      name: "test 123",
      postal: 760777,
      street: "",
      price: "",
      description: "",
      description_detail: "",
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      image6: "",
      imageFile1: "",
      imageFile2: "",
      imageFile3: "",
      imageFile4: "",
      imageFile5: "",
      imageFile6: "",
      imageName: "Upload Image",
      longitude: 103.8198,
      latitude: 1.3521,
      unit: "",
      delivery_option: false,
      pickup_option: true,
      delivery: [],
      cuisineValue: [],
      call: false,
      whatsapp: false,
      sms: false,
      inperson: false,
      contact: 12345678,
      docid: "",
      opening: "",
      region: [],
      website: "",
      promo: "",
      condition: "",
      delivery_detail: "",
      menu: false,
      menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      wechatid: "",
      test_extra_data : "",
      }));
  });
});
//#endregion


//#region test if data can be set without the required fields
describe("hawkers", async () => {
  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: foodLehAuth
  }).firestore();

  before(async () => {
    const admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID
    }).firestore();

  });

  after(() => {
    // Clear data from the emulator
    firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it("cannot be set without required fields", async () => {
    await firebase.assertFails(db.collection("hawkers").doc().set({
      street: "",
      price: "",
      description: "",
      description_detail: "",
      image1: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      image6: "",
      imageFile1: "",
      imageFile2: "",
      imageFile3: "",
      imageFile4: "",
      imageFile5: "",
      imageFile6: "",
      imageName: "Upload Image",
      longitude: 103.8198,
      latitude: 1.3521,
      unit: "",
      delivery_option: false,
      pickup_option: true,
      delivery: [],
      cuisineValue: [],
      call: false,
      whatsapp: false,
      sms: false,
      inperson: false,
      docid: "",
      opening: "",
      region: [],
      website: "",
      promo: "",
      condition: "",
      delivery_detail: "",
      menu: false,
      menuitem: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      menuprice: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      wechatid: "",
      test_extra_data : "",
      }));
  });
});
//#endregion
// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import "react-image-gallery/styles/css/image-gallery.css";
import "./App.css";
// import 'react-bootstrap-typeahead/css/Typeahead.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Components from "./Components";
import Cookies from "universal-cookie";
import en from "./assets/translations/en.json";
import zh from "./assets/translations/zh.json";
import { LanguageContext, CartContext } from "./Components/themeContext";
import { Helmet } from "react-helmet";
import { ThemeProvider } from "@material-ui/styles";
import { db, storage } from "./Components/Firestore";
import { createMuiTheme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import { SnackbarProvider } from "notistack";
import update from "immutability-helper";
import Jimp from "jimp";
import Button from "@material-ui/core/Button";
const time_now = new Date();

time_now.setMinutes(time_now.getMinutes());

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#F0AE00",
      main: "#b48300",
      dark: "#b48300",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#ffffff",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: '"Open Sans", "Roboto", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
});

const cookies = new Cookies();
if (cookies.get("language") === null || cookies.get("language") === undefined) {
  cookies.set("language", "en", { path: "/" });
}

const notistackRef = React.createRef();
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key);
};

const arraysMatch = function (arr1, arr2) {
  // Check if the arrays are the same length

  if (!arr1 && !arr2) return true;

  if (arr1 && !arr2) return false;

  if (!arr1 && arr2) return false;

  if (arr1.length !== arr2.length) return false;

  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  // Otherwise, return true
  return true;
};

// {/* This will only be useful if we convert to server-side rendering ie not CRA */}
function SeoHelmet() {
  const description =
    "Save our local F&B! FoodLeh? is a nonprofit crowdsourced hawker directory relying on Singaporeans to share information about our local F&B places.";
  const url = "https://www.foodleh.app/";
  const keywords = "hawker food delivery and dabao Singapore circuit breaker";
  const image_url =
    "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/foodleh.png?alt=media&token=3fce2813-7eba-4e5a-8cbe-47119c1512f9";
  const home_url =
    "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/homepage.png?alt=media&token=93f830c3-b6fa-4311-bf43-8168de5d580a";
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>FoodLeh?</title>
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" href={image_url} sizes="16x16" />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      <meta name="og:image" content={home_url} />
      <meta name="keywords" content={keywords} />
      {/* Facebook meta tags */}
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={home_url} />
      <meta property="fb:pages" content="108930167461424"></meta>
      <meta property="ia:markup_url" content={url}></meta>
    </Helmet>
  );
}

// {/* This will only be useful if we convert to server-side rendering ie not CRA */}
function PersonalHelmet(props) {
  const description =
    "Save our local F&B! FoodLeh? is a nonprofit crowdsourced hawker directory relying on Singaporeans to share information about our local F&B places.";
  const url = "https://www.foodleh.app/";
  const keywords = "hawker food delivery and dabao Singapore circuit breaker";
  const image_url = props.logo
    ? props.logo
    : "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/foodleh.png?alt=media&token=3fce2813-7eba-4e5a-8cbe-47119c1512f9";
  const home_url =
    "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/homepage.png?alt=media&token=93f830c3-b6fa-4311-bf43-8168de5d580a";
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{props.name}</title>
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" href={image_url} sizes="16x16" />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      <meta name="og:image" content={home_url} />
      <meta name="keywords" content={keywords} />
      {/* Facebook meta tags */}
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={home_url} />
      <meta property="fb:pages" content="108930167461424"></meta>
      <meta property="ia:markup_url" content={url}></meta>
    </Helmet>
  );
}

const getPage = () => {
  let host = window.location.host;
  let isDev = host.includes("localhost");
  let splitHost = host.split(".");
  let pageName;
  let hostName;
  if ((isDev && splitHost.length === 2) || (!isDev && splitHost.length === 3)) {
    pageName = splitHost[0];
    hostName = splitHost[splitHost.length - 1];
  }
  return { pageName: pageName, hostName: hostName };
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleLanguage = () => {
      console.log("toggleLanguage");
      console.log(this.state.language);
      if (this.state.language === "en") {
        cookies.set("language", "zh", { path: "/" });
        // update data for itself and state so other components know as well
        this.setState({
          data: zh,
          language: "zh",
          toggleLanguage: this.toggleLanguage,
        });
      } else {
        cookies.set("language", "en", { path: "/" });
        // update data for itself and state so other components know as well
        this.setState({
          data: en,
          language: "en",
          toggleLanguage: this.toggleLanguage,
        });
      }
    };

    this.changeField = (event) => {
      event.preventDefault();
      const target = event.currentTarget.id;
      const targetField = target.substring(0, target.indexOf("-"));
      const targetId = target.substring(target.indexOf("-") + 1);
      const value = event.target.value;
      this.setState({
        updated: false,
      });
      if (targetField === "image") {
        const image = event.target.files[0];
        this.handleImageAsFile(targetId, image, targetField);
      } else if (targetField === "delete") {
        this.deleteMenuItem(targetId);
      } else if (targetField.includes("addonname")) {
        const addonId = targetField.substring(target.indexOf("+") + 1);
        console.log(addonId, targetId, value);
        this.setState({
          pageData: update(this.state.pageData, {
            menu_combined: {
              [targetId]: { addon: { [addonId]: { name: { $set: value } } } },
            },
          }),
        });
      } else if (targetField.includes("addonprice")) {
        const addonId = targetField.substring(target.indexOf("+") + 1);
        this.setState({
          pageData: update(this.state.pageData, {
            menu_combined: {
              [targetId]: { addon: { [addonId]: { price: { $set: value } } } },
            },
          }),
        });
      } else {
        this.setState({
          pageData: update(this.state.pageData, {
            menu_combined: { [targetId]: { [targetField]: { $set: value } } },
          }),
        });
      }
    };

    this.changeColor = (color, id) => {
      this.setState({
        updated: false,
        css: update(this.state.css, {
          [id]: { $set: color },
        }),
      });
    };

    this.changePage = (event) => {
      event.preventDefault();
      const target = event.currentTarget.id;
      const value = event.target.value;
      this.setState({
        updated: false,
        [target]: value,
      });
    };

    this.changeDelivery = (event) => {
      event.preventDefault();
      const target = event.currentTarget.name;
      const value = event.target.value;
      this.setState({
        updated: false,
        [target]: value,
      });
    };

    this.changeDistance = (event) => {
      event.preventDefault();
      const target = event.currentTarget.id;
      const targetId = target.substring(target.indexOf("-") + 1);
      const value = event.target.value;
      this.setState({
        updated: false,
      });
      this.setState({
        tiered_delivery: update(this.state.tiered_delivery, {
          [targetId]: { $set: value },
        }),
      });
    };

    this.changeInfo = (event) => {
      event.preventDefault();
      const target = event.currentTarget.id;
      const value = event.target.value;
      this.setState({
        updated: false,
      });
      if (target === "logo" || target === "cover") {
        const image = event.target.files[0];
        this.handleImageAsFile(null, image, target);
      } else {
        this.setState({
          pageData: update(this.state.pageData, {
            [target]: { $set: value },
          }),
        });
      }
    };

    this.addMenuItem = () => {
      this.setState({
        updated: false,
      });
      return this.setState({
        pageData: update(this.state.pageData, {
          menu_combined: {
            $push: [
              {
                name: "",
                price: 0,
                pic: "",
              },
            ],
          },
        }),
      });
    };

    this.addAddon = (event) => {
      this.setState({
        updated: false,
      });
      const target = event.currentTarget.id;
      const targetId = target.substring(target.indexOf("-") + 1);
      if (this.state.pageData.menu_combined[targetId].addon) {
        this.setState({
          pageData: update(this.state.pageData, {
            menu_combined: {
              [targetId]: {
                addon: {
                  $push: [
                    {
                      name: "",
                      price: 0,
                    },
                  ],
                },
              },
            },
          }),
        });
      } else {
        this.setState({
          pageData: update(this.state.pageData, {
            menu_combined: {
              [targetId]: {
                addon: {
                  $set: [
                    {
                      name: "",
                      price: 0,
                    },
                  ],
                },
              },
            },
          }),
        });
      }
    };

    this.deleteAddon = (event) => {
      this.setState({
        updated: false,
      });
      const target = event.currentTarget.id;
      const targetId = target.substring(target.indexOf("-") + 1);
      console.log(target, targetId);
      return this.setState({
        pageData: update(this.state.pageData, {
          menu_combined: {
            [targetId]: {
              addon: {
                $splice: [
                  [
                    this.state.pageData.menu_combined[targetId].addon.length -
                      1,
                  ],
                ],
              },
            },
          },
        }),
      });
    };

    this.deleteMenuItem = (index) => {
      this.setState({
        updated: false,
      });
      this.setState({
        pageData: update(this.state.pageData, {
          menu_combined: {
            $splice: [[index, 1]],
          },
        }),
      });
    };

    this.addProduct = (productIndex, addon) => {
      let findElement;
      console.log(addon);
      var addons = [];

      if (addon) {
        addon.forEach((element) => {
          if (element.checked) {
            addons.push(element.index);
          }
        });
      }

      this.state.cartProducts.forEach((element, index) => {
        if (element.index === productIndex && arraysMatch(addon, element.addon))
          findElement = { element, index };
      });

      if (findElement) {
        const newElement = findElement.element;
        newElement.quantity += 1;
        if (addons.length > 0) {
          newElement.addons = [...addons];
        }
        this.state.cartProducts[findElement.index] = newElement;
      } else {
        this.state.cartProducts.push({
          index: productIndex,
          quantity: 1,
          addons: addons,
        });
      }
      var newPageData = this.state.pageData;
      newPageData.menu_combined[productIndex].quantity = newPageData
        .menu_combined[productIndex].quantity
        ? (newPageData.menu_combined[productIndex].quantity += 1)
        : (newPageData.menu_combined[productIndex].quantity = 1);
      this.setState({
        // cartTotal: {
        //   productQuantity: this.state.cartTotal.productQuantity + 1,
        //   totalPrice:
        //     Math.round(
        //       (this.state.cartTotal.totalPrice +
        //         Number(this.state.pageData.menu_combined[productIndex].price) +
        //         Number.EPSILON) *
        //         100
        //     ) / 100,
        // },
        pageData: newPageData,
      });
      this.updateCart();
      console.log(this.state);
    };

    this.removeProduct = (productIndex, cartIndex) => {
      let cartElement = this.state.cartProducts[cartIndex];

      // let findElement;
      // this.state.cartProducts.forEach((element, index) => {
      //   if (element.index === productIndex) findElement = { element, index };
      // });

      const newElement = cartElement;
      newElement.quantity -= 1;
      // this.state.cartProducts[findElement.index] = newElement;
      this.setState({
        cartProducts: update(this.state.cartProducts, {
          [cartIndex]: { $set: newElement },
        }),
      });
      if (newElement.quantity === 0) {
        let cartProductsCopy = this.state.cartProducts.slice();
        cartProductsCopy.splice(cartIndex, 1);
        this.setState({
          cartProducts: update(this.state.cartProducts, {
            $set: cartProductsCopy,
          }),
        });
      }

      var newPageData = this.state.pageData;
      newPageData.menu_combined[productIndex].quantity = newPageData
        .menu_combined[productIndex].quantity
        ? (newPageData.menu_combined[productIndex].quantity -= 1)
        : (newPageData.menu_combined[productIndex].quantity = 0);
      this.setState({
        // cartTotal: {
        //   productQuantity: this.state.cartTotal.productQuantity - 1,
        //   totalPrice:
        //     Math.round(
        //       (this.state.cartTotal.totalPrice -
        //         Number(this.state.pageData.menu_combined[productIndex].price) +
        //         Number.EPSILON) *
        //         100
        //     ) / 100,
        // },
        pageData: newPageData,
      });
      this.updateCart();
    };

    this.updateCart = () => {
      var productQuantity = 0;
      var totalPrice = 0;
      this.state.cartProducts.forEach((element) => {
        var addonsTotal = 0;
        if (element.addons) {
          element.addons.forEach((addonElement, index) => {
            addonsTotal += Number(
              this.state.pageData.menu_combined[element.index].addon[
                addonElement
              ].price
            );
          });
        }
        console.log(addonsTotal);

        if (element.quantity !== 0) {
          productQuantity += element.quantity;
          totalPrice +=
            Number(
              Number(this.state.pageData.menu_combined[element.index].price) +
                addonsTotal
            ) * element.quantity;
        }
      });

      this.setState({
        cartTotal: {
          productQuantity: productQuantity,
          totalPrice: totalPrice,
        },
      });
    };

    this.setScrollPosition = (pos) => {
      console.log("setScrollPosition");
      this.setState({
        scrollPosition: pos,
      });
    };

    this.addDistance = (distance) => {
      const tier = this.state.tiered_delivery;
      var delivery_fee;
      if (distance < 5000) {
        delivery_fee = tier["5km"];
      } else if (distance < 10000) {
        delivery_fee = tier["10km"];
      } else if (distance < 15000) {
        delivery_fee = tier["15km"];
      } else if (distance < 20000) {
        delivery_fee = tier["20km"];
      } else if (distance < 25000) {
        delivery_fee = tier["25km"];
      } else {
        delivery_fee = tier["30km"];
      }

      this.setState({
        delivery_fee: delivery_fee,
        distance: distance,
      });
      console.log(distance);
    };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      language: cookies.get("language"), // TODO: check why this is hardcoded
      changePromocode: this.changePromocode,
      toggleLanguage: this.toggleLanguage,
      addProduct: this.addProduct,
      removeProduct: this.removeProduct,
      changeField: this.changeField,
      addCustomerDetails: this.addCustomerDetails,
      changeChannel: this.changeChannel,
      toggleDialog: this.toggleDialog,
      addDistance: this.addDistance,
      data: cookies.get("language") === "en" ? en : zh,
      scrollPosition: 0, // tracks scroll position of Search page
      setScrollPosition: this.setScrollPosition,
      pageName: "",
      hostName: "",
      pageData: {},
      css: {},
      retrieved: false,
      cartProducts: [],
      cartTotal: {
        productQuantity: 0,
        totalPrice: 0,
      },
      updating: false,
      updated: true,
      channel: "",
      channelDialog: false,
      customerDetails: {
        name: "",
        address: "",
        notes: "",
        customerNumber: "",
        deliveryTime: "",
        unit: "",
        street: "",
        postal: "",
        time: time_now.getHours() + ":" + time_now.getMinutes(),
        date: time_now,
        datetime: time_now,
      },
      delivery_fee: "0",
      fixed_delivery: 0,
      all_promo: 0,
      selfcollect_promo: 0,
      delivery_option: "none",
      tiered_delivery: {
        "5km": 0,
        "10km": 0,
        "15km": 0,
        "20km": 0,
        "25km": 0,
        "30km": 0,
      },
      promo_code: "",
    };
    this.handleFireBaseUpload = this.handleFireBaseUpload.bind(this);
    this.handleImageAsFile = this.handleImageAsFile.bind(this);
  }

  componentWillMount() {
    const pageName = getPage().pageName;
    const hostName = getPage().hostName;
    if (
      pageName &&
      pageName !== "www" &&
      pageName !== "foodleh" &&
      hostName !== "sh" &&
      hostName !== "now" &&
      hostName !== "now.sh"
    )
      this.getDoc();
  }

  addCustomerDetails = (field, value) => {
    var newDetail = this.state.customerDetails;
    newDetail[field] = value;
    this.setState({
      customerDetails: newDetail,
    });
  };

  changePromocode = (event) => {
    const value = event.target.value;
    this.setState({
      promo_code_input: value,
    });
    if (this.state.promo_code && value === this.state.promo_code) {
      this.setState({
        promo_code_valid: true,
      });
    } else {
      this.setState({
        promo_code_valid: false,
      });
    }
  };

  changeChannel = (channel) => {
    var delivery_fee;
    if (channel === "delivery") {
      if (this.state.delivery_option === "fixed")
        delivery_fee = this.state.fixed_delivery;
    } else {
      delivery_fee = 0;
    }
    this.setState({
      channel: channel,
      delivery_fee: delivery_fee,
    });
  };

  toggleDialog = () => {
    this.setState({
      channelDialog: !this.state.channelDialog,
    });
  };

  handleImageAsFile = (targetId, image, targetField) => {
    if (image !== undefined) {
      var date = new Date();
      var timestamp = date.getTime();
      var newName = timestamp + "_" + image.name;
      var reader = new FileReader();
      reader.readAsArrayBuffer(image);
      reader.onload = (event) => {
        if (targetField === "logo" || targetField === "cover") {
          this.setState({
            [targetField]: "loading",
          });
        } else {
          this.setState({
            pageData: update(this.state.pageData, {
              menu_combined: {
                [targetId]: { pic: { $set: "loading" } },
              },
            }),
          });
        }
        var blob = new Blob([event.target.result]); // create blob...
        window.URL = window.URL || window.webkitURL;
        var blobURL = window.URL.createObjectURL(blob); // and get it's URL
        // helper Image object
        var image = new Image();
        image.src = blobURL;
        //preview.appendChild(image); // preview commented out, I am using the canvas instead
        this.handleFireBaseUpload(image, newName, targetId, targetField);
      };
    }
  };

  handleFireBaseUpload = (image, newName, targetId, targetField) => {
    image.onload = () => {
      // have to wait till it's loaded
      Jimp.read(image.src).then((image) => {
        image.quality(50);
        image.resize(Jimp.AUTO, 750);
        console.log(image);
        image.getBase64(Jimp.AUTO, (err, res) => {
          const uploadTask = storage
            .ref(`/images/${newName}`)
            .putString(res, "data_url");
          uploadTask.on(
            "state_changed",
            (snapShot) => {
              //takes a snap shot of the process as it is happening
              console.log(snapShot);
            },
            (err) => {
              //catches the errors
              console.log(err);
            },
            () => {
              // gets the functions from storage refences the image storage in firebase by the children
              // gets the download url then sets the image from firebase as the value for the imgUrl key:
              storage
                .ref("images")
                .child(newName)
                .getDownloadURL()
                .then((fireBaseUrl) => {
                  if (targetField === "logo" || targetField === "cover") {
                    this.setState({
                      [targetField]: fireBaseUrl,
                    });
                  } else {
                    this.setState({
                      pageData: update(this.state.pageData, {
                        menu_combined: {
                          [targetId]: { pic: { $set: fireBaseUrl } },
                        },
                      }),
                    });
                  }
                });
            }
          );
        });
      });
    };
  };

  saveToFirestore = async () => {
    this.setState({ updating: true });
    return db
      .collection("hawkers")
      .doc(this.state.docid)
      .update(this.state.pageData)
      .then(() => {
        db.collection("pages")
          .doc(this.state.pageName)
          .update({
            delivery_option: this.state.delivery_option,
            fixed_delivery: this.state.fixed_delivery,
            cover: this.state.cover,
            css: this.state.css,
            logo: this.state.logo,
            tiered_delivery: this.state.tiered_delivery,
            all_promo: this.state.all_promo,
            selfcollect_promo: this.state.selfcollect_promo,
            promo_code: this.state.promo_code,
          })
          .then(() => {
            this.setState({ updating: false });
            this.setState({ updated: true });
          })
          .catch((e) => {
            this.setState({ updating: false });
            this.setState({ updated: true });
            console.log(e);
          });
      });
  };

  getDoc = async () => {
    const domain = getPage();
    const pageName = domain.pageName;
    const hostName = domain.hostName;
    this.setState({ pageName: pageName, hostName: hostName });
    const docid = await db
      .collection("pages")
      .doc(pageName)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // After querying db for data, initialize orderData if menu info is available
          if (snapshot.data().redirect) {
            window.location.href = "/info?id=" + snapshot.data().docid;
          } else {
            this.setState(snapshot.data());
            return snapshot.data().docid;
          }
        }
        //   onLoad("info_load", snapshot.data().name);
        return false;
      })
      .catch((error) => {
        // window.location.reload(true);
        console.log(error);
      });
    if (docid) {
      await db
        .collection("hawkers")
        .doc(docid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            // After querying db for data, initialize orderData if menu info is available
            this.setState({
              pageData: snapshot.data(),
              retrieved: true,
            });
          }
          console.log("Fetched successfully!");
          return true;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log(this.state);
  };

  render() {
    // The ThemedButton button inside the ThemeProvider
    // uses the theme from state while the one outside uses
    // the default dark theme
    let skeletons = [];
    for (let index = 0; index < 10; index++) {
      skeletons.push(
        <div style={{ width: "500px", margin: "10px" }}>
          <div
            class="card shadow"
            style={{
              paddingLeft: "0px !important",
              paddingRight: "0px !important",
            }}
          >
            <Skeleton width="100%">
              <div
                style={{ height: "100px" }}
                class="card-img-top"
                alt=""
              ></div>
            </Skeleton>
            <Skeleton width="80%">
              <h3>.</h3>
            </Skeleton>
            <Skeleton width="50%">
              <h3>.</h3>
            </Skeleton>
          </div>
        </div>
      );
    }

    return (
      <ThemeProvider theme={theme}>
        <Router>
          <LanguageContext.Provider value={this.state}>
            <div className="App">
              {this.state.pageName &&
              this.state.pageName !== "www" &&
              this.state.pageName !== "foodleh" &&
              this.state.hostName !== "sh" &&
              this.state.hostName !== "now" &&
              this.state.hostName !== "now.sh" ? (
                <CartContext.Provider value={this.state}>
                  {this.state.retrieved ? (
                    <div>
                      <PersonalHelmet
                        name={this.state.pageData.name}
                        logo={this.state.logo}
                      />
                      <SnackbarProvider
                        ref={notistackRef}
                        maxSnack={2}
                        anchorOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                        action={(key) => (
                          <Button onClick={onClickDismiss(key)}>Dismiss</Button>
                        )}
                      >
                        <Route
                          exact
                          path="/"
                          render={() => (
                            <Components.Page pageName={this.state.pageName} />
                          )}
                        />
                        <Route
                          exact
                          path="/about"
                          render={() => (
                            <Components.PageAbout
                              pageName={this.state.pageName}
                            />
                          )}
                        />
                        <Route
                          exact
                          path="/dashboard"
                          render={() => (
                            <Components.PageDashboard
                              pageName={this.state.pageName}
                              data={this.state.pageData}
                              css={this.state.css}
                              changeField={this.changeField}
                              saveToFirestore={this.saveToFirestore}
                              updating={this.state.updating}
                              updated={this.state.updated}
                              addMenuItem={this.addMenuItem}
                              logo={this.state.logo}
                              cover={this.state.cover}
                              changeInfo={this.changeInfo}
                              changeColor={this.changeColor}
                              user={this.state.user}
                              changePage={this.changePage}
                              changeDelivery={this.changeDelivery}
                              fixed_delivery={this.state.fixed_delivery}
                              delivery_option={this.state.delivery_option}
                              tiered_delivery={this.state.tiered_delivery}
                              changeDistance={this.changeDistance}
                              all_promo={this.state.all_promo}
                              promo_code={this.state.promo_code}
                              selfcollect_promo={this.state.selfcollect_promo}
                              addAddon={this.addAddon}
                              deleteAddon={this.deleteAddon}
                            />
                          )}
                        />
                      </SnackbarProvider>
                    </div>
                  ) : (
                    <div>
                      <div className="row justify-content-center">
                        <Skeleton width="100%">
                          <div class="jumbotron" style={{ height: "300px" }} />
                        </Skeleton>
                        {skeletons}
                      </div>
                    </div>
                  )}
                </CartContext.Provider>
              ) : (
                <div>
                  <Components.Menu />
                  <SeoHelmet />
                  <Route exact path="/" component={Components.Home} />
                  <Route exact path="/create" component={Components.Create} />
                  <Route exact path="/info" component={Components.Info} />
                  <Route
                    exact
                    path="/searchall"
                    component={Components.SearchAll}
                  />
                  <Route exact path="/about" component={Components.About} />
                  <Route exact path="/driver" component={Components.Driver} />
                  <Route
                    exact
                    path="/delivery"
                    component={Components.Delivery}
                  />
                  <Route exact path="/orders" component={Components.Orders} />
                  <Route
                    exact
                    path="/deliveries"
                    component={Components.Deliveries}
                  />
                  <Route exact path="/custom" component={Components.Custom} />
                  <Route
                    exact
                    path="/privacy"
                    component={Components.PrivacyPolicy}
                  />
                </div>
              )}
              <script src="/__/firebase/7.14.1/firebase-app.js"></script>
              <script src="/__/firebase/7.14.1/firebase-analytics.js"></script>
              <script src="/__/firebase/init.js"></script>
            </div>
          </LanguageContext.Provider>
        </Router>
      </ThemeProvider>
    );
  }
}

export default App;

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

// {/* This will only be useful if we convert to server-side rendering ie not CRA */}
function SeoHelmet() {
  const description =
    "Save our local F&B! FoodLeh? is a nonprofit crowdsourced hawker directory relying on Singaporeans to share information about our local F&B places.";
  const url = "https://www.foodleh.app/";
  const keywords = "hawker food delivery and dabao Singapore circuit breaker";
  const image_url =
    "https://firebasestorage.googleapis.com/v0/b/hawkercentral.appspot.com/o/foodleh.png?alt=media&token=3fce2813-7eba-4e5a-8cbe-47119c1512f9";
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>FoodLeh?</title>
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" href={image_url} sizes="16x16" />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      <meta name="og:image" content={image_url} />
      <meta name="keywords" content={keywords} />
      {/* Facebook meta tags */}
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image_url} />
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
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{props.name}</title>
      <link rel="canonical" href={url} />
      <link rel="icon" type="image/png" href={image_url} sizes="16x16" />
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      <meta name="og:image" content={image_url} />
      <meta name="keywords" content={keywords} />
      {/* Facebook meta tags */}
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image_url} />
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
      }
      if (targetField === "delete") {
        this.deleteMenuItem(targetId);
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

    this.changeInfo = (event) => {
      event.preventDefault();
      const target = event.currentTarget.id;
      const value = event.target.value;
      this.setState({
        updated: false,
      });
      if (target === "logo" || target === "cover") {
        const image = event.target.files[0];
        console.log(image, target);
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

    this.addProduct = (productIndex) => {
      let findElement;
      this.state.cartProducts.forEach((element, index) => {
        if (element.index === productIndex) findElement = { element, index };
      });
      if (findElement) {
        const newElement = findElement.element;
        newElement.quantity += 1;
        this.state.cartProducts[findElement.index] = newElement;
      } else {
        this.state.cartProducts.push({
          index: productIndex,
          quantity: 1,
        });
      }
      var newPageData = this.state.pageData;
      newPageData.menu_combined[productIndex].quantity = newPageData
        .menu_combined[productIndex].quantity
        ? (newPageData.menu_combined[productIndex].quantity += 1)
        : (newPageData.menu_combined[productIndex].quantity = 1);
      this.setState({
        cartTotal: {
          productQuantity: this.state.cartTotal.productQuantity + 1,
          totalPrice:
            this.state.cartTotal.totalPrice +
            Number(this.state.pageData.menu_combined[productIndex].price),
        },
        pageData: newPageData,
      });
      console.log(this.state);
    };

    this.removeProduct = (productIndex) => {
      let findElement;
      this.state.cartProducts.forEach((element, index) => {
        if (element.index === productIndex) findElement = { element, index };
      });
      if (findElement) {
        const newElement = findElement.element;
        newElement.quantity -= 1;
        // this.state.cartProducts[findElement.index] = newElement;
        this.setState({
          cartProducts: update(this.state.cartProducts, {
            [findElement.index]: { $set: newElement },
          }),
        });
        if (newElement.quantity === 0) {
          this.setState({
            cartProducts: update(this.state.cartProducts, {
              $set: this.state.cartProducts.filter(
                (value) => value.index !== newElement.index
              ),
            }),
          });
        }
      }
      var newPageData = this.state.pageData;
      newPageData.menu_combined[productIndex].quantity = newPageData
        .menu_combined[productIndex].quantity
        ? (newPageData.menu_combined[productIndex].quantity -= 1)
        : (newPageData.menu_combined[productIndex].quantity = 0);
      this.setState({
        cartTotal: {
          productQuantity: this.state.cartTotal.productQuantity - 1,
          totalPrice:
            this.state.cartTotal.totalPrice -
            Number(this.state.pageData.menu_combined[productIndex].price),
        },
        pageData: newPageData,
      });
    };

    this.setScrollPosition = (pos) => {
      console.log("setScrollPosition");
      this.setState({
        scrollPosition: pos,
      });
    };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      language: cookies.get("language"), // TODO: check why this is hardcoded
      toggleLanguage: this.toggleLanguage,
      addProduct: this.addProduct,
      removeProduct: this.removeProduct,
      changeField: this.changeField,
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
            cover: this.state.cover,
            css: this.state.css,
            logo: this.state.logo,
          })
          .then(() => {
            this.setState({ updating: false });
            this.setState({ updated: true });
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
                  <Route exact path="/privacy" component={Components.PrivacyPolicy} />
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

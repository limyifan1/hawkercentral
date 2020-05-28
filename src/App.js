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
import { db } from "./Components/Firestore";
import { createMuiTheme } from "@material-ui/core/styles";

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
      <meta name="description" content={description} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      <meta name="og:image" content={image_url} />
      <meta name="keywords" content={keywords} />
      {/* Facebook meta tags */}
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
    hostName = splitHost[splitHost.length];
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
    };

    this.removeProduct = (productIndex) => {
      let findElement;
      this.state.cartProducts.forEach((element, index) => {
        if (element.index === productIndex) findElement = { element, index };
      });
      if (findElement) {
        const newElement = findElement.element;
        newElement.quantity -= 1;
        this.state.cartProducts[findElement.index] = newElement;
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
    };
  }

  componentWillMount() {
    const pageName = getPage().pageName;
    if (pageName && pageName !== "www" && pageName !== "foodleh") this.getDoc();
  }

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
          this.setState(snapshot.data());
          return snapshot.data().docid;
        }
        //   onLoad("info_load", snapshot.data().name);
        return true;
      })
      .catch((error) => {
        window.location.reload(true);
        console.log(error);
      });
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
            orderData: new Array(snapshot.data().menu_combined.length).fill(0),
          });
        }
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
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
              this.state.hostName !== "sh" ? (
                <CartContext.Provider value={this.state}>
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
                      <Components.PageAbout pageName={this.state.pageName} />
                    )}
                  />
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

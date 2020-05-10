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
import { LanguageContext } from "./Components/themeContext";
import { Helmet } from "react-helmet";

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
      data: cookies.get("language") === "en" ? en : zh,
      scrollPosition: 0, // tracks scroll position of Search page
      setScrollPosition: this.setScrollPosition,
    };
  }

  render() {
    // The ThemedButton button inside the ThemeProvider
    // uses the theme from state while the one outside uses
    // the default dark theme
    return (
      <Router>
        <LanguageContext.Provider value={this.state}>
          <Components.Menu />

          <div className="App">
            <SeoHelmet />
            <Route exact path="/" component={Components.Home} />
            {/* <Route exact path="/listing" component={Components.Listing} /> */}
            <Route exact path="/create" component={Components.Create} />
            <Route exact path="/nearby" component={Components.Nearby} />
            <Route exact path="/info" component={Components.Info} />
            {/* <Route exact path="/news" component={Components.News} /> */}
            <Route exact path="/searchall" component={Components.SearchAll} />
            <Route exact path="/about" component={Components.About} />
            <Route exact path="/driver" component={Components.Driver} />
            <Route exact path="/delivery" component={Components.Delivery} />
            <script src="/__/firebase/7.14.1/firebase-app.js"></script>
            <script src="/__/firebase/7.14.1/firebase-analytics.js"></script>
            <script src="/__/firebase/init.js"></script>
          </div>
        </LanguageContext.Provider>
      </Router>
    );
  }
}

export default App;

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
import Cookies from 'universal-cookie';
import en from "./assets/translations/en.json";
import zh from "./assets/translations/zh.json";
import { LanguageContext } from "./Components/themeContext";


const cookies = new Cookies();
if (cookies.get("language") === null || cookies.get("language") === undefined) {
  cookies.set("language", "en", { path: "/" });
}

class App extends React.Component {


  constructor(props) {
    super(props);

    this.toggleLanguage = () => {
      console.log("toggleLanguage")
      console.log(this.state.language)
      if (this.state.language === "en") {
        cookies.set("language", "zh", { path: '/' });
        // update data for itself and state so other components know as well
        this.setState({
          data: zh,
          language: "zh",
          toggleLanguage: this.toggleLanguage,
        });
      } else {
        cookies.set("language", "en", { path: '/' });
        // update data for itself and state so other components know as well
        this.setState({
          data: en,
          language: "en",
          toggleLanguage: this.toggleLanguage,
        });
      }
    };

    // State also contains the updater function so it will
    // be passed down into the context provider
    this.state = {
      language: cookies.get('language'), // TODO: check why this is hardcoded
      toggleLanguage: this.toggleLanguage,
      data: (cookies.get('language') === 'en') ? en : zh,
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

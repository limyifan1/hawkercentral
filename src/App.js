import React from 'react';
import './App.css';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Components from './Components'
import 'react-multi-carousel/lib/styles.css';

function App() {
  return (
    <Router>
      <Components.Menu />
      <div className="App">
        <Route exact path="/" component={Components.Home} />
        <Route exact path="/listing" component={Components.Listing}/>
        <Route exact path="/create" component={Components.Create}/>
        <Route exact path="/nearby" component={Components.Nearby}/>
        <Route exact path="/info" component={Components.Info}/>
        <Route exact path="/news" component={Components.News}/>
        <Route exact path="/about" component={Components.About}/>

        <body>
        <script src="/__/firebase/7.14.0/firebase-app.js"></script>
        <script src="/__/firebase/7.14.0/firebase-analytics.js"></script>
        <script src="/__/firebase/init.js"></script>
        </body>
      </div>
    </Router>
  );
}

export default App;

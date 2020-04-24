// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Home from "./Home";
import Menu from "./Menu";
import Create from "./Create";
import Search from "./Search";
import Listing from "./Listing";
import Item from "./Item";
import Results from "./Results";
import Nearby from "./Nearby";
import Info from "./Info";
import About from "./About";
import Popup from "./Popup";
import News from "./News";
import SearchAll from "./SearchAll";
import ListForm from "./ListForm";

import { db, storage } from "./Firestore";

export default {
  Home,
  Menu,
  Create,
  Search,
  Listing,
  Item,
  Results,
  Nearby,
  News,
  Info,
  About,
  Popup,
  SearchAll,
  ListForm,
  db,
  storage,
};

import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { db, firebase, uiConfig } from "./Firestore";
import "../App.css";
import { Card, CardContent, makeStyles, Table, TableBody, TableCell, 
  TableFooter, TableHead, TablePagination, TableRow } from "@material-ui/core";

const analytics = firebase.analytics();

function onLoad(name, item) {
  analytics.logEvent(name, { name, item });
}

const allGroupBuysOption =   { label: "All", value: "All" };
const activeGroupBuysOption = { label: "Active", value: "Active" };
const inactiveGroupBuysOption = { label: "Inactive", value: "Inactive" };

const filterOptions = [
  allGroupBuysOption,
  activeGroupBuysOption,
  inactiveGroupBuysOption
];

const useStyles = makeStyles({
  paginationcell: {
    borderBottom: "none",
  },
});

function GroupBuyTable(props) {
  const classes = useStyles();

  const rows = props.rows;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell align="center">Item Name</TableCell>
          <TableCell align="center">Price&nbsp;(S$)</TableCell>
          <TableCell align="center">Quantity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map(row => (
          <TableRow key={row.name}>
            <TableCell component="th" scope="row" align="center">
              {row.name.length > 20 ? (row.name.substring(0, 18) + "...") : row.name }
            </TableCell>
            <TableCell align="center">{row.price}</TableCell>
            <TableCell align="center">{row.quantity}</TableCell>
          </TableRow>
        ))}

        {emptyRows > 0 && (
          <TableRow style={{ height: 33 * emptyRows }}>
            <TableCell colSpan={6} className={classes.paginationcell} />
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TablePagination
            className={classes.paginationcell}
            rowsPerPageOptions={[3]}
            colSpan={3}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function CustomerGroupBuyList(props) {
  const groupBuys = props.groupBuys;
  const cards = groupBuys.map(groupBuy => 
    <Card
      key={groupBuy.hawker}
      className="card shadow groupbuy-card"
      style={{ 
        margin: "5px"
      }}
    >
      <CardContent>
        <p className="card-title">{ groupBuy.hawker }</p>
        <GroupBuyTable rows={groupBuy.items} />
      </CardContent>
    </Card>
  );

  return (
    <div
      className="col-sm-12 groupbuy-container mt-4"
      style={{
        display: "inline-flex",
        flexWrap: "wrap",
      }}
    >
      { cards }
    </div>
  );
}

export class GroupBuyCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseUser: null,
      allGroupBuys: [],
      filteredGroupBuys: [],
      filterOption: allGroupBuysOption,
      search: ""
    }

    this.updateFilteredGroupBuys = this.updateFilteredGroupBuys.bind(this);
  }

  componentDidMount() {
    firebase.auth().useDeviceLanguage();
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
          // reCAPTCHA solved
        },
      }
    );

    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          this.setState({
            firebaseUser: user
          });
          onLoad("groupbuy customer", user.phoneNumber);
          this.getGroupBuyCustomerData(user);
        } else {
          // no user is signed in
        }
      }.bind(this)
    );
  }

  getGroupBuyCustomerData = () => {
    // TODO: dummy data to be removed after configuring Firebase
    const data = [
      {
        hawker: "Tampines",
        active: true,
        area: "Tampines",
        items: [
          {
            name: "curry puff",
            quantity: 2,
            price: 3
          },
          {
            name: "sardine puff",
            quantity: 1,
            price: 5
          },
          {
            name: "lemon puff",
            quantity: 2,
            price: 4.6
          },
          {
            name: "spinach puff",
            quantity: 1,
            price: 0.5
          },
          {
            name: "hello panda",
            quantity: 9,
            price: 0.8
          },
        ]
      },
      {
        hawker: "test",
        active: true,
        area: "Bishan",
        items: [
          {
            name: "curry puff",
            quantity: 2,
            price: 3
          },
          {
            name: "sardine puff",
            quantity: 1,
            price: 5
          },
        ]
      },
      {
        hawker: "3",
        active: false,
        area: "Pasir Ris",
        items: [
          {
            name: "curry chicken",
            quantity: 1,
            price: 10
          },
          {
            name: "curry fish",
            quantity: 2,
            price: 8
          },
          {
            name: "spicy chicken",
            quantity: 5,
            price: 7.50
          },
          {
            name: "spicy fish spicy fish spicy fish spicy fish spicy fish spicy fish",
            quantity: 9,
            price: 1
          },
        ]
      }
    ];

    this.setState({
      allGroupBuys: data,
      filteredGroupBuys: data
    });
  }

  updateFilteredGroupBuys = async(event, meta=null) => {
    let name = "";
    let value = "";
    
    if (event.target) {
      name = event.target.name;
      value = event.target.value;
    } else {
      // this is for the react-select which does not return name directly
      name = meta.name;
      value = event;
    }

    this.setState({ [name]: value }, () => {
      this.filterGroupBuys();
    });
  }

  filterGroupBuys = () => {
    let filteredGroupBuys = this.state.allGroupBuys;
    const status = this.state.filterOption;
    const searchTerm = this.state.search;

    const isActive = status === activeGroupBuysOption;
    if (status.value !== allGroupBuysOption.value) {
      filteredGroupBuys = this.state.allGroupBuys.filter(groupBuy => {
        return groupBuy.active === isActive;
      });
    }

    if (searchTerm) {
      filteredGroupBuys = filteredGroupBuys.filter(groupBuy => {
        return groupBuy.hawker.toLowerCase().includes(searchTerm.toLowerCase())
          || groupBuy.area.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    this.setState({ filteredGroupBuys: filteredGroupBuys });
  }

  render() {
    const verifiedUser = this.state.firebaseUser;

    return (
      <div
          className="jumbotron"
          style={{
            "paddingTop": "70px",
            "paddingBottom": "240px",
            height: "100%",
            "backgroundColor": "white",
          }}
        >
        <div className="container-fluid col-md-10 content col-xs-offset-2">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-6 col-md-6">
            <h3 id="back-to-top-anchor">
              Your Group Buys
            </h3>
          </div>
        </div>
        { verifiedUser === null ? 
          <div>
            <div>
              <StyledFirebaseAuth
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            </div>
            <div id="recaptcha-container"></div>
            <br />
          </div>
        :
          <React.Fragment>
            <div className="row justify-content-center mt-4">
              Verified your phone number: { verifiedUser.phoneNumber }
            </div>
            <div className="row justify-content-center mt-4">
              <div className="col-12 col-sm-6 col-md-6">
                <input
                  disabled={this.state.allGroupBuys.length === 0}
                  className="form-control"
                  type="text"
                  name="search"
                  value={this.state.search}
                  placeholder="Search For Group Buy"
                  style={{
                    width: "100%",
                    height: "38px",
                    "borderRadius": "1rem",
                  }}
                  onChange={this.updateFilteredGroupBuys}
                ></input>
              </div>
              <div className="col-12 col-sm-6 col-md-6">
                <Select
                    isDisabled={this.state.allGroupBuys.length === 0}
                    name="filterOption"
                    options={filterOptions}
                    value={this.state.filterOption}
                    onChange={this.updateFilteredGroupBuys}
                />
              </div>
            </div>
            { this.state.filteredGroupBuys &&
              <CustomerGroupBuyList groupBuys={this.state.filteredGroupBuys}/> }
          </React.Fragment>
        }
        </div>
      </div>
    )
  }

}

export default withRouter(GroupBuyCustomer);

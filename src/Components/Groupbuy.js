import React from "react";
import "../App.css";
import { Redirect, withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import { db } from "./Firestore";

// Retrieves all groupbuys from db and displays unique set of areas eg Tampines, Bishan.
// Upon clicking area, redirect user with specific area param and retrieve groupbuys in this area from db
// Redirects to GroupbuyList.js
export class Groupbuy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryData: null,
      redirect: false,
      areaSelected: "",
    };
    this.renderRedirect.bind(this)
  }

  componentWillMount() {
    this.getDoc();
  }

  getDoc = () => {
    return db
      .collection("groupbuy")
      .get()
      .then(async (snapshot) => {
        var dataToReturn = [];
        snapshot.forEach((d) => {
          console.log(d.data());
          dataToReturn.push(d.data())
        });
        this.setState({ deliveryData: dataToReturn });
        return dataToReturn;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleOneArea = (event) => {
    const target = event.target;
    const value = target.value;
    // Get the groupbuys for this area
    this.setState({
      areaSelected: value,
      redirect: true,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      // let areaGroupbuys = [];
      // // parse groupbuys in this area from this.state.deliverydata
      // areaGroupbuys = this.state.deliveryData.filter((data) => {
      //   if (data.area === this.state.areaSelected) {
      //     return (data)
      //   }
      // })
      return (
        <Redirect
          to={{
            pathname: `/groupbuy/${this.state.areaSelected}`,
          }}
        />
      );
    }
  };

  render() {
    let dataToDisplay = [];
    let areaSet = []
    if (this.state.deliveryData !== null) {
      // get the unique set of areas to display as buttons
      areaSet = [...new Set(this.state.deliveryData.map(data => data.area))]
      dataToDisplay = areaSet.map((data) => {
        return (
          <Button
            onClick={this.handleOneArea.bind(this)}
            class="shadow-lg"
            style={{
              margin: "10px"
            }}
            value={data} // pass in groupbuy area
          >
            {data}
          </Button>
        );
      });
    }

    return (
      <div>
        {this.renderRedirect()}
        <div
          class="jumbotron"
          style={{
            "padding-top": "70px",
            "padding-bottom": "240px",
            height: "100%",
            "background-color": "white",
          }}
        >
          <div class="container-fluid col-md-10 content col-xs-offset-2">
            <div class="d-flex row justify-content-center">
              GroupBuys
              <div
                class="card shadow row"
                style={{ width: "100%", padding: "20px", margin: "20px" }}
              >
                <br />
                <div>{dataToDisplay}</div>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}

export default withRouter(Groupbuy);

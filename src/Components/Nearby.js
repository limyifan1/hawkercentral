import React from "react";
import "../App.css";
import Item from "./Item";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export class Nearby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      query: queryString.parse(this.props.location.search).postal,
      longitude: queryString.parse(this.props.location.search).lng,
      latitude: queryString.parse(this.props.location.search).lat,
      distance: queryString.parse(this.props.location.search).distance,
      retrieved: false,
    };
  }

  componentWillMount() {
    this.getFirestoreData();
    console.log("run");
  }

  getData(val) {
    this.setState({ data: val });
  }

  retrieveData = async (query) => {
    let string;
    if (query === "islandwide") {
      string = {
        longitude: this.state.longitude,
        latitude: this.state.latitude,
      };
      try {
        const response = await fetch(
          "https://us-central1-hawkercentral.cloudfunctions.net/islandwide",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(string),
          }
        );
        return response.json();
      } catch (error) {
        return error;
      }
    } else if (query === "nearby") {
      string = {
        longitude: this.state.longitude,
        latitude: this.state.latitude,
        query: this.state.query,
        distance: this.state.distance,
      };
      try {
        const response = await fetch(
          "https://us-central1-hawkercentral.cloudfunctions.net/nearby",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(string),
          }
        );
        return response.json();
      } catch (error) {
        return error;
      }
    }
  };

  async getFirestoreData() {
    let islandwide_data = await this.retrieveData("islandwide");
    let nearby_data = await this.retrieveData("nearby");
    let islandwide = [];
    let nearby = [];
    islandwide_data.forEach(function (doc) {
      islandwide.push(doc);
    });
    nearby_data.forEach(function (doc) {
      nearby.push(doc);
    });
    console.log(nearby);
    this.setState({ islandwide: islandwide, nearby: nearby, retrieved: true });
  }

  render() {
    let result = {
      islandwide: [],
      nearby: [],
    };
    if (this.state.retrieved) {
      this.state.islandwide.forEach(function (data) {
        result["islandwide"].push(
          <p style={{ padding: "6px" }}>
            <Item
              name={data["name"]}
              street={data["street"]}
              pic={data["url"]}
              summary={data["description"]}
            />
          </p>
        );
      });
      this.state.nearby.forEach(function (data) {
        result["nearby"].push(
          <p style={{ padding: "6px" }}>
            <Item
              name={data["name"]}
              street={data["street"]}
              pic={data["url"]}
              summary={data["description"]}
            />
          </p>
        );
      });
    }

    return (
      <div>
        {this.state.retrieved ? (
          <div>
            <div
              class="container"
              style={{ paddingTop: "56px", width: "100%" }}
            >
              {result.nearby.length > 0 ? (
                <div>
                  <div class="row">
                    <div class="col-md-12" style={{ textAlign: "left" }}>
                      <h2>Near You</h2>
                    </div>
                  </div>
                  <Carousel responsive={responsive}>{result.nearby}</Carousel>
                </div>
              ) : null}
              
              <div>
                <div class="row">
                  <div class="col-md-12" style={{ textAlign: "left" }}>
                    <h2>Islandwide Delivery</h2>
                  </div>
                </div>
                <Carousel responsive={responsive}>{result.islandwide}</Carousel>
              </div>
              )
            </div>
          </div>
        ) : (
          <div class="row h-100 page-container">
            <div class="col-sm-12 my-auto">
              <Spinner class="" animation="grow" />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Nearby;

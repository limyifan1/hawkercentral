import React from "react";
import "../App.css";
import Item from "./Item";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import { db } from "./Firestore";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
    partialVisibilityGutter: 30,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    partialVisibilityGutter: 30,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    partialVisibilityGutter: 30,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    partialVisibilityGutter: 10,
  },
};

function distance_calc(lat1, lon1, lat2, lon2) {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist * 1.609344;
  }
}

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
    this.retrieveData();
    console.log("run");
  }

  getData(val) {
    this.setState({ data: val });
  }

  retrieveData = async () => {
    let data = [];
    let temp
    await db
      .collection("hawkers")
      .limit(30)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.exists) {
            temp = doc.data()
            temp.id = doc.id
            data.push(temp);
          }
        });
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({ data: data, retrieved: true });
  };

  // retrieveData = async (query) => {
  //   let string = {
  //     longitude: this.state.longitude,
  //     latitude: this.state.latitude,
  //     query: this.state.query,
  //     distance: this.state.distance,
  //     limit: 10
  //   };
  //   let urls = [
  //     "https://us-central1-hawkercentral.cloudfunctions.net/islandwide",
  //     "https://us-central1-hawkercentral.cloudfunctions.net/nearby",
  //   ];
  //   try {
  //     Promise.all(
  //       urls.map((url) =>
  //         fetch(url, {
  //           method: "POST",
  //           mode: "cors",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(string),
  //         })
  //           .then((response) => {
  //             return response.json();
  //           })
  //           .then((data) => {
  //             return data;
  //           })
  //           .catch((error) => {
  //             return error;
  //           })
  //       )
  //     ).then((data) => {
  //       this.setState({
  //         islandwide: data[0],
  //         nearby: data[1],
  //         retrieved: true,
  //       });
  //     });
  //   } catch (error) {
  //     return error;
  //   }
  // };

  render() {
    let result = {
      islandwide: [],
      nearby: [],
    };
    if (this.state.data !== undefined && this.state.retrieved) {
      let longitude = this.state.longitude;
      let latitude = this.state.latitude;
      let filtered = [];
      filtered = this.state.data.filter((d) => d.islandwide === true);
      result.islandwide = filtered.map((data) => {
        return (
          <p style={{ padding: "6px" }}>
            <Item
              id={data["id"]}
              name={data["name"]}
              street={data["street"]}
              pic={data["url"]}
              summary={data["description"]}
              distance={distance_calc(
                data["latitude"],
                data["longitude"],
                latitude,
                longitude
              ).toString()}
            />
          </p>
        );
      });

      filtered = this.state.data.filter(
        (d) =>
          distance_calc(d["latitude"], d["longitude"], latitude, longitude) <
          this.state.distance
      );
      result.nearby = filtered.map((data) => {
        return (
          <p style={{ padding: "6px" }}>
            <Item
              id={data["id"]}
              name={data["name"]}
              street={data["street"]}
              pic={data["url"]}
              summary={data["description"]}
              distance={distance_calc(
                data["latitude"],
                data["longitude"],
                latitude,
                longitude
              ).toString()}
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
                    <Carousel
                      responsive={responsive}
                      ssr={true}
                      infinite={false}
                      partialVisible={true}
                      swipeable={true}
                      draggable={true}
                      minimumTouchDrag={0}
                      transitionDuration={0}
                      slidesToSlide={2}
                    >
                      {result.nearby}
                    </Carousel>
                  </div>
                ) : null}
                <div>
                  <div class="row">
                    <div class="col-md-12" style={{ textAlign: "left" }}>
                      <h2>Islandwide Delivery</h2>
                    </div>
                  </div>
                  <Carousel
                    responsive={responsive}
                    ssr={true}
                    infinite={false}
                    partialVisible={true}
                    swipeable={true}
                    draggable={true}
                    minimumTouchDrag={0}
                    transitionDuration={0}
                    slidesToSlide={2}
                  >
                    {result.islandwide}
                  </Carousel>
                </div>
              </div>
            </div>
          ) : (
            <div class="row h-100 page-container">
              <div class="col-sm-12 my-auto">
                <h3>Please give us a moment while we load your results</h3>
                <Spinner class="" animation="grow" />
              </div>
            </div>
          )}
        </div>
      );
    }
  }

export default Nearby;

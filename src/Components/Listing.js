import React from "react";
import "../App.css";
import Component from "../Components";
import queryString from "query-string";
import { Spinner } from "react-bootstrap";
import Item from "./Item";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

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

export class Listing extends React.Component {
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
  }

  getData(val) {
    this.setState({ data: val });
  }

  retrieveData = async (query) => {
    let string = {
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      cuisine: "Local",
    };
    let urls = [
      "https://us-central1-hawkercentral.cloudfunctions.net/islandwide",
      "https://us-central1-hawkercentral.cloudfunctions.net/cuisine",
    ];
    try {
      Promise.all(
        urls.map((url) =>
          fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(string),
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              return data;
            })
            .catch((error) => {
              return error;
            })
        )
      ).then((data) => {
        this.setState({
          islandwide: data[0],
          cuisine: data[1],
          retrieved: true,
        });
      });
    } catch (error) {
      return error;
    }
  };

  render() {
    let result = {
      islandwide: [],
      local: [],
    };
    if (this.state.retrieved) {
      this.state.islandwide.forEach(function (data) {
        result["islandwide"].push(
          <p style={{ padding: "6px" }}>
            <Item
              id={data["id"]}
              name={data["name"]}
              street={data["street"]}
              pic={data["url"]}
              summary={data["description"]}
            />
          </p>
        );
      });
      this.state.cuisine.forEach(function (data) {
        result["local"].push(
          <p style={{ padding: "6px" }}>
            <Item
              id={data["id"]}
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
            <div>
              {result.islandwide.length > 0 ? (
                <div
                  class="container"
                  style={{ paddingTop: "56px", width: "100%" }}
                >
                  <div class="row">
                    <div class="col-md-12" style={{ textAlign: "left" }}>
                      <h2>Delivered Islandwide</h2>
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
                  <div class="row">
                    <div class="col-md-12" style={{ textAlign: "left" }}>
                      <h2>Local Food</h2>
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
                    {result.local}
                  </Carousel>
                </div>
              ) : (
                <div class="search-container">
                  <div class="row h-100">
                    <div class="col-sm-2 my-auto"></div>
                    <h1
                      class="col-sm-8 my-auto"
                      style={{ "text-align": "center" }}
                    >
                      Sorry, we couldn't find a result
                    </h1>
                    <div class="col-sm-2 my-auto"></div>
                  </div>
                </div>
              )}
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

export default Listing;

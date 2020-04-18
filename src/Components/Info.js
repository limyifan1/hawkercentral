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

export class Nearby extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      id: queryString.parse(this.props.location.search).id,
      retrieved: false,
    };
  }

  componentWillMount() {
    this.getDoc();
    console.log("run");
  }

  getDoc = async () => {
    await db
      .collection("hawkers")
      .doc(this.state.id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          this.setState({ data: snapshot.data(), retrieved: true });
        }
        console.log("Fetched successfully!");
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    let cuisine = [];

    if (this.state.retrieved) {
      this.state.data.cuisine.forEach((element) => {
      cuisine.push(<span class="badge badge-info">{element.label}</span>);
      });
    }

    return (
      <div>
        {this.state.retrieved ? (
          <div style={{ paddingTop: "56px", width: "100%" }}>
            <img
              src={this.state.data.url}
              class="card-img banner-img-top"
              alt=""
            />
            <div
              class="container"
              style={{ textAlign: "left", paddingTop: "10px" }}
            >
              <h2>{this.state.data.name}</h2>
              <svg
                class="bi bi-house-fill"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3.293l6 6V13.5a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M7.293 1.5a1 1 0 011.414 0l6.647 6.646a.5.5 0 01-.708.708L8 2.207 1.354 8.854a.5.5 0 11-.708-.708L7.293 1.5z"
                  clip-rule="evenodd"
                />
              </svg>{" "}
        {this.state.data.unit}{' '}{this.state.data.street}
              <br />
              {cuisine}
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

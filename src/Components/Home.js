import React, { PropTypes } from "react";
import Component from "../Components";
import Carousel from "react-multi-carousel";
import home from "../home.png";
import Item from "./Item";

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
    items: 1,
    partialVisibilityGutter: 10,
  },
};

export class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
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
      limit: 15
    };
    let urls = ["https://us-central1-hawkercentral.cloudfunctions.net/all"];
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
          all: data[0],
          retrieved: true,
        });
      });
    } catch (error) {
      return error;
    }
  };

  render() {
    let result = {
      all: [],
    };
    if (this.state.retrieved) {
      this.state.all.forEach(function (data) {
        result["all"].push(
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
        <div
          class="jumbotron row"
          style={{ "background-color": "white" }}
        >
          <div class="container" style={{ "margin-top": "57px" }}>
            <div class="row">
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"> </div>
              <div
                class="col-xs-6 col-sm-6 col-md-6 col-lg-6"
                style={{ textAlign: "center" }}
              >
                <img src={home} style={{ width: "100%" }} />
                <br />
                <br />
                <Component.Search />
              </div>
              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>
            </div>
          </div>
          <br />
          <br />
        </div>
        <Carousel
            responsive={responsive}
            ssr={true}
            infinite={true}
            // partialVisible={true}
            swipeable={true}
            draggable={true}
            minimumTouchDrag={0}
            transitionDuration={0}
            slidesToSlide={1}
            arrows={false}
            autoPlay={true}
            centerMode={true}
            autoPlaySpeed={2000}
          >
            {result.all}
          </Carousel>
      </div>
    );
  }
}

export default Home;

// <img src={require('../dinner.png')} class="card-img card-img-top" style={{"max-width":"100%", "height":"auto", "padding":"20px 10px 1px"}}/>
//                   <div class="card-body">
//                     <h3 class="card-title">Order food from your favorite local hawkers</h3>
//                   </div>
//                 </div>
//               </div>
//               <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//               <div class="card shadow" style={{"width": "100%", "margin-top": "10px"}}>
//                   <img src={require('../dinner.png')} class="card-img card-img-top" style={{"max-width":"100%", "height":"auto", "padding":"20px 10px 1px"}}/>
//                   <div class="card-body">
//                     <h3 class="card-title">Order food from your favorite local hawkers</h3>
//                   </div>
//                 </div>

//               </div>
//               <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
//                 <div class="card shadow" style={{"width": "100%", "margin-top": "10px"}}>
//                   <img src={require('../dinner.png')} class="card-img card-img-top" style={{"max-width":"100%", "height":"auto", "padding":"20px 10px 1px"}}/>
//                   <div class="card-body">
//                     <h3 class="card-title">Order food from your favorite local hawkers</h3>
//                   </div>

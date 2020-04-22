import React, { PropTypes } from "react";
import Component from "../Components";
import Carousel from "react-multi-carousel";
import home from "../home (1).png";
import Item from "./Item";
import i_want from "../i_want.jpeg";
import delivery from "../delivery.jpeg";
import self_collect from "../self_collect.jpeg";

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
      option: "",
      retrieved: false,
    };

    this.handleCollect = this.handleCollect.bind(this);
    this.handleDelivery = this.handleDelivery.bind(this);
  }

  componentWillMount() {
    // this.retrieveData();
  }

  getData(val) {
    this.setState({ data: val });
  }

  // retrieveData = async (query) => {
  //   let string = {
  //     longitude: this.state.longitude,
  //     latitude: this.state.latitude,
  //     cuisine: "Local",
  //     limit: 15,
  //   };
  //   let urls = ["https://us-central1-hawkercentral.cloudfunctions.net/all"];
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
  //         all: data[0],
  //         retrieved: true,
  //       });
  //     });
  //   } catch (error) {
  //     return error;
  //   }
  // };
  handleCollect() {
    this.setState({ option: "selfcollect" });
  }
  handleDelivery() {
    this.setState({ option: "delivery" });
  }

  render() {
    let result = {
      all: [],
    };
    if (this.state.retrieved) {
      this.state.all.forEach(function (data) {
        result["all"].push(
          <p style={{ padding: "10px", width: "200px" }}>
            <Item
              promo={data["promo"]}
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

    let selfcollect =
      this.state.option === "selfcollect"
        ? "home-option-clicked"
        : "home-option";

    let delivery_option =
      this.state.option === "delivery" ? "home-option-clicked" : "home-option";

    return (
      <div>
        <div class="jumbotron row" style={{ "background-color": "white" }}>
          <div class="container" style={{ "margin-top": "57px" }}>
            <div class="row">
              <div class="col">
                <img alt="" class="home-banner" src={home} />
              </div>
              <div
                class="col-xs-6 col-sm-6 col-md-6 col-lg-6 align-items-center right-items"
                style={{ textAlign: "center" }}
              >
                <br />
                <br />
                <img alt="" class="home-iwant" src={i_want} />
                <br />
                <br />
                <span class="row d-none d-md-inline-block">
                  <span class="col">
                    <img
                      onClick={this.handleCollect}
                      alt=""
                      class={selfcollect}
                      src={self_collect}
                      style={{ width: "30%" }}
                    />
                  </span>
                  <span class="col">
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                      style={{ width: "30%" }}
                    />
                  </span>
                </span>
                <span class="row d-inline-block d-md-none">
                  <span>
                    <img
                      alt=""
                      onClick={this.handleCollect}
                      class={selfcollect}
                      src={self_collect}
                    />
                  </span>
                  <span>
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                    />
                  </span>
                </span>
                <br />
                <br />
                <div>
                  {this.state.option === "" ? (
                    <span class=" main-caption">
                      choose <b>da bao</b> or <b>delivery</b>
                    </span>
                  ) : this.state.option === "delivery" ? (
                    <span class=" main-caption">
                      now enter your <b>postal code</b>
                      <br />
                      <br />
                      <Component.Search option={this.state.option} />
                    </span>
                  ) : (
                    <span class="label label-default main-caption">
                      <span class=" main-caption">
                        now enter your <b>postal code</b>
                        <br />
                        <br />
                        <Component.Search option={this.state.option} />
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* 

              <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"> </div>
              <div
                class="col-xs-10 col-sm-10 col-md-10 col-lg-10"
                style={{ textAlign: "center" }}
              >
                <div class="col-6">
                  <img alt="" class="home-banner" src={home} />
                </div>
                <br />
                <br />
                <img alt="" class="home-iwant" src={i_want} />
                <br />
                <br />
                <span class="row d-none d-md-inline-block">
                  <span class="col-sm-2 col-md-2 col-lg-2"></span>
                  <span class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <img
                      onClick={this.handleCollect}
                      alt=""
                      class={selfcollect}
                      src={self_collect}
                    />
                  </span>
                  <span class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                    />
                  </span>
                  <span class="col-sm-2 col-md-2 col-lg-2"></span>
                </span>
                <span class="row d-inline-block d-md-none">
                  <span>
                    <img
                      alt=""
                      onClick={this.handleCollect}
                      class={selfcollect}
                      src={self_collect}
                    />
                  </span>
                  <span>
                    <img
                      alt=""
                      onClick={this.handleDelivery}
                      class={delivery_option}
                      src={delivery}
                    />
                  </span>
                </span>
                <br />
                <br />
                <div>
                  {this.state.option === "" ? (
                    <span class=" main-caption">Choose Da Bao Or Delivery</span>
                  ) : this.state.option === "delivery" ? (
                    <span class=" main-caption">Living the lazy life?</span>
                  ) : (
                    <span class="label label-default main-caption">
                      Living the hardworking life?
                    </span>
                  )}
                </div>
                <br />
                <Component.Search option={this.state.option} />
              </div>
              <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1"></div> */}
          </div>
          <br />
        </div>
        {/* <Carousel
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
        </Carousel> */}
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

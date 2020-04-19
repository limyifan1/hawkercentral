import React from "react";
import "../App.css";
import logo from "../logo-black.png";
import invisible from "../invisible.jpeg";

export class About extends React.Component {
  render() {
    return (
      <div>
        <div class="jumbotron row" style={{ "background-color": "white" }}>
          <div class="row " style={{ "margin-top": "57px" }}>
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            <div
              class="col-xs-8 col-sm-8 col-md-8 col-lg-8"
              style={{ textAlign: "center" }}
            >
              <img src={invisible} style={{ width: "50%" }} />
              <br />
              <br />
              <br />

              <h3
                class="row card-title justify-content-center"
                style={{ textAlign: "center", padding: "10px 10px 10px" }}
              >
                About Us
              </h3>
              <p
                class="row card-title justify-content-center"
                style={{ textAlign: "center", padding: "30px 30px 30px" }}
              >
                <span>
                  <img src={logo} style={{ height: "20px" }} /> is a web
                  application designed to bridge hawker stalls in Singapore with
                  all Singaporean foodies! With the implementation of the
                  Circuit Breaker in place to fight COVID-19, numerous hawker
                  stalls are struggling to stay open in light of reduced human
                  traffic flow.
                  <br />
                  <br /> Hawker store owners can easily create a listing on{" "}
                  <img src={logo} style={{ height: "20px" }} /> to advertise
                  their stall, creating awareness about their promotions and
                  delivery options available during this time.
                  <br />
                  <br />
                  <b>
                    <h4>#sgunited #dabao #circuitbreaker #covid19</h4>
                  </b>
                </span>

                Please email foodleh@outlook.com for questions, enquiries, or concerns. 
              </p>
            </div>
            <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>

            <div class="row">
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
              <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8"></div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default About;

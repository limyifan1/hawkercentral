// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import mojs from "@mojs/core";
import { db } from "./Firestore";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class Clap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      countTotal: this.props.claps,
      isClicked: false,
    };
    this._handleClick = this._handleClick.bind(this);
    this.updateClap = this.updateClap.bind(this);
  }

  updateClap = async () => {
    await db
      .collection(this.props.collection)
      .doc(this.props.id)
      .update({
        claps: this.state.countTotal + 1,
      })
      .then((snapshot) => {
        console.log("Updated successfully!");
        return true;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    const tlDuration = 300;
    const triangleBurst = new mojs.Burst({
      parent: "#clap",
      radius: { 50: 95 },
      count: 5,
      angle: 30,
      children: {
        shape: "polygon",
        radius: { 6: 0 },
        scale: 1,
        stroke: "rgba(211,84,0 ,0.5)",
        strokeWidth: 2,
        angle: 210,
        delay: 30,
        speed: 0.2,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
        duration: tlDuration,
      },
    });
    const circleBurst = new mojs.Burst({
      parent: "#clap",
      radius: { 50: 75 },
      angle: 25,
      duration: tlDuration,
      children: {
        shape: "circle",
        fill: "rgba(149,165,166 ,0.5)",
        delay: 30,
        speed: 0.2,
        radius: { 3: 0 },
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1),
      },
    });
    const countAnimation = new mojs.Html({
      el: "#clap--count",
      isShowStart: false,
      isShowEnd: true,
      y: { 0: -30 },
      opacity: { 0: 1 },
      duration: tlDuration,
    }).then({
      opacity: { 1: 0 },
      y: -80,
      delay: tlDuration / 2,
    });
    const countTotalAnimation = new mojs.Html({
      el: "#clap--count-total",
      isShowStart: true,
      isShowEnd: true,
      opacity: { 1: 1 },
      delay: (3 * tlDuration) / 2,
      duration: tlDuration,
      y: { 1: 1 },
    });
    const scaleButton = new mojs.Html({
      el: "#clap",
      duration: tlDuration,
      scale: { 1.3: 1 },
      easing: mojs.easing.out,
    });
    const clap = document.getElementById("clap");
    clap.style.transform = "scale(1, 1)";
    this._animationTimeline = new mojs.Timeline();
    this._animationTimeline.add([
      countAnimation,
      countTotalAnimation,
      scaleButton,
      circleBurst,
      triangleBurst,
    ]);
  }
  _generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  _handleClick() {
    if (this.state.count < 5) {
      this._animationTimeline.replay();
      this.updateClap();
      this.setState(function (prevState, nextState) {
        return {
          count: Math.min(prevState.count + 1, 5),
          countTotal: prevState.countTotal + 1,
          isClicked: true,
        };
      });
    }
  }
  getAppContent(count, countTotal, isClicked, handleClick) {
    return (
      <div className="row">
        <span
          id="clap"
          className="clap d-flex align-items-center"
          onClick={handleClick}
        >
          <span>
            {/*<!--  SVG Created by Luis Durazo from the Noun Project  -->*/}
            <svg
              id="clap--icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-549 338 100.1 125"
              className={`${isClicked && "checked"}`}
            >
              <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
              <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
            </svg>
          </span>
          <span id="clap--count" className="clap--count">
            +{count}
          </span>

          <span id="clap--count-total" className="clap--count-total">
            {countTotal}
          </span>
        </span>
        <span
          style={{ fontSize: "10px" }}
          className="d-flex align-items-center justify-content-center"
        >
          {this.props.toggle === "about" ? (
            <span>{cookies.get("language") === "en" ? 
            "Clap to support this initiative!" : 
            "鼓掌支持我们！"} 
            </span>
          ) : (
            <span>
              Clap to support <br /> your hawker! (max 5){" "}
            </span>
          )}
        </span>
      </div>
    );
  }

  render() {
    const { count, countTotal, isClicked } = this.state;
    return this.getAppContent(count, countTotal, isClicked, this._handleClick);
  }
}

export default Clap;

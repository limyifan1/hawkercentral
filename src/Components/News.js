// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import { render } from "react-dom";
import { Token, tokenContainer, Typeahead } from "react-bootstrap-typeahead";
import Select from 'react-select'

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const TokenSkill = tokenContainer(props => {
  console.log("2", props);
  return (
    <div
      {...props}
      onClick={event => {
        event.stopPropagation();
        props.onClickCustom(event);
      }}
      tabIndex={props.key}
      className={"tokenSkill"}
    >
      {props.children}
      <button aria-label="Clear" class="close rbt-close" type="button">
        <span aria-hidden="true">×</span>
        <span class="sr-only">Clear</span>
      </button>
    </div>
  );
});

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

export class News extends React.Component {


  render(){

    return (
      <div>
      <br/>
      <br/>
      <br/>
      <br/>

      <Select
    isMulti
    name="colors"
    options={options}
    className="basic-multi-select"
    classNamePrefix="select"
  />

      </div>
    );

  }

}

export default News
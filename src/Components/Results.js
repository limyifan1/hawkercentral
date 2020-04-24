// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from 'react';
import '../App.css';
import Item from './Item'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

export class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        listing: [],
        loading: false,
        data: [],
        headline: []
    
    };
  }

  render() {
    let result = []
    console.log(this.props.data.data)
    if (this.props.data.data){
      this.props.data.data.forEach(function(data) {
        // console.log(data['url'])
        
        result.push(
          <p style={{"padding":"6px"}}>
            <Item 
              name={data['name']}
              street={data['street']}
              pic={data['url']}
              summary={data['description']}
              id={data['id']}
            />
          </p>
        )
      });
    }
    
    return (
      <div>
          {result.length > 0 ? 
            <div class="container" style={{"paddingTop":"56px", width:"100%"}}>
              
              <div class="row">
                <div class="col-md-12" style={{"textAlign":"left"}}>
                  <h2>Delivered Islandwide</h2>
                </div>
              </div>
              <Carousel responsive={responsive}>
                {result}
              </Carousel>
            </div>
            :
            (
              <div class="search-container">
                <div class="row h-100">
                  <div class="col-sm-2 my-auto"></div>
                    <h1 class="col-sm-8 my-auto" style={{"text-align": "center"}}>
                      Sorry, we couldn't find a result
                    </h1>
                  <div class="col-sm-2 my-auto"></div>
                </div>
              </div>
            )
          }
      </div>
    );
  }
}

export default Results
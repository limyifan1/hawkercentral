import React, {PropTypes} from 'react';
import Component from '../Components'
import logo from '../foodleh.png' 
export class Home extends React.Component {
    render() {
      return (
        <div>
          <div class="jumbotron" style={{"background-color":"white", "height":"380px"}}>
            <div class="container" style={{"margin-top":"57px"}}>
                <div class="row">
                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"> </div>
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6" style={{"textAlign":"center"}}>
                    <img src={logo} style={{"height":"150px"}}/>
                    <h4 style={{"color":"#B48300"}}>Cut The Middlemen. Save Our Hawkers.</h4><br/>
                    <Component.Search/>
                  </div>
                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3"></div>
                </div>
              </div>
          </div>
          
          <div class="jumbotron" style={{"background-color":"#B48300", "height":"500px"}}>
            
            <div class="row">
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
              </div>
              <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                <h3 class="card-title" style={{"color":"white"}}> Islandwide Deliveries</h3>
              </div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
            </div>

            
            <div class="row">
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
              <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8">
              </div>
              <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2"></div>
            </div>
            
    
            </div>
            
          </div>
              
      </div>
      );
    }
  }

  export default Home


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
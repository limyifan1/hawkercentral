import React, {PropTypes} from 'react';
import '../App.css';
export class Item extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {     
      return (
        <div>
            {/* <div class="item mb-3" style={{"maxWidth": "50%", "minHeight":"100", "maxHeight": "260px"}}>
                <div class="row no-gutters">
                    <div class="col-md-4">
                      {
                        <img src={this.props.pic} class="card-img card-img-top" style={{"maxHeight":"220px"}}/>
                      }
                        
                    </div>
                    <div class="col-md-8" style={{"paddingTop":"0px"}}>
                        <div style={{"padding-left":"15px"}} >
                            <h5 class="card-title">{this.props.street}</h5>
                            <p class="card-text"><small>{this.props.summary}</small></p>
                        </div>
                    </div>
                </div>
            </div> */}
            <div class="card shadow" style={{"width": "100%", "height":"270px"}}>
              <img src={this.props.pic} class="card-img card-img-top" style={{"maxHeight":"130px"}}/>
              <div class="card-body" style={{"width": "100%", "height":"100%"}}>
                <h4 class="card-title" style={{"height":"50px"}}>{this.props.name}</h4>
                <p class="card-text"><small>{this.props.summary}</small></p>
              </div>
            </div>
        </div>
      )
  }
}

  export default Item
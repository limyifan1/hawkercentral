import React from 'react';
import '../App.css';
import {db, storage} from './Firestore'
import Component from '../Components'
import {
	withRouter
} from 'react-router-dom';

const API_KEY = `${process.env.REACT_APP_GKEY}`

const addData = (postal,street,price,description,url,latitude,longitude) => {
  db.collection("hawkers").add({
    postal: postal,
    street: street,
    price: price,
    description: description,
    url: url,
    latitude: latitude,
    longitude: longitude
  })
  .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      // alert("Sent")
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
      // alert("Failed")
  });
}

export class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postal: 0,
      street: '',
      price: 0,
      description:'',
      url:'',
      imageFile: '',
      imageName: 'Upload Image',
      longitude: -122.3710252,
      latitude: 47.63628904,
    };
  }

  apiHasLoaded(map, maps){
    if (map && maps) {
      this.setState({
        apiReady: true,
        map: map,
        maps: maps
      });
    }
  }

  async getPostal (event) {
    event.preventDefault();
    let data = await this.callPostal()
    console.log(data['ADDRESS'])
    this.setState({street:data['ADDRESS'],
                  longitude:data['LONGITUDE'],
                  latitude:data['LATITUDE']
                })
  }

  callPostal = () =>{
    return fetch('https://developers.onemap.sg/commonapi/search?searchVal='+this.state.postal+'&returnGeom=Y&getAddrDetails=Y').then(function(response) {
      return response.json();
    }).then(function(jsonResponse) {
      // console.log(jsonResponse['results'])
      return jsonResponse['results'][0]
      //Success message
    },(error)=>{
      console.log(error)
    })
  }

  handleSubmit = (event) => {
    addData(
      this.state.postal,
      this.state.street,
      this.state.price,
      this.state.description,
      this.state.url,
      this.state.latitude,
      this.state.longitude
      )
    event.preventDefault();
    this.props.history.push('/listing')
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  handleImageAsFile = (event) => {
    event.preventDefault()
    const image = event.target.files[0]
    this.setState({imageFile: image})
    this.setState({imageName: image.name})
    this.handleFireBaseUpload(image)
  }

  handleFireBaseUpload = (image) => {
    // event.preventDefault()
    // alert('start of upload')
    var date = new Date();
    var timestamp = date.getTime();
    var newName = timestamp+"_"+image.name
    const uploadTask = storage.ref(`/images/${newName}`).put(image)
    uploadTask.on('state_changed', 
    (snapShot) => {
      //takes a snap shot of the process as it is happening
      console.log(snapShot)
    }, (err) => {
      //catches the errors
      console.log(err)
    }, () => {
      // gets the functions from storage refences the image storage in firebase by the children
      // gets the download url then sets the image from firebase as the value for the imgUrl key:
      storage.ref('images').child(newName).getDownloadURL()
       .then(fireBaseUrl => {
         this.setState({url: fireBaseUrl})
       })
    })
  }  

  render({ apiReady, maps, map } = this.state) {
    return (
      <div class="container" style={{"padding-top":"70px"}}>
        <h3>Create Hawker Listing</h3>
        <div class="row">
          <div class="col">
            <div class="card shadow" style={{"width": "100%", "margin-top": "10px"}}>
              <div class="card-body">
                <h5 class="card-title">Upload Images</h5>
                <h6 class="card-subtitle mb-2 text-muted">Upload images of your listed hawker stall below</h6>
                <p class="card-text">Listings with images are much more likely to get leads. </p>
                {this.state.url?<img src={this.state.url} style={{'width':'100px'}}></img>:null}
                <form onSubmit={this.handleFireBaseUpload}>
                  <div class="custom-file" onChange={this.handleImageAsFile} style={{"margin-top": "10px"}}>
                    <input type="file" class="custom-file-input" id="customFile"></input>
                    <label class="custom-file-label" for="customFile">{this.state.imageName}</label>
                  </div>
                  {/* <input type="submit" value="Upload" class="btn btn-primary" style={{"margin-top": "10px"}}/> */}
                </form>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="card shadow" style={{"width": "100%", "margin-top": "10px"}}>
              <form onSubmit={this.handleSubmit}>
                <div class="card-body">
                  <h5 class="card-title">Property Details</h5>
                  <h6 class="card-subtitle mb-2 text-muted">Please enter more details regarding your property listing. </h6>
                  <div class="form-group">
                    <label for="postalcode">Postal Code</label>
                    <div class="input-group">
                      <input onChange={this.handleChange} value={this.state.postal} type="number" class="form-control" name="postal" placeholder="Enter Postal Code"></input>
                      <div class="input-group-append">
                        <input type="button" value="Search" onClick={this.getPostal.bind(this)} class="btn btn-primary"/>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="street">Street Name</label>
                    <input onChange={this.handleChange} value={this.state.street} type="text" class="form-control" name="street" placeholder="Enter Street Name"></input>
                  </div>
                  <div class="form-group">
                    <label for="price">Price</label>
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <span class="input-group-text" id="basic-addon1">$</span>
                      </div>
                      <input onChange={this.handleChange} value={this.state.price} type="number" class="form-control" name="price" placeholder="Enter Price"></input>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="street">Description</label>
                    <input onChange={this.handleChange} value={this.state.description} type="text" class="form-control" name="description" placeholder="Enter Description"></input>
                  </div>
                  <input type="submit" value="Submit" class="btn btn-primary"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    //   <div className="search-container">
    //   <GoogleMap
    //   bootstrapURLKeys={{ key: API_KEY, libraries:'places'}}
    //   defaultCenter={[1.3521, 103.8198]}
    //   defaultZoom={15}
    //   yesIWantToUseGoogleMapApiInternals
    //   onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
    //   >
    //     {apiReady && <Component.SearchBox
    //       map={map}
    //       maps={maps}
    //     />}
    //   </GoogleMap>
    // </div>
    );
  }
}

export default withRouter(Create)
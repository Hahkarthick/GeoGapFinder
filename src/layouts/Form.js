import React, { Component } from "react";
import axios from "axios";

export class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: "",
      to: "",
      radius: "",
      actualRadius: "",
      km:"",      
      loading: false,
      result: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const input = e.target;
    const name = input.name;
    const value = input.type === "checkbox" ? input.checked : input.value;
    this.setState({ [name]: value, result: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ loading: true });
    const urlFrom = `https://us1.locationiq.com/v1/search.php?key=<key>&q=${this.state.from}&format=json`;
    const urlTo = `https://us1.locationiq.com/v1/search.php?key=<key>&q=${this.state.to}&format=json`;
    const fromResponse = await axios.get(urlFrom);
    console.log(fromResponse);
    const toResponse = await axios.get(urlTo);
    console.log(toResponse);
    const result = this.calcDistance(fromResponse.data[0].lat, fromResponse.data[0].lon,toResponse.data[0].lat, toResponse.data[0].lon,'K');
    const radius = Math.sqrt(result/3.1415);
    this.setState({
        loading: false,
        actualRadius: radius,
        km: result,
        result: true
    })
    
  }

  //This function takes in latitude and longitude of two location and returns the distance between them (in km)
  calcDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
  }

//   difference
    difference(a, b) {
        return Math.abs(a - b);
    }

  render() {

    let result ='';
    let diff = this.difference(this.state.km, this.state.radius);

    if (diff < 10) {
       result = 'Approximately You are right'
    } else if(diff < 50){
       result = 'Some what You are right'
    } else {
       result = 'Sorry Your predection is wrong try again !!'
    }

    return (
      <div>
        <div className="wrapper formcontainer">
          <div className="wrapper__inner">
            <div className="notepad">
              <form onSubmit={this.handleSubmit}>
                <label>
                  From:
                  <input
                    name="from"
                    type="text"
                    value={this.state.from}
                    onChange={this.handleChange}
                  />
                </label>
                <br />
                <label>
                  To:
                  <input
                    name="to"
                    type="text"
                    value={this.state.to}
                    onChange={this.handleChange}
                  />
                </label>
                <br />
                <label>
                  Radius:
                  <input
                    name="radius"
                    type="text"
                    value={this.state.radius}
                    onChange={this.handleChange}
                  />
                </label>
                <br />
                <input type="submit" value="Submit" />
              </form>
              <div className="result">
                  <p>{this.state.result && result}</p>
                  <h4>{ this.state.result && `The Actual Distance between `+ this.state.from + ` to ` + this.state.to}</h4>
                  <p>{this.state.result && this.state.km + ` KM`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;

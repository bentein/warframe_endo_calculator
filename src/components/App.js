import React from "react";
import ReactDOM from "react-dom";
import './styles/App.css';

import Orders from "../classes/Orders";
import SculptureCard from "./SculptureCard";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: ["ingame"],
      region: "en"
    }
  }

  render() {
    return (
      <div>
        <div className="option-container">
          <div className="status-options">
            <label><input type="checkbox" name="status" value="offline" onChange={(e) => this.statusChange(e)} checked={this.state.status.includes("offline")} /> Offline</label>
            <label><input type="checkbox" name="status" value="online" onChange={(e) => this.statusChange(e)} checked={this.state.status.includes("online")} /> Online</label>
            <label><input type="checkbox" name="status" value="ingame" onChange={(e) => this.statusChange(e)} checked={this.state.status.includes("ingame")} /> Ingame</label>
          </div>
          <div className="region-options">
            <label><input type="radio" name="region" value="en" onChange={(e) => this.regionChange(e)} defaultChecked/> EN</label>
            <label><input type="radio" name="region" value="ru" onChange={(e) => this.regionChange(e)} /> RU</label>
            <label><input type="radio" name="region" value="ko" onChange={(e) => this.regionChange(e)} /> KO</label>
            <label><input type="radio" name="region" value="fr" onChange={(e) => this.regionChange(e)} /> FR</label>
          </div>
        </div>

        <div className="info-container">
          <SculptureCard name="anasa" options={this.state} />
          <SculptureCard name="ayr" options={this.state} />
          <SculptureCard name="orta" options={this.state} />
          <SculptureCard name="piv" options={this.state} />
          <SculptureCard name="sah" options={this.state} />
          <SculptureCard name="valana" options={this.state} />
          <SculptureCard name="vaya" options={this.state} />
        </div>
      </div>
    );
  }

  statusChange(e) {
    let val = e.target.value;
    let newStatus = this.state.status;
    let i = newStatus.indexOf(val);

    if(i === -1) {
      newStatus.push(val);
    } else {
      newStatus.splice(i,1);
    }
    
    this.setState({
      status: newStatus
    });
  }

  regionChange(e) {
    let val = e.target.value;

    this.setState({
      region: val
    });
  }
}

export default App;
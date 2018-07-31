import React from "react";
import ReactDOM from "react-dom";
import './styles/SculptureCard.css';

import DAO from "../classes/DAO";

class SculptureCard extends React.Component {
  constructor(props) {
    super(props);
    this.name = props.name;
    this.options = props.options;
    this.cardRef = React.createRef();

    this.endoList = {
      0: {
        anasa: 2000,
        ayr: 325,
        orta: 650,
        piv: 375,
        sah: 300,
        valana: 325,
        vaya: 400
      },
      1: {
        anasa: 2306,
        ayr: 625,
        orta: 1050,
        piv: 708,
        sah: 583,
        valana: 625,
        vaya: 750
      },
      2: {
        anasa: 2625,
        ayr: 992,
        orta: 1500,
        piv: 1108,
        sah: 933,
        valana: 992,
        vaya: 1167
      },
      3: {
        anasa: 3025,
        ayr: 1425,
        orta: 2000,
        piv: 1725,
        sah: 1500,
        valana: 1575,
        vaya: 1800
      },
      4: {
        anasa: 3450,
        orta: 2700
      }
    }

    this.iconList = {
      anasa: "icons/en/thumbs/Anasa_Ayatan_Sculpture.4b0f22f5432ea4a4f196806a7b90ccb0.128x128.png",
      ayr: "icons/en/thumbs/Ayr_Ayatan_Sculpture.d5a5347b24a6ec864ce17552ba108ad7.128x128.png",
      orta: "icons/en/thumbs/Orta_Ayatan_Sculpture.942499eea26924073ddbb60d8d3016d6.128x128.png",
      piv: "icons/en/thumbs/Piv_Ayatan_Sculpture.4d39cbe88cfd49b7da1ea55cc18629b7.128x128.png",
      sah: "icons/en/thumbs/Sah_Ayatan_Sculpture.29dc05cf1143890b000ce67f6af4660c.128x128.png",
      valana: "icons/en/thumbs/Valana_Ayatan_Sculpture.331f1ba4280627977651aa7209361033.128x128.png",
      vaya: "icons/en/thumbs/Vaya_Ayatan_Sculpture.3aaade63978258328e4106a499616299.128x128.png"
    }

    this.state = {
      orders: [{
        user: "...",
        endo: "...",
        platinum: "...",
        epp: 0,
        status: ["offline", "online", "ingame"],
        region: "all"
      }]
    }

    this.makeOrderList();
  }

  makeOrderList() {
    let list = [];

    let o = new DAO()
    .getItemOrders(this.name)
    .then((res) => {
      let orders = res.data;

      for (let i in orders) {
        let order = orders[i];
        let endo = this.endoList[order.mod_rank || 0][this.name];
        let endoPerPlat = endo / order.platinum;

        let obj = {
          user: order.user.ingame_name,
          endo: endo,
          platinum: order.platinum,
          epp: endoPerPlat,
          status: order.user.status,
          region: order.user.region
        }

        list.push(obj);
      }

      list.sort((a, b) => {
        return b.epp-a.epp;
      });

      this.setState({
        orders: list
      });
    });
  }

  toClipboard(user) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = `/w ${user} I'd like to buy your ${this.name} sculpture`;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    window.alert("Copied to clipboard");
  }

  componentWillReceiveProps(props) {
    this.options = props.options;
    this.setState({
      fpos: this.cardRef.current.getBoundingClientRect()
    })
  }

  componentDidUpdate(props) {
    let node = this.cardRef.current;

    let oldPos = this.state.fpos || node.getBoundingClientRect();
    let newPos = node.getBoundingClientRect();

    const deltaX = oldPos.left - newPos.left;
    const deltaY = oldPos.top - newPos.top;

    node.style.zIndex = `${deltaX}`;

    requestAnimationFrame(() => {
      node.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      node.style.transition = `transform 0s`;
      
      requestAnimationFrame(() => {
        let scale = "scale(1.0)";
        if (deltaX > 50 || deltaX < -50) scale = deltaX > 0 ? `scale(${1.05 + deltaX/5000})` : `scale(${0.85 - deltaX/5000})`;
        node.style.transform = scale;
        node.style.transition = `transform 500ms ease-in-out`;
      
        setTimeout(() => {
          requestAnimationFrame(() => {
            node.style.transform = `scale(1.0)`;
            node.style.transition = `transform 500ms ease-out`;
          });
        }, 250);

        setTimeout(() => {
          requestAnimationFrame(() => {
            node.style.zIndex = 0;
          })
        }, 500);
      });
    });
  }

  render() {
    let elements = [];
    let MAXLENGTH = 5;
    let highestEpp = 0;

    for (let i in this.state.orders) {
      let order = this.state.orders[i];

      if (this.options.status.includes(order.status) && this.options.region === order.region && elements.length < MAXLENGTH) {
        if (order.epp > highestEpp) highestEpp = order.epp;
        elements.push(
          <tr key={i} onClick={() => this.toClipboard(order.user)} className="copy">
            <td className="name-cell"><a href={`https://warframe.market/profile/${order.user}`} onClick={(e) => e.stopPropagation()}>{order.user}</a></td>
            <td>{order.endo}</td>
            <td>{order.platinum}</td>
            <td>{order.epp.toFixed(2)}</td>
          </tr>
        )
      }
    }

    let divStyle = {
      order: highestEpp.toFixed(0)
    }

    return (
      <div className="sculpture-card" style={divStyle} ref={this.cardRef}>
        <div className="image-container"><img src={`https://warframe.market/static/assets/${this.iconList[this.name]}`}></img></div>
        <p><a href={`https://warframe.market/items/${this.name}_ayatan_sculpture`}>{this.name} sculpture</a></p>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Endo</th>
              <th>Plat</th>
              <th>EPP</th>
            </tr>
            {elements}
          </tbody>
        </table>
      </div>
    );
  }
}

export default SculptureCard;
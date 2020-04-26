import React, { PureComponent } from "react";
import Item from "./Item";

class ItemRendered extends PureComponent {
  render() {
    // Access the items array using the "data" prop:
    const data = this.props.data[this.props.index];

    return (
      <div>
        <Item
          promo={data["promo"]}
          id={data["id"]}
          name={data["name"]}
          street={data["street"]}
          pic={data["url"]}
          summary={data["description"]}
          claps={data["claps"]}
          // distance={data["distance"]}
        />
      </div>
    );
  }
}

export default ItemRendered;

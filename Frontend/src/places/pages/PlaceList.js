import React from "react";
import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Place Found!!</h2>
          <button>Share</button>
        </Card>
      </div>
    );
  }
  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          title={place.title}
          image={place.image}
          description={place.description}
          coordinates={place.location}
          address={place.address}
          creatorId={place.creator}
          onDelete={props.onPlaceDelete}
        />
      ))}
    </ul>
  );
};

export default PlaceList;

import React from "react";
import PropTypes from "prop-types";
import placeholder from "../placeholder.png";

const Thumb = (props) => (
  <div className={props.classes}>
    <img
      src={props.src ? props.src : placeholder}
      alt={props.alt}
      title={props.title}
    />
  </div>
);

Thumb.propTypes = {
  alt: PropTypes.string,
  title: PropTypes.string,
  classes: PropTypes.string,
  src: PropTypes.string.isRequired,
};

export default Thumb;

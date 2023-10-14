import React, { CSSProperties } from "react";
import styles from "./Brand.module.scss";

interface BrandProps {
  onClick?: () => void;
  styles?: CSSProperties;
}

const Brand = (props: BrandProps) => {
  return (
    <h2
      onClick={props.onClick}
      className={`text-5xl ${styles.morpheusTitle}`}
      style={props.styles}
    >
      Morpheus ML Template
    </h2>
  );
};

export default Brand;

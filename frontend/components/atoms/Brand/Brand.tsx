import React, { CSSProperties } from "react";

interface BrandProps {
  onClick?: () => void;
  styles?: CSSProperties;
  short?: boolean;
}

const Brand = ({ onClick, styles, short = true }: BrandProps) => {
  return (
    <h2 onClick={onClick} className={`text-5xl ${styles}`} style={styles}>
      Morpheus {!short && "ML Template"}
    </h2>
  );
};

export default Brand;

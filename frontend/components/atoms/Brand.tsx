import React, { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BrandProps {
  onClick?: () => void;
  styles?: CSSProperties;
  short?: boolean;
}

const Brand = ({ onClick, styles, short = true }: BrandProps) => {
  return (
    <h2
      onClick={onClick}
      className={cn(
        `text-5xl text-white text-white font-bold
        hover:text-transparent hover:bg-gradient-to-r from-primary/70 to-accent/90 bg-clip-text  ${styles}`,
      )}
      style={styles}
    >
      Morpheus {!short && "ML Template"}
    </h2>
  );
};

export default Brand;

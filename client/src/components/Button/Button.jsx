import React from "react";

import "./Button.css";

function Button({ label, variant = "primary", onClick, disabled, style }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`button button__${variant}`}
      style={style}
    >
      {label}
    </button>
  );
}

export default Button;

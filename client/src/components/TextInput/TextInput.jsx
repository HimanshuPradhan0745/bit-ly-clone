import React from "react";

import "./TextInput.css";

function TextInput({ label, placeholder, onChange, type = "text", value, style }) {
  return (
    <div className="text-input" style={style}>
      {Boolean(label) && <label htmlFor="">{label}</label>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default TextInput;

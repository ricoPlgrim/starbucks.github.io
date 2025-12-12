import { useState } from "react";
import "./Toggle.scss";

function Toggle({ label = "토글", description, defaultOn = false, disabled = false, onChange }) {
  const [checked, setChecked] = useState(defaultOn);

  const handleToggle = () => {
    if (disabled) return;
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <label className={`toggle ${checked ? "is-on" : ""} ${disabled ? "is-disabled" : ""}`}>
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={handleToggle}
        disabled={disabled}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
      <div className="toggle__text">
        <span className="toggle__label">{label}</span>
        {description && <span className="toggle__desc">{description}</span>}
      </div>
    </label>
  );
}

export default Toggle;


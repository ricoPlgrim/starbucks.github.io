import { useState } from "react";
import "./BottomDock.scss";

const defaultItems = [
  { key: "home", label: "홈", icon: "🏠" },
  { key: "search", label: "검색", icon: "🔍" },
  { key: "bookmark", label: "즐겨찾기", icon: "⭐" },
  { key: "profile", label: "내 정보", icon: "👤" },
];

function BottomDock({ items = defaultItems, onChange, defaultActive = "home" }) {
  const [active, setActive] = useState(defaultActive);

  const handleSelect = (key) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <nav className="bottom-dock" aria-label="하단 내비게이션">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`bottom-dock__item ${active === item.key ? "is-active" : ""}`}
          aria-pressed={active === item.key}
          onClick={() => handleSelect(item.key)}
        >
          <span className="bottom-dock__icon" aria-hidden="true">
            {item.icon}
          </span>
          <span className="bottom-dock__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default BottomDock;


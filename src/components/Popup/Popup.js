import { useEffect, useState } from "react";
import "./Popup.scss";

export function BasicPopup({ open, onClose, icon = "🔒", title, description, actions = [] }) {
  if (!open) return null;
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup popup--basic" onClick={(e) => e.stopPropagation()}>
        <div className="popup__image">
          <span className="popup__image-icon">{icon}</span>
        </div>
        <div className="popup__body popup__body--center">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="popup__dots" aria-hidden="true">
          <span className="is-active"></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="popup__actions popup__actions--stack">
          {actions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              className={`popup__btn popup__btn--${action.variant || "ghost"}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BottomSheetPopup({ open, onClose, title, description }) {
  const [offset, setOffset] = useState(0);
  const [startY, setStartY] = useState(null);
  const THRESHOLD = 120;

  useEffect(() => {
    if (!open) {
      setOffset(0);
      setStartY(null);
    }
  }, [open]);

  if (!open) return null;

  const onStart = (e) => {
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    setStartY(y);
  };

  const onMove = (e) => {
    if (startY === null) return;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = y - startY;
    setOffset(Math.max(0, Math.min(delta, 240)));
  };

  const onEnd = () => {
    if (offset > THRESHOLD) {
      onClose?.();
    }
    setOffset(0);
    setStartY(null);
  };

  return (
    <div className="popup-overlay popup-overlay--sheet" onClick={onClose}>
      <div
        className="popup popup--sheet"
        style={{ transform: `translateY(${offset}px)` }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
      >
        <div className="popup__handle" />
        <div className="popup__body popup__body--center">
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <div className="popup__actions popup__actions--stack">
          <button className="popup__btn popup__btn--ghost" onClick={onClose}>Cancel</button>
          <button className="popup__btn popup__btn--primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

export function FullscreenPopup({ open, onClose, title, body }) {
  if (!open) return null;
  return (
    <div className="popup-overlay popup-overlay--full">
      <div className="popup popup--full">
        <div className="popup__header">
          <h4>{title}</h4>
          <button className="popup__close" onClick={onClose}>✕</button>
        </div>
        <div className="popup__body">
          {body}
        </div>
      </div>
    </div>
  );
}


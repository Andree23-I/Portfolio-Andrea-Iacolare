import React from 'react';
import './SvgButton.css';

const SvgButton = ({ children, onClick, className = '', ...props }) => {
  return (
    <button className={`svg-button ${className}`} onClick={onClick} {...props}>
      <svg className="svg-button-outline" viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg">
        <rect className="svg-button-rect" x="2" y="2" width="156" height="56" rx="8" ry="8" />
      </svg>
      <span className="svg-button-text">{children}</span>
    </button>
  );
};

export default SvgButton;

import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./css/style.css";

const ResponseLengthSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLength, setSelectedLength] = useState("medium");
  const dropdownRef = useRef(null);

  //runs once at the beginning and then at the end during cleanup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = (event) => {
    setSelectedLength(event.target.value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="length-button-container">
      <button onClick={toggleDropdown} className="length-button">
        <span>Response Length</span>
        <FontAwesomeIcon icon={faChevronDown} className="icon" />
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: "0",
            backgroundColor: "#2d2d2d",
            border: "1px solid #424242",
            borderRadius: "4px",
            padding: "10px",
            marginTop: "5px",
          }}
        >
          {["Short", "Medium", "Long"].map((option) => (
            <label
              key={option}
              style={{
                display: "block",
                marginBottom: "5px",
                color: "#ececec",
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="response-length"
                value={option.toLowerCase()}
                checked={selectedLength === option.toLowerCase()}
                onChange={handleOptionChange}
                style={{ marginRight: "5px" }}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseLengthSelector;

// Function to inject the React component
const injectReactComponent = () => {
  const injectElement = document.createElement("div");
  injectElement.id = "response-length-selector-root";
  document.body.appendChild(injectElement);

  const root = createRoot(injectElement);
  root.render(<ResponseLengthSelector />);
};

// Poll every 500ms until the main element is found
const intervalId = setInterval(() => {
  const main = document.querySelector("main");
  console.log("polling for main");

  if (main) {
    clearInterval(intervalId);
    injectReactComponent();
  }
}, 500);

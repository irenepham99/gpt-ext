import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "./css/style.css";
import LengthOption from "./LengthOption";

const ResponseLengthSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLength, setSelectedLength] = useState(null);
  const dropdownRef = useRef(null);
  const [lengthOptions, setLengthOptions] = useState([100, 300]);
  const [isAnyLength, setIsAnyLength] = useState(true); //by default it can be any length

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

  //its adding another p, if theres a p with class placeholder, if theres already text then append it to the front
  useEffect(() => {
    const updatePromptTextarea = () => {
      console.log("in updatePromptTextarea");
      const promptTextarea = document.getElementById("prompt-textarea");
      const placeholder = promptTextarea.querySelector("p.placeholder");
      if (promptTextarea && selectedLength && !isAnyLength) {
        if (placeholder) {
          const instruction = document.createElement("p");
          instruction.className = "length-instruction";
          instruction.textContent = `in under ${selectedLength} words or less`;
          promptTextarea.appendChild(instruction);
          // Remove the first child of the promptTextarea
          if (
            promptTextarea.firstChild &&
            promptTextarea.firstChild.textContent.trim() === ""
          ) {
            console.log("removing first child");
            promptTextarea.removeChild(promptTextarea.firstChild);
          }
        } else {
          console.log(
            "appending instruction to first child since there is already text"
          );
          promptTextarea.firstChild.textContent =
            `in under ${selectedLength} words or less` +
            promptTextarea.firstChild.textContent;
        }
      }
    };
    updatePromptTextarea();
  }, [selectedLength, isAnyLength]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelectLength = (length) => {
    console.log("handle option change", length);
    setIsAnyLength(false);
    setSelectedLength(length);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="length-button-container">
      <button onClick={toggleDropdown} className="length-button">
        <span>
          {selectedLength ? ` < ${selectedLength} words` : "Response Length"}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="icon" />
      </button>
      {isOpen && (
        <div className="length-menu-container">
          {/*Need to have an option for the any length, need to figure out how to change length*/}
          {lengthOptions.map((length, index) => (
            <LengthOption
              key={length}
              handleSelectLength={(length) => handleSelectLength(length)}
              handleLengthEdit={(newLength) => {
                const newLengthOptions = [...lengthOptions];
                newLengthOptions[index] = newLength;
                setLengthOptions(newLengthOptions);
                console.log("new length options set", newLengthOptions);
              }}
              length={length}
            />
          ))}
          <button onClick={() => setIsAnyLength(true)}>Any Length</button>
        </div>
      )}
    </div>
  );
};

export default ResponseLengthSelector;

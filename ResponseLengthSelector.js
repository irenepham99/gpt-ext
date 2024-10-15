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
  const [lengthEditError, setLengthEditError] = useState(null);
  const [buttonClickedOnce, setButtonClickedOnce] = useState(false);
  const attachSendListenersRef = useRef(null);
  const isAnyLengthRef = useRef(isAnyLength);
  const selectedLengthRef = useRef(selectedLength);

  // Update refs when the state changes
  useEffect(() => {
    isAnyLengthRef.current = isAnyLength;
    selectedLengthRef.current = selectedLength;
  }, [isAnyLength, selectedLength]);

  //detect clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setLengthEditError(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (event) => {
    const clickedButton = event.target.closest("button"); //the target is the svg
    if (clickedButton.dataset.testid !== "send-button") {
      return;
    }

    event.stopImmediatePropagation();

    const form = event.target.closest("form");
    if (form) {
      const p = form.querySelector("p");
      console.log(
        "form submitted",
        isAnyLengthRef.current,
        selectedLengthRef.current
      );
      if (p && !isAnyLengthRef.current) {
        p.textContent =
          `in less than ${selectedLengthRef.current} words ` + p.textContent;
        console.log("Submitting form with value:", p.textContent);
      }
    }

    setTimeout(() => {
      if (attachSendListenersRef.current) {
        attachSendListenersRef.current();
      }
    }, 1000);
  };

  //need to call this after hearing a submit event
  useEffect(() => {
    const attachSendListeners = () => {
      //select butttons that are not disabled and not the stop button
      let sendButton = document.querySelector(
        'button[data-testid="send-button"]:not(:disabled):not([data-testid="stop-button"])'
      );
      console.log("looking for send button");
      if (sendButton) {
        console.log("found the send button", sendButton);
        sendButton.addEventListener(
          "click",
          (event) => handleSubmit(event),
          true
        );
        const form = sendButton.closest("form");
        if (form) {
          form.addEventListener(
            "keydown",
            (event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                handleSubmit(event);
              }
            },
            true
          );
        }
      } else {
        console.log("did not find the send button");
        setTimeout(attachSendListeners, 3000);
      }
    };

    attachSendListenersRef.current = attachSendListeners;
    attachSendListeners();

    return () => {
      const sendButton = document.querySelector(
        'button[data-testid="send-button"]'
      );
      if (sendButton) {
        sendButton.removeEventListener("click", handleSubmit);
        sendButton.removeEventListener("mousedown", handleSubmit);
      }
    };
  }, []);

  const handleSelectLength = (length) => {
    console.log("handle option change", length);
    setIsAnyLength(false);
    setSelectedLength(length);
    setIsOpen(false);
    setButtonClickedOnce(true);
  };

  //return whether or not lenght is valid
  const handleLengthEdit = (newLength, index) => {
    newLength = parseInt(newLength);

    if (newLength <= 0) {
      setLengthEditError("The new length must be greater than 0");
      return false;
    }
    console.log(
      "new length",
      newLength,
      lengthOptions,
      typeof lengthOptions[0],
      typeof newLength
    );
    if (lengthOptions.includes(newLength)) {
      setLengthEditError("The new length must be unique");
      return false;
    }
    //if the length we're editing is the one that we selected we need to update selectedLength
    if (index == lengthOptions.indexOf(selectedLength)) {
      setSelectedLength(newLength);
    }
    const newLengthOptions = [...lengthOptions];
    newLengthOptions[index] = newLength;
    setLengthOptions(newLengthOptions);
    console.log("new length options set", newLengthOptions);
    return true;
  };

  const getButtonText = () => {
    if (!buttonClickedOnce) {
      return "Response Length";
    } else if (isAnyLength) {
      return "Any Length";
    } else {
      return `< ${selectedLength} words`;
    }
  };

  return (
    <div ref={dropdownRef} className="length-button-container">
      <button onClick={() => setIsOpen(!isOpen)} className="length-button">
        <span>{getButtonText()}</span>
        <FontAwesomeIcon icon={faChevronDown} className="icon" />
      </button>
      {isOpen && (
        <div className="length-menu-container">
          {/*Need to have an option for the any length, need to figure out how to change length*/}
          {lengthOptions.map((length, index) => (
            <LengthOption
              key={length}
              handleSelectLength={(length) => handleSelectLength(length)}
              handleLengthEdit={(newLength) =>
                handleLengthEdit(newLength, index)
              }
              length={length}
            />
          ))}
          <button
            onClick={() => {
              setIsAnyLength(true);
              setIsOpen(false);
              setSelectedLength(null);
              setButtonClickedOnce(true);
            }}
          >
            Any Length
          </button>
          {lengthEditError && <p className="error">{lengthEditError}</p>}
        </div>
      )}
    </div>
  );
};

export default ResponseLengthSelector;

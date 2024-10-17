import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faRuler } from "@fortawesome/free-solid-svg-icons";
import LengthOption from "./LengthOption";
import "./style.css";

const ResponseLengthSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLength, setSelectedLength] = useState(null);
  const [lengthOptions, setLengthOptions] = useState([100, 300]);
  const [isAnyLength, setIsAnyLength] = useState(true); //by default it can be any length
  const [lengthEditError, setLengthEditError] = useState(null);
  const [buttonClickedOnce, setButtonClickedOnce] = useState(false);
  const attachSendListenersRef = useRef(null);
  const isAnyLengthRef = useRef(isAnyLength);
  const selectedLengthRef = useRef(selectedLength);
  const lengthButtonContainerRef = useRef(null);
  const lengthMenuContainerRef = useRef(null);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 600);
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  //dyanmically place buttons based on screen size and content
  useEffect(() => {
    const handleResizeCheckWideScreen = () => {
      setIsWideScreen(window.innerWidth > 600);
    };

    const handleResizePlaceButton = () => {
      const article = document.getElementsByTagName("article");

      if (article.length === 0 && lengthButtonContainerRef.current) {
        lengthButtonContainerRef.current.style.right = "60px";
      } else if (article.length > 0 && lengthButtonContainerRef.current) {
        lengthButtonContainerRef.current.style.right =
          window.innerWidth > 767 ? "180px" : "60px";
      }
      if (article.length === 0 && lengthMenuContainerRef.current) {
        lengthMenuContainerRef.current.style.right = "60px";
      } else if (article.length > 0 && lengthMenuContainerRef.current) {
        lengthMenuContainerRef.current.style.right =
          window.innerWidth > 767 ? "180px" : "60px";
      }
    };

    const handleUrlChange = () => {
      if (window.location.href !== currentUrl) {
        setCurrentUrl(window.location.href);
        handleResizeCheckWideScreen();
        handleResizePlaceButton();
      }
    };

    //call once at the beginning
    handleResizePlaceButton();
    const intervalId = setInterval(handleUrlChange, 2000);
    window.addEventListener("resize", handleResizeCheckWideScreen);
    window.addEventListener("resize", handleResizePlaceButton);

    return () => {
      window.removeEventListener("resize", handleResizeCheckWideScreen);
      window.removeEventListener("resize", handleResizePlaceButton);
      clearInterval(intervalId);
    };
  }, [currentUrl]);

  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.href !== currentUrl) {
        setCurrentUrl(window.location.href);
      }
    };
    const intervalId = setInterval(handleUrlChange, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUrl]);

  //detect clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        lengthButtonContainerRef.current &&
        !lengthButtonContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setLengthEditError(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update refs when the state changes, refs are needed due to how handleSubmit is configured as a listener but needs to access its latest value
  useEffect(() => {
    isAnyLengthRef.current = isAnyLength;
    selectedLengthRef.current = selectedLength;
  }, [isAnyLength, selectedLength]);

  //modfiy prompt test sent when prompt is submitted to the server
  const handleSubmit = (event) => {
    const clickedButton = event.target.closest("button"); //the target is the svg
    if (clickedButton && clickedButton.dataset.testid !== "send-button") {
      return;
    }

    event.stopImmediatePropagation();
    const form = event.target.closest("form");
    if (form) {
      const p = form.querySelector("p");
      if (p && !isAnyLengthRef.current) {
        p.textContent =
          `in less than ${selectedLengthRef.current} words ` + p.textContent;
      }
    }

    //the send button will change to a stop button so we need to reattach the listeners
    setTimeout(() => {
      if (attachSendListenersRef.current) {
        attachSendListenersRef.current();
      }
    }, 1000);
  };

  useEffect(() => {
    const attachSendListeners = () => {
      //select butttons that are not disabled and not the stop button
      let sendButton = document.querySelector(
        'button[data-testid="send-button"]:not(:disabled):not([data-testid="stop-button"])'
      );
      if (sendButton) {
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
        setTimeout(attachSendListeners, 500);
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
    setIsAnyLength(false);
    setSelectedLength(length);
    setIsOpen(false);
    setButtonClickedOnce(true);
  };

  //checks whether length is positive and unique
  const isLengthValid = (newLength) => {
    newLength = parseInt(newLength);
    if (newLength <= 0) {
      setLengthEditError("Response length cannot be 0 or negative");
      return false;
    }
    if (lengthOptions.includes(newLength)) {
      setLengthEditError("The new response length must be unique");
      return false;
    }
    return true;
  };

  const handleLengthEdit = (newLength, index) => {
    newLength = parseInt(newLength);
    if (!isLengthValid(newLength)) {
      return;
    }
    //if the length we're editing is the one that we selected we need to update selectedLength
    if (index == lengthOptions.indexOf(selectedLength)) {
      setSelectedLength(newLength);
    }
    const newLengthOptions = [...lengthOptions];
    newLengthOptions[index] = newLength;
    setLengthOptions(newLengthOptions);
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
    <div ref={lengthButtonContainerRef} className="length-button-container">
      <button onClick={() => setIsOpen(!isOpen)} className="gpt-ext-button">
        <FontAwesomeIcon icon={faRuler} style={{ fontSize: "16px" }} />
        {isWideScreen && (
          <>
            <span>{getButtonText()}</span>
            <FontAwesomeIcon icon={faChevronDown} className="icon" />
          </>
        )}
      </button>
      {isOpen && (
        <div ref={lengthMenuContainerRef} className="length-menu-container">
          {lengthEditError && <p className="error-text">{lengthEditError}</p>}
          {/*Need to have an option for the any length, need to figure out how to change length*/}
          {lengthOptions.map((length, index) => (
            <LengthOption
              key={length}
              isLengthValid={isLengthValid}
              handleSelectLength={(length) => handleSelectLength(length)}
              handleLengthEdit={(newLength) =>
                handleLengthEdit(newLength, index)
              }
              length={length}
              isSelected={selectedLength === length}
            />
          ))}
          <button
            onClick={() => {
              setIsAnyLength(true);
              setIsOpen(false);
              setSelectedLength(null);
              setButtonClickedOnce(true);
            }}
            className="menu-button"
          >
            Any Length
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponseLengthSelector;

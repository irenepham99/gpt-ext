import React from "react";
import { createRoot } from "react-dom/client";
import ResponseLengthSelector from "./ResponseLengthSelector";
import ScrollUpButton from "./ScrollUpButton";

//let previousUrl = window.location.href;

//Function to inject the React component
const injectScrollUpButton = () => {
  // const mainContent = document.querySelector("main");
  // if (mainContent) {
  const injectElement = document.createElement("div");
  injectElement.id = "scroll-up-button-container";
  injectElement.style.position = "relative";
  // mainContent.appendChild(injectElement);
  document.body.appendChild(injectElement);
  const root = createRoot(injectElement);
  root.render(<ScrollUpButton />);
  //}
};

const injectResponseLengthSelector = () => {
  const injectElement = document.createElement("div");
  injectElement.id = "response-length-selector-container";
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
    injectResponseLengthSelector();
    injectScrollUpButton();
  } else {
    console.log("main not found");
  }
}, 500);

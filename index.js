import { createRoot } from "react-dom/client";
import ResponseLengthSelector from "./ResponseLengthSelector";
import React from "react";
import ScrollUpButton from "./ScrollUpButton";

// Function to inject the React component
const injectReactComponent = () => {
  const injectElement = document.createElement("div");
  injectElement.id = "response-length-selector-root";
  document.body.appendChild(injectElement);

  const root = createRoot(injectElement);
  root.render(
    <React.Fragment>
      <ResponseLengthSelector />
      <ScrollUpButton />
    </React.Fragment>
  );
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

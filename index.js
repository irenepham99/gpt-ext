import { createRoot } from "react-dom/client";
import ResponseLengthSelector from "./ResponseLengthSelector";
import React from "react";
import ScrollUpButton from "./ScrollUpButton";

// Function to inject the React component
const injectResponseLengthSelector = () => {
  const profileButton = document.querySelector(
    'button[data-testid="profile-button"]'
  );
  if (profileButton) {
    const container = profileButton.parentElement("div");
    if (container) {
      const injectElement = document.createElement("div");
      injectElement.id = "response-length-selector-root";
      container.insertBefore(injectElement, container.firstChild);

      const root = createRoot(injectElement);
      root.render(<ResponseLengthSelector />);
    }
  }
};

const injectScrollUpButton = () => {
  const mainContent = document.querySelector("main");
  if (mainContent) {
    const injectElement = document.createElement("div");
    injectElement.id = "scroll-up-button-container";
    injectElement.style.position = "relative";
    mainContent.appendChild(injectElement);
    const root = createRoot(injectElement);
    root.render(<ScrollUpButton />);
  }
};

// Poll every 500ms until the main element is found
const intervalId = setInterval(() => {
  const main = document.querySelector("main");
  console.log("polling for main");

  if (main) {
    clearInterval(intervalId);
    injectResponseLengthSelector();
    injectScrollUpButton();
  }
}, 500);

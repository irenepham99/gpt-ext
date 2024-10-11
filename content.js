// Function to inject the button when the main element is available
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("css/all.min.css"); // Ensure this path points to your Font Awesome CSS
document.head.appendChild(link);

function injectButton() {
  const main = document.querySelector("main");

  if (main) {
    console.log("Main element found!");

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-chevron-down");
    icon.style.fontSize = "12px";
    icon.style.color = "white";
    icon.style.paddingLeft = "8px";

    const button = document.createElement("button");
    button.textContent = "Response Length";
    button.appendChild(icon);
    button.id = "top-left-button";

    button.addEventListener("click", () => {
      const placeholderElement = document.querySelector("p.placeholder");
      if (placeholderElement) {
        console.log("Placeholder element found");
        const newPElement = document.createElement("p");
        newPElement.textContent = "TEST";
        placeholderElement.parentNode.replaceChild(
          newPElement,
          placeholderElement
        );
      } else {
        console.log("Placeholder element not found");
      }
    });

    main.insertAdjacentElement("afterend", button);
  } else {
    console.log("Main element not found, trying again...");
  }
}

// Poll every 500ms until the main element is found
const intervalId = setInterval(() => {
  const main = document.querySelector("main");
  console.log("polling for main");

  if (main) {
    clearInterval(intervalId); // Stop the polling once the main element is found
    injectButton(); // Inject the button
  }
}, 500);

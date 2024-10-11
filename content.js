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

    // Create a container for the dropdown
    const dropdownContainer = document.createElement("div");
    dropdownContainer.id = "response-length-dropdown";
    dropdownContainer.style.position = "absolute";
    dropdownContainer.style.top = "30px";
    dropdownContainer.style.right = "160px";
    dropdownContainer.style.backgroundColor = "#2d2d2d";
    dropdownContainer.style.border = "1px solid #424242";
    dropdownContainer.style.borderRadius = "4px";
    dropdownContainer.style.padding = "10px";
    dropdownContainer.style.zIndex = "10001";

    // Create radio buttons
    const options = ["Short", "Medium", "Long"];
    options.forEach((option) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.style.marginBottom = "5px";
      label.style.color = "#ececec";
      label.style.cursor = "pointer";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "response-length";
      radio.value = option.toLowerCase();
      radio.style.marginRight = "5px";

      label.appendChild(radio);
      label.appendChild(document.createTextNode(option));
      dropdownContainer.appendChild(label);
    });

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
    // Append the dropdown to the button
    main.insertAdjacentElement("afterend", dropdownContainer);
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

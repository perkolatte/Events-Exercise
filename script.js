document.addEventListener("DOMContentLoaded", function () {
  const boxContainer = document.getElementById("box-container");
  const newBoxButton = document.getElementById("new-box-button");
  const colorForm = document.getElementById("color-form");
  const colorInput = document.getElementById("color-input");

  let boxColor = "black";
  let boxContrastColor = "green";
  let boxIdCounter = 0;

  colorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const userInput = colorInput.value.trim();

    // Validate the user's color input by checking if the browser can parse it.
    const tempStyle = new Option().style;
    tempStyle.color = userInput;
    if (tempStyle.color === "") {
      alert(`"${userInput}" is not a valid CSS color.`);
      return; // Abort if the color is invalid.
    }

    boxColor = userInput;
    boxContrastColor = getContrastColor(userInput);

    const boxes = document.getElementsByClassName("box");

    for (const box of boxes) {
      applyBoxStyles(box);
    }

    colorInput.value = "";
  });

  function getContrastColor(mainColor) {
    const tempDiv = document.createElement("div");
    tempDiv.style.color = mainColor;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    const [r, g, b] = computedColor.match(/\d+/g).map(Number);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // For very dark colors, use "terminal green" for high contrast and style.
    if (luminance < 40) {
      return "green";
    }

    // Check if the color is in a low-contrast "mid-range" (grey-ish).
    const isMidRange =
      r > 60 && r < 200 && g > 60 && g < 200 && b > 60 && b < 200;

    if (isMidRange) {
      return luminance > 128 ? "black" : "white";
    }

    // Otherwise, the simple complementary color is likely sufficient.
    return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
  }

  function applyBoxStyles(boxElement) {
    boxElement.style.backgroundColor = boxColor;
    boxElement.style.color = boxContrastColor;
    boxElement.style.borderColor = boxContrastColor;
  }

  function addNewBox() {
    // 1. Create a new div element.
    const newBox = document.createElement("div");
    // 2. Set its class, id, data-id attribute, text content, and background color.
    newBox.classList.add("box");
    newBox.id = boxIdCounter.toString();
    newBox.textContent = newBox.id;
    applyBoxStyles(newBox);
    newBox.dataset.id = boxIdCounter;
    // 3. Append it to the boxContainer.
    boxContainer.appendChild(newBox);
    // 4. Increment the boxIdCounter.
    boxIdCounter++;
  }

  newBoxButton.addEventListener("click", addNewBox);

  document.addEventListener("keydown", function (event) {
    // Ignore key presses if the user is typing in the input field.
    if (document.activeElement === colorInput) return;

    if (event.key.toLowerCase() === "n") {
      addNewBox();
    }
  });

  ["mouseover", "mouseout", "dblclick"].forEach((eventType) => {
    boxContainer.addEventListener(eventType, handleBoxEvents);
  });

  function handleBoxEvents(event) {
    const target = event.target;
    // Do nothing if the event didn't originate from a box.
    if (!target.classList.contains("box")) return;

    switch (event.type) {
      case "mouseover":
        const rect = target.getBoundingClientRect();
        target.textContent = `(${Math.round(rect.left)}, ${Math.round(
          rect.top
        )})`;
        break;
      case "mouseout":
        target.textContent = target.dataset.id;
        break;
      case "dblclick":
        target.remove();
        break;
    }
  }
});

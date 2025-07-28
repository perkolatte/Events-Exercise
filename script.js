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

    // A trick to validate a CSS color string. By assigning the string
    // to the `color` property of a disconnected element's style object, we
    // leverage the browser's own CSS parser. If the browser can't parse it,
    // it leaves the property as an empty string.
    const tempStyle = new Option().style;
    tempStyle.color = userInput;
    if (tempStyle.color === "") {
      alert(`"${userInput}" is not a valid CSS color.`);
      colorInput.value = "";
      return;
    }

    boxColor = userInput;
    boxContrastColor = getContrastColor(userInput);

    const boxes = document.getElementsByClassName("box");

    for (const box of boxes) {
      applyBoxStyles(box);
    }

    colorInput.value = "";
  });

  function getContrastColor(color) {
    // Create a temporary, unattached element to have the browser
    // parse any valid CSS color string into a standard RGB format.
    const tempDiv = document.createElement("div");
    tempDiv.style.color = color;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // Calculate the color's perceived brightness (luminance) using the
    // formula (ITU-R BT.601). This weights RGB values to
    // better match human perception.
    const [r, g, b] = computedColor.match(/\d+/g).map(Number);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // For very dark colors (luminance < 40), use "terminal green" for style.
    if (luminance < 40) {
      return "green";
    }

    // Check if the color is in a low-contrast "mid-range" (grey-ish).
    const isMidRange =
      r > 60 && r < 200 && g > 60 && g < 200 && b > 60 && b < 200;

    if (isMidRange) {
      // For mid-range colors, fall back to pure black or white based on luminance.
      return luminance > 128 ? "black" : "white";
    }

    // For saturated colors, a simple complementary color is usually sufficient.
    return `rgb(${255 - r}, ${255 - g}, ${255 - b})`;
  }

  function applyBoxStyles(boxElement) {
    boxElement.style.backgroundColor = boxColor;
    boxElement.style.color = boxContrastColor;
    boxElement.style.borderColor = boxContrastColor;
  }

  function addNewBox() {
    const newBox = document.createElement("div");
    newBox.classList.add("box");
    newBox.id = boxIdCounter.toString();
    newBox.textContent = newBox.id;
    applyBoxStyles(newBox);
    newBox.dataset.id = boxIdCounter;
    boxContainer.appendChild(newBox);
    boxIdCounter++;
  }

  newBoxButton.addEventListener("click", addNewBox);

  document.addEventListener("keydown", function (event) {
    // Ignore key presses if the user is currently typing in the input field.
    if (document.activeElement === colorInput) return;

    if (event.key.toLowerCase() === "n") {
      addNewBox();
    }
  });

  // Use event delegation for all box interactions. This is more performant
  // than adding a listener to every single box, especially as more are created.
  ["mouseover", "mouseout", "dblclick"].forEach((eventType) => {
    boxContainer.addEventListener(eventType, handleBoxEvents);
  });

  function handleBoxEvents(event) {
    const target = event.target;

    // Ignore events that didn't originate from a .box element (e.g., the container itself).
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

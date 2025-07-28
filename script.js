document.addEventListener("DOMContentLoaded", function () {
  const boxContainer = document.getElementById("box-container");
  const newBoxButton = document.getElementById("new-box-button");
  const colorForm = document.getElementById("color-form");
  const colorInput = document.getElementById("color-input");

  let boxColor = "black";
  let boxIdCounter = 0;

  colorForm.addEventListener("submit", function (event) {
    event.preventDefault();

    boxColor = colorInput.value;

    const boxes = document.getElementsByClassName("box");

    for (const box of boxes) {
      box.style.backgroundColor = boxColor;
    }

    colorInput.value = "";
  });

  function addNewBox() {
    // 1. Create a new div element.
    const newBox = document.createElement("div");
    // 2. Set its class, id, data-id attribute, text content, and background color.
    newBox.classList.add("box");
    newBox.id = boxIdCounter.toString();
    newBox.textContent = newBox.id;
    newBox.style.backgroundColor = boxColor;
    newBox.dataset.id = boxIdCounter;
    // 3. Append it to the boxContainer.
    boxContainer.appendChild(newBox);
    // 4. Increment the boxIdCounter.
    boxIdCounter++;
  }

  newBoxButton.addEventListener("click", addNewBox);

  document.addEventListener("keydown", function (event) {
    if (document.activeElement !== colorInput) {
      if (event.key.toUpperCase() === "N") {
        addNewBox();
      }
    }
  });

  document.addEventListener("mouseover", function (event) {
    const target = event.target;
    if (target.classList.contains("box")) {
      const boxRect = target.getBoundingClientRect();
      const boxCoordinates = `(${Math.round(boxRect.left)},${Math.round(
        boxRect.top
      )})`;
      target.textContent = boxCoordinates;
    }
  });

  document.addEventListener("mouseout", function (event) {
    const target = event.target;
    if (target.classList.contains("box")) {
      target.textContent = target.dataset.id;
    }
  });

  document.addEventListener("dblclick", function (event) {
    if (event.target.classList.contains("box")) {
      event.target.remove();
    }
  });
});

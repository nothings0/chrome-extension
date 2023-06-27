console.log("Content script is running...");

let selectionText = "";

const bodyDOM = document.querySelector("body");

function getSelectedText() {
  let selectedText = "";

  // window.getSelection
  if (window.getSelection) {
    selectedText = window.getSelection().toString();
  }
  // document.getSelection
  else if (document.getSelection) {
    selectedText = document.getSelection().toString();
  }
  // document.selection
  else if (document.selection) {
    selectedText = document.selection.createRange().text;
  } else return "";

  return selectedText;
}

function getSelectedTextNode() {
  let selectedText = "";

  // window.getSelection
  if (window.getSelection) {
    selectedText = window.getSelection();
  }
  // document.getSelection
  else if (document.getSelection) {
    selectedText = document.getSelection();
  }
  // document.selection
  else if (document.selection) {
    selectedText = document.selection.createRange();
  } else return "";

  return selectedText;
}

function getRangeSectionText() {
  const selectionTextNode = getSelectedTextNode();

  const getRange = selectionTextNode.getRangeAt(0);
  const selectionRect = getRange.getBoundingClientRect();

  return selectionRect;
}

function renderTooltipTranslator(selectionTextRange, selectionText) {
  const tooltipWrapper = document.createElement("div");
  tooltipWrapper.id = "translator-ext-rhpteam";
  const tooltipIcon = document.createElement("div");
  tooltipIcon.classList.add("translator-ext-icon");
  tooltipIcon.innerHTML = `<img src="https://fluxquiz.netlify.app/favicon-32x32.png"/>`;

  tooltipWrapper.appendChild(tooltipIcon);

  const top = selectionTextRange.top + selectionTextRange.height + 6 + "px";
  const left =
    selectionTextRange.left +
    (selectionTextRange.width / 2 - tooltipWrapper.offsetWidth / 2) +
    "px";

  tooltipWrapper.style.position = "absolute";
  tooltipWrapper.style.borderRadius = "2px";
  tooltipWrapper.style.background = "transparent";
  tooltipWrapper.style.cursor = "pointer";
  tooltipWrapper.style.padding = "1px";
  tooltipWrapper.style.top = top;
  tooltipWrapper.style.left = left;

  bodyDOM.appendChild(tooltipWrapper);

  if (tooltipWrapper) {
    tooltipWrapper.addEventListener("click", () => {
      if (selectionText.length > 0) {
        chrome.runtime.sendMessage(selectionText);
      }
    });
  }
}

bodyDOM.addEventListener("mouseup", () => {
  const tooltipResult = document.querySelector(
    "div#translator-result-ext-rhpteam"
  );
  if (tooltipResult) tooltipResult.remove();

  selectionText = getSelectedText();

  if (selectionText.length > 0) {
    const selectionTextRange = getRangeSectionText();

    renderTooltipTranslator(selectionTextRange, selectionText);
  } else {
    const tooltipWrapper = document.querySelector("div#translator-ext-rhpteam");

    if (tooltipWrapper) tooltipWrapper.remove();
  }
});

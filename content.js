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
  tooltipWrapper.id = "translator-ext-flux";
  const tooltipIcon = document.createElement("div");
  tooltipIcon.classList.add("translator-ext-icon");
  tooltipIcon.innerHTML = `<img src="https://fluxquiz.netlify.app/favicon-32x32.png"/>`;

  tooltipWrapper.appendChild(tooltipIcon);

  const top = selectionTextRange.top + selectionTextRange.height + 6 + "px";
  const left =
    selectionTextRange.left +
    (selectionTextRange.width / 2 - tooltipWrapper.offsetWidth / 2) +
    "px";

  tooltipWrapper.style.position = "fixed";
  tooltipWrapper.style.borderRadius = "2px";
  tooltipWrapper.style.background = "transparent";
  tooltipWrapper.style.cursor = "pointer";
  tooltipWrapper.style.padding = "1px";
  tooltipWrapper.style.top = top;
  tooltipWrapper.style.left = left;

  bodyDOM.appendChild(tooltipWrapper);
  // console.log(tooltipWrapper);
  // if (tooltipWrapper) {
  tooltipWrapper.addEventListener("mousedown", (event) => {
    event.stopPropagation();
    console.log("â");
    bodyDOM.removeChild(tooltipWrapper);
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty();
    }
    if (selectionText.length > 0) {
      chrome.runtime.sendMessage(selectionText);
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message) {
          showToast(message.message.msg, message.message?.type, 30000);
        }
      });
    }
  });
  // }
}

function showToast(message, type, duration = 2000) {
  const toast = document.createElement("div");
  toast.classList.add("flux-toast");
  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.top = "100px";
  toast.style.right = "20px";
  if (type === "success") {
    toast.style.backgroundColor = "#47d864";
  } else {
    toast.style.backgroundColor = "red";
  }
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.opacity = "1";
  toast.style.zIndex = "1001";
  toast.style.transition = "opacity 0.3s ease-in-out";
  bodyDOM.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = 1;
  }, 300);

  setTimeout(() => {
    toast.style.opacity = 0;
    setTimeout(() => {
      bodyDOM.removeChild(toast);
    }, 300);
  }, duration);
}

bodyDOM.addEventListener("mouseup", () => {
  // const tooltipResult = document.querySelector("div#translator-ext-flux");
  // if (tooltipResult) tooltipResult.remove();

  selectionText = getSelectedText().trim();

  if (selectionText.length > 0) {
    const selectionTextRange = getRangeSectionText();

    renderTooltipTranslator(selectionTextRange, selectionText);
  } else {
    const tooltipWrapper = document.querySelector("div#translator-ext-flux");

    if (tooltipWrapper) tooltipWrapper.remove();
  }
});

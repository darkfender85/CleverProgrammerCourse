/** CIRCLE PROGRESSBAR INITIALIZATION **/
let circleProgress = new ProgressBar.Circle("#progressCircle", {
  color: "#aaa",
  // This has to be the same size as the maximum width to
  // prevent clipping
  strokeWidth: 5,
  trailWidth: 1,
  easing: "easeInOut",
  duration: 1400,
  text: {
    autoStyleContainer: false,
  },
  from: { color: "#679968", width: 5 },
  to: { color: "#679968", width: 5 },
  // Set default step function for all animate calls
  step: function (state, circle) {
    circle.path.setAttribute("stroke", state.color);
    circle.path.setAttribute("stroke-width", state.width);

    var value = Math.round(circle.value() * 100);
    if (value === 0) {
      circle.setText("0%");
    } else {
      circle.setText(`${value}%`);
    }
  },
});
circleProgress.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
circleProgress.text.style.fontSize = "2rem";

/*******************************************/

/** FUNCTIONS DEFINITIONS **/

function onFormSubmit(event) {
  event.preventDefault();
  let itemText = addItemForm.elements.namedItem("itemText");
  let itemTextValue = itemText.value;
  if (itemTextValue) {
    actionItemsUtils.add(itemTextValue, renderActionItem);
    itemText.value = "";
  }
}

function createHtmlElement(tag, classes, content) {
  let element = document.createElement(tag);
  if (Array.isArray(classes)) element.classList.add(...classes);
  else element.classList.add(classes);
  if (content) element.innerHTML = content;
  return element;
}

const renderActionItem = (action) => {
  let isCompleted = !!action.completed;
  let actionText = action.text;

  let itemElement = createHtmlElement(
    "div",
    isCompleted ? ["actionItem__item", "completed"] : "actionItem__item"
  );
  let mainElement = createHtmlElement("div", "actionItem__main");
  let checkElement = createHtmlElement(
    "div",
    "actionItem__check",
    '<div class="actionItem__checkBox"><i class="fas fa-check" aria-hidden="true"></i></div>'
  );
  let textElement = createHtmlElement("div", "actionItem__text", actionText);
  let deleteElement = createHtmlElement(
    "div",
    "actionItem__delete",
    '<i class="fas fa-times" aria-hidden="true"></i>'
  );

  itemElement.setAttribute("data-id", action.id);
  checkElement.addEventListener("click", (e) => {
    handleClick(e, "toggleCompleteItem");
  });
  deleteElement.addEventListener("click", (e) => {
    handleClick(e, "deleteItem");
  });

  mainElement.appendChild(checkElement);
  mainElement.appendChild(textElement);
  mainElement.appendChild(deleteElement);
  itemElement.appendChild(mainElement);
  if (action.website) {
    let favIconSpan = action.website.fav_icon
      ? `<div class="actionItem__favIconEl"><img src="${action.website.fav_icon}"></div>`
      : "";
    let websiteContent = `<a href="${action.website.url}">
      ${favIconSpan}
      <div class ="actionItem__urlTextEl">${action.website.title}</div>
    </a>`;
    let websiteElement = createHtmlElement(
      "div",
      "actionItem__quickSite",
      websiteContent
    );
    websiteElement.addEventListener("click", (e) => {
      window.open(e.target.getAttribute("href"));
    });
    itemElement.appendChild(websiteElement);
  }
  listActionItems.prepend(itemElement);
};

const handleClick = (event, functionName) => {
  let actionItem = event.target.parentElement.parentElement;
  let itemId = actionItem.getAttribute("data-id");

  actionItemsUtils[functionName](itemId);
};

const renderActionItems = (actionItems) => {
  actionItems.forEach((action) => renderActionItem(action));
};

const createQuickActionListener = () => {
  let buttons = document.querySelectorAll(".actionInput_suggestions button");

  console.log(buttons);
  buttons.forEach((btn) => {
    btn.addEventListener("click", handleQuickActionListener);
  });
};

const handleQuickActionListener = (event) => {
  let text = event.target.getAttribute("data-text");
  if (text === "Read this site") {
    getCurrentTab().then((tab) => {
      actionItemsUtils.quickAddSite(text, tab, renderActionItem);
    });
  } else actionItemsUtils.add(text, renderActionItem);
};

async function getCurrentTab() {
  return await new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        windowId: chrome.windows.WINDOW_ID_CURRENT,
        highlighted: true,
      },
      (results) => {
        if (results.length) resolve(results[0]);
        else reject(results);
      }
    );
  });
}

const createUpdateNameDialogListener = () => {
  let greetingName = document.querySelector(".greeting_name");
  let greetingNameValue = document.querySelector(".greeting_name .name__value");
  let dialogSubmitButton = document.querySelector("#buttonSubmitName");

  greetingName.addEventListener("click", () => {
    $("#changeNameDialog").modal("show");
  });
  console.log(dialogSubmitButton);
  dialogSubmitButton.addEventListener("click", handleUpdateName);
};

const setUserName = (nameToDisplay) => {
  if (nameToDisplay)
    document.querySelector(
      ".greeting_name .name__value"
    ).innerHTML = nameToDisplay;
};

const handleUpdateName = () => {
  let inputEl = document.getElementById("inputName");
  let inputName = inputEl.value;
  if (inputName) {
    actionItemsUtils.saveNameOnStorage(inputName, (resp) => {
      setUserName(inputName);
      inputEl.value = "";
      $("#changeNameDialog").modal("hide");
    });
  }
};

const getGreetingsVariation = (currentHour) => {
  switch(true){
    case currentHour>= 5 && currentHour <=11: return 'morning';
    case currentHour>= 12 && currentHour <=17: return 'afternoon';
    case currentHour>= 18 && currentHour <=21: return 'evening';
    case currentHour>= 21 && currentHour <=5: return 'night';
    default: return 'morning';
  }
}

const setGreetingsInfos = () => {
  let greetingsVariation = getGreetingsVariation(new Date().getHours());
  let greetingCapitalized = greetingsVariation.charAt(0).toUpperCase() + greetingsVariation.slice(1);

  document.querySelector('.greeting_type').innerHTML = `Good ${greetingCapitalized},`;
  document.getElementById('greeting_image').setAttribute('src', `./images/good-${greetingsVariation}.png`);
}

/***********************************************/

let addItemForm = document.getElementById("addItemForm");
let listActionItems = document.querySelector(".actionItems");
let actionItemsUtils = new ActionItems();

actionItemsUtils.getNameFromStorage();
addItemForm.addEventListener("submit", onFormSubmit);
createQuickActionListener();
chrome.storage.onChanged.addListener((changes, namespace) => {
  actionItemsUtils.setProgress();
});
createUpdateNameDialogListener();
setGreetingsInfos();

class ActionItems {
  constructor() {
    let me = this;
    me.actionItems = [];
    me.getCurrentData((data) => {
      renderActionItems(data.actionItems);
      me.setProgress();
    });
  }

  getCurrentData(callbackFunction) {
    chrome.storage.sync.get(["actionItems"], (data) => {
      if (data.actionItems) this.actionItems = data.actionItems;
      if (callbackFunction) callbackFunction(data);
    });
  }

  add(text, callbackFn, website = null) {
    let me = this;
    let dateAdd = new Date();
    let actionItem = {
      id: uuidv4(),
      added: dateAdd.toString(),
      text,
      completed: null,
      website,
    };

    me.getCurrentData((currentData) => {
      me.actionItems = [...me.actionItems, actionItem];
      chrome.storage.sync.set({ actionItems: me.actionItems }, () => {
        callbackFn(actionItem);
      });
    });
  }

  toggleCompleteItem(actionId) {
    let me = this;
    let actionSelected = me.actionItems.find((item) => item.id === actionId);

    if (actionSelected) {
      actionSelected.completed = !actionSelected.completed
        ? new Date().toString()
        : null;
      chrome.storage.sync.set({ actionItems: me.actionItems }, () => {
        //mark completed the DOM element
        document
          .querySelector(`[data-id="${actionId}"]`)
          .classList.toggle("completed", !!actionSelected.completed);
      });
    }
  }

  deleteItem(actionId) {
    let me = this;
    let actionSelected = me.actionItems.find((item) => item.id === actionId);

    if (actionSelected) {
      me.actionItems = me.actionItems.filter(
        (item) => item.id !== actionSelected.id
      );
      chrome.storage.sync.set({ actionItems: me.actionItems }, () => {
        // remove dom element
        document.querySelector(`[data-id="${actionSelected.id}"]`).remove();
      });
    }
  }

  quickAddSite(text, { url, favIconUrl, title }, callbackFn) {
    let website = {
      url,
      fav_icon: favIconUrl,
      title,
    };

    console.log("website", website);

    this.add(text, callbackFn, website);
  }

  saveNameOnStorage(nameToSave, callbackFn) {
    chrome.storage.sync.set({ userName: nameToSave }, callbackFn);
  }

  getNameFromStorage () {
    chrome.storage.sync.get("userName", (response) => {
      let nameStored = response.userName;

      if (!nameStored) nameStored = "User";
      setUserName(nameStored);
    });
  }

  setBrowserBadge (leftTasks) {
    let text = `${leftTasks}`;
    if(leftTasks > 9) text = '9+';
    if(leftTasks <= 0) text = ''
    chrome.browserAction.setBadgeText({text: text });
  }

  setProgress = () => {
    let me = this;
    let totalTasks = me.actionItems.length;
    let completedTask = me.actionItems.filter((item) => !!item.completed)
      .length;

    me.setBrowserBadge( !!totalTasks ? totalTasks-completedTask : 0 );
    if (!totalTasks) totalTasks = 1;

    circleProgress.animate(completedTask / totalTasks);
  };
}

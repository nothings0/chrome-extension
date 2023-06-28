chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let accessToken;
  let card;
  chrome.storage.local.get(["user", "card"], function (result) {
    accessToken = result.user.accessToken;
    card = result.card.id;
    const data = {
      card,
      prompt: message,
      answer: "",
    };
    // https://backend-kfnn.onrender.com/v1/card/user
    fetch(`https://backend-kfnn.onrender.com/v1/card/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((resp) => {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                message: resp,
              },
              function (response) {}
            );
          }
        );
      })
      .catch((err) => {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                message: {
                  msg: "Có lỗi xảy ra!!!",
                },
              },
              function (response) {}
            );
          }
        );
      });
  });
});

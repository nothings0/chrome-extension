chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let accessToken;
  let card;
  chrome.storage.local.get(["user", "card"], function (result) {
    accessToken = result.user.accessToken;
    card = result.card;
    const data = {
      card,
      prompt: message,
      answer: "",
    };
    fetch(`https://backend-kfnn.onrender.com/v1/card/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((res) => res)
      .then((resp) => window.alert("success!!!"))
      .catch((err) => console.log(err));
  });
});

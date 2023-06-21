document.addEventListener("mouseup", async () => {
  let res = window.getSelection()!.toString();

  // if (!res) {
  //   return;
  // }
  chrome.storage.local.set({ target: res });
  console.log("saved");
});

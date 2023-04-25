
// document.addEventListener("click", () => {
//   let res = window.getSelection()!.toString()
//   console.log(res)
//   localStorage.setItem('target', res);
// });
document.addEventListener("selectionchange", () => {
  let res = window.getSelection()!.toString()
  console.log(res)
  //localStorage.setItem('TTR', res);
  chrome.storage.local.set({ target: res }, () => console.log("saved"))
});
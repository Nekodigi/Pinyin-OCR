
// document.addEventListener("click", () => {
//   let res = window.getSelection()!.toString()
//   console.log(res)
//   localStorage.setItem('target', res);
// });
var hanzi: any;
chrome.storage.local.get(['hanzi'], function(res) {
  if(res.target){
    hanzi = res.target;
    
  }else{
    hanzi = require("hanzi");
    chrome.storage.local.set({ hanzi: hanzi }, () => console.log("hanzi"))
    hanzi.start();
  }
});



document.addEventListener("selectionchange", () => {
  let res = window.getSelection()!.toString()
  let words = hanzi.segment(res) as string[]

  console.log(words)
  //localStorage.setItem('TTR', res);
  chrome.storage.local.set({ target: words }, () => console.log("saved"))
});
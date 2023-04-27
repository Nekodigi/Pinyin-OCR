
// document.addEventListener("click", () => {
//   let res = window.getSelection()!.toString()
//   console.log(res)
//   localStorage.setItem('target', res);
// });

import axios from "axios";
import { API_URL } from "./env";

//var hanzi = require("hanzi");
// var hanzi: any;
// chrome.storage.local.get(['hanzi'], function(res) {
//   if(res.target){
//     hanzi = res.target;
    
//   }else{
//     hanzi = require("hanzi");
//     chrome.storage.local.set({ hanzi: hanzi }, () => console.log("hanzi"))
//     hanzi.start();
//   }
// });



document.addEventListener("mouseup", async () => {
  let res = window.getSelection()!.toString()
  console.log(res)
  //var voices = window.speechSynthesis.getVoices();
  //console.log(voices.map(voice => voice.name))

  if (!res){
    return 
  }
  //let words = hanzi.segment(res) as string[]
  let words = await axios({
      method: "post",
      url: `${API_URL}/segmentation`,
      data: {"Text": res},
    });
    if (words.status === 204){
      chrome.storage.local.set({ target: ["ERR"] }, () => console.log("saved"))
    }else{
      console.log(words.data)
      chrome.storage.local.set({ target: words.data }, () => console.log("saved"))
    }
});
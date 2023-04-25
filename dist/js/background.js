/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/background.tsx ***!
  \****************************/

// document.addEventListener("click", () => {
//   let res = window.getSelection()!.toString()
//   console.log(res)
//   localStorage.setItem('target', res);
// });
document.addEventListener("selectionchange", () => {
    let res = window.getSelection().toString();
    console.log(res);
    //localStorage.setItem('TTR', res);
    chrome.storage.local.set({ target: res }, () => console.log("saved"));
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLGFBQWE7QUFDNUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbi8vICAgbGV0IHJlcyA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKSEudG9TdHJpbmcoKVxyXG4vLyAgIGNvbnNvbGUubG9nKHJlcylcclxuLy8gICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGFyZ2V0JywgcmVzKTtcclxuLy8gfSk7XHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJzZWxlY3Rpb25jaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgbGV0IHJlcyA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpO1xyXG4gICAgY29uc29sZS5sb2cocmVzKTtcclxuICAgIC8vbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1RUUicsIHJlcyk7XHJcbiAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyB0YXJnZXQ6IHJlcyB9LCAoKSA9PiBjb25zb2xlLmxvZyhcInNhdmVkXCIpKTtcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
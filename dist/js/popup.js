/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/consts/status.ts":
/*!******************************!*\
  !*** ./src/consts/status.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.status = void 0;
exports.status = {
    GLOBAL_QUOTA_NOT_ENOUGH: "GLOBAL_QUOTA_NOT_ENOUGH",
    QUOTA_NOT_ENOUGH: "QUOTA_NOT_ENOUGH",
    USER_QUOTA_UPDATED: "USER_QUOTA_UPDATED",
    SERVICE_QUOTA_UPDATED: "SERVICE_QUOTA_UPDATED",
    OK: "OK",
    FAILED: "FAILED",
};


/***/ }),

/***/ "./src/env.ts":
/*!********************!*\
  !*** ./src/env.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SERVICE_ID = exports.SERVICE_FRAMEWORK_BE_URL = exports.SERVICE_FRAMEWORK_URL = exports.API_URL = void 0;
exports.API_URL = "https://pinyin-ocr-backend-o3mmnjeefa-an.a.run.app"; //
exports.SERVICE_FRAMEWORK_URL = "https://service.nekodigi.com";
exports.SERVICE_FRAMEWORK_BE_URL = "https://charge-framework-backend-o3mmnjeefa-an.a.run.app";
exports.SERVICE_ID = "pinyin-ocr";


/***/ }),

/***/ "./src/popup.tsx":
/*!***********************!*\
  !*** ./src/popup.tsx ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const react_1 = __importStar(__webpack_require__(/*! react */ "./node_modules/react/index.js"));
const client_1 = __importDefault(__webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js"));
const axios_1 = __importStar(__webpack_require__(/*! axios */ "./node_modules/axios/dist/browser/axios.cjs"));
const material_1 = __webpack_require__(/*! @mui/material */ "./node_modules/@mui/material/index.js");
const env_1 = __webpack_require__(/*! ./env */ "./src/env.ts");
var pinyin = __webpack_require__(/*! chinese-to-pinyin */ "./node_modules/chinese-to-pinyin/index.js");
const status_1 = __webpack_require__(/*! ./consts/status */ "./src/consts/status.ts");
const Popup = () => {
    const [res, setRes] = (0, react_1.useState)(react_1.default.createElement("div", null));
    const [translate, setTranslate] = (0, react_1.useState)("");
    const firstCall = (0, react_1.useRef)(true);
    const [error, setError] = (0, react_1.useState)("");
    const [errorUrl, setErrorUrl] = (0, react_1.useState)("");
    const [browserId, setBrowserId] = (0, react_1.useState)("");
    const [userId, setUserId] = (0, react_1.useState)("");
    const [redirectId, setRedirectId] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        chrome.storage.local.get(["browserId"], (res) => __awaiter(void 0, void 0, void 0, function* () {
            let id;
            if (!res.browserId) {
                let res = yield (0, axios_1.default)({
                    method: "get",
                    url: `${env_1.SERVICE_FRAMEWORK_BE_URL}/user/unique_id`,
                });
                id = res.data.id;
                chrome.storage.local.set({ browserId: id });
            }
            else {
                id = res.browserId;
            }
            let redirectRes = yield (0, axios_1.default)({
                method: "get",
                url: `${env_1.SERVICE_FRAMEWORK_BE_URL}/redirect/${env_1.SERVICE_ID}/${id}`,
            });
            let redirectedUser = redirectRes.data.id;
            setRedirectId(redirectedUser);
            setUserId(redirectedUser ? redirectedUser : id);
            setBrowserId(id);
        }));
    }, []);
    const dashBoardUrl = (0, react_1.useMemo)(() => `${env_1.SERVICE_FRAMEWORK_URL}/${env_1.SERVICE_ID}?link_target=${browserId}`, [browserId]);
    const displayWord = (userId, word) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!word)
            return;
        try {
            console.log(userId, word);
            let words = yield (0, axios_1.default)({
                method: "post",
                url: `${env_1.API_URL}/segmentation`,
                data: { UserId: userId, Text: word },
            });
            displayWords(words.data);
        }
        catch (e) {
            if ((0, axios_1.isAxiosError)(e)) {
                displayWords([]);
                switch ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data.status) {
                    case status_1.status.GLOBAL_QUOTA_NOT_ENOUGH:
                        setError("Too many free user. Please subscribe.");
                        setErrorUrl(dashBoardUrl);
                        break;
                    case status_1.status.QUOTA_NOT_ENOUGH:
                        setError("You used all your quota. Please subscribe.");
                        setErrorUrl(dashBoardUrl);
                        break;
                    default:
                        setError("Something went wrong. Please try again later.");
                        break;
                }
            }
        }
    });
    const displayWords = (words) => {
        let pinyinWord = words.map((word) => (react_1.default.createElement("ruby", null,
            word,
            react_1.default.createElement("rt", { "data-rt": pinyin(word) }))));
        setRes(react_1.default.createElement("div", { style: { fontSize: 24 } }, pinyinWord));
        const uttr = new SpeechSynthesisUtterance(words.join(""));
        uttr.lang = "zh-CN";
        uttr.voice = window.speechSynthesis
            .getVoices()
            .filter((voice) => voice.voiceURI.length == "Google 普通话（中国大陆）".length)[0];
        uttr.rate = 0.8;
        // 発言を再生 (発言キューに発言を追加)
        speechSynthesis.speak(uttr);
    };
    const doTranslate = (target) => __awaiter(void 0, void 0, void 0, function* () {
        let eng = yield (0, axios_1.default)({
            method: "post",
            url: `${env_1.API_URL}/translate`,
            data: { UserId: userId, Text: target, LangTo: "en" },
        });
        if (eng.status === 204) {
            setTranslate("ERR");
        }
        else {
            setTranslate(eng.data);
            const uttr = new SpeechSynthesisUtterance(target);
            uttr.lang = "zh-CN";
            uttr.voice = window.speechSynthesis
                .getVoices()
                .filter((voice) => voice.voiceURI.length == "Google 普通话（中国大陆）".length)[0];
            // 発言を再生 (発言キューに発言を追加)
            uttr.rate = 0.8;
            speechSynthesis.speak(uttr);
        }
        return;
    });
    (0, react_1.useEffect)(() => {
        if (!userId)
            return;
        if (!firstCall.current)
            return;
        firstCall.current = false;
        const f = () => __awaiter(void 0, void 0, void 0, function* () {
            window.speechSynthesis.getVoices();
            // chrome.storage.local.get(["target"], function (res) {
            //   displayWords(res.target as string[]);
            // });
            chrome.storage.local.get(["target"], (res) => {
                displayWord(userId, res.target);
            });
            document.addEventListener("mouseup", () => {
                doTranslate(window.getSelection().toString());
            });
            window.addEventListener("paste", (e) => e && e.clipboardData ? uploadFile(e.clipboardData.files[0]) : null);
        });
        f();
    }, [userId]);
    const uploadImage = (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.target.files === null || e.target.files.length === 0)
            return;
        uploadFile(e.target.files[0]);
        e.target.files = null;
    });
    const uploadFile = (img) => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        if (!img)
            return;
        formData.append("image", img);
        formData.append("user_id", userId);
        let res_ = yield (0, axios_1.default)({
            method: "post",
            url: `${env_1.API_URL}/ocr`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (res_.status === 204) {
            setRes(react_1.default.createElement(material_1.Typography, null, res_.statusText));
        }
        else {
            displayWords(res_.data);
            chrome.storage.local.set({ target: res_.data }, () => console.log("saved"));
        }
    });
    return (react_1.default.createElement(material_1.Box, { width: "480px" },
        react_1.default.createElement(material_1.Typography, null, "Pinyin OCR"),
        res,
        react_1.default.createElement(material_1.Typography, null, translate),
        error ? (react_1.default.createElement(material_1.Alert, { severity: "error", onClick: () => {
                chrome.tabs.create({
                    url: errorUrl,
                });
            } }, error)) : null,
        react_1.default.createElement(material_1.Stack, { direction: "row", justifyContent: "space-between" },
            react_1.default.createElement("form", { action: "/upload", method: "POST" },
                react_1.default.createElement(material_1.Button, { "aria-label": "upload", component: "label" },
                    "UPLOAD",
                    react_1.default.createElement("input", { type: "file", hidden: true, id: "upload", name: "upload", onChange: (e) => uploadImage(e) }))),
            react_1.default.createElement(material_1.Button, { onClick: () => {
                    chrome.tabs.create({ url: dashBoardUrl });
                } }, redirectId ? "DASHBOARD" : "Login"))));
};
const root = client_1.default.createRoot(document.getElementById("root"));
root.render(react_1.default.createElement(react_1.default.StrictMode, null,
    react_1.default.createElement(Popup, null)));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"popup": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgithub_language_extension"] = self["webpackChunkgithub_language_extension"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wdXAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDVmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWtCLEdBQUcsZ0NBQWdDLEdBQUcsNkJBQTZCLEdBQUcsZUFBZTtBQUN2RyxlQUFlLHlEQUF5RDtBQUN4RSw2QkFBNkI7QUFDN0IsZ0NBQWdDO0FBQ2hDLGtCQUFrQjs7Ozs7Ozs7Ozs7QUNOTDtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxvQ0FBb0M7QUFDbkQ7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0EsMENBQTBDLDRCQUE0QjtBQUN0RSxDQUFDO0FBQ0Q7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QiwrREFBK0QsaUJBQWlCO0FBQzVHO0FBQ0Esb0NBQW9DLE1BQU0sK0JBQStCLFlBQVk7QUFDckYsbUNBQW1DLE1BQU0sbUNBQW1DLFlBQVk7QUFDeEYsZ0NBQWdDO0FBQ2hDO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsNkJBQTZCLG1CQUFPLENBQUMsNENBQU87QUFDNUMsaUNBQWlDLG1CQUFPLENBQUMsNERBQWtCO0FBQzNELDZCQUE2QixtQkFBTyxDQUFDLDBEQUFPO0FBQzVDLG1CQUFtQixtQkFBTyxDQUFDLDREQUFlO0FBQzFDLGNBQWMsbUJBQU8sQ0FBQywyQkFBTztBQUM3QixhQUFhLG1CQUFPLENBQUMsb0VBQW1CO0FBQ3hDLGlCQUFpQixtQkFBTyxDQUFDLCtDQUFpQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsK0JBQStCO0FBQzNELGlCQUFpQjtBQUNqQjtBQUNBLDJDQUEyQyxlQUFlO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QiwrQkFBK0IsWUFBWSxpQkFBaUIsR0FBRyxHQUFHO0FBQzFGLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0wsdURBQXVELDRCQUE0QixHQUFHLGlCQUFpQixlQUFlLFVBQVU7QUFDaEk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixjQUFjO0FBQ3RDLHdCQUF3Qiw0QkFBNEI7QUFDcEQsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELHlCQUF5QjtBQUMzRSxzREFBc0QsU0FBUyxnQkFBZ0I7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGNBQWM7QUFDbEMsb0JBQW9CLDRDQUE0QztBQUNoRSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsY0FBYztBQUNsQztBQUNBLHVCQUF1Qix1Q0FBdUM7QUFDOUQsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsbUJBQW1CO0FBQzFEO0FBQ0EsS0FBSztBQUNMLDREQUE0RCxnQkFBZ0I7QUFDNUU7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsZUFBZTtBQUNmLDBEQUEwRCxtREFBbUQ7QUFDN0csb0RBQW9ELG1DQUFtQztBQUN2RixtRUFBbUUsNENBQTRDO0FBQy9HO0FBQ0EsNkRBQTZELDJGQUEyRjtBQUN4SiwrREFBK0Q7QUFDL0QseUNBQXlDLG1CQUFtQjtBQUM1RCxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNyTkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDNUJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSxHQUFHO1dBQ0g7V0FDQTtXQUNBLENBQUM7Ozs7O1dDUEQ7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDSkE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0scUJBQXFCO1dBQzNCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBOzs7OztVRWhEQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi8uL3NyYy9jb25zdHMvc3RhdHVzLnRzIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vLi9zcmMvZW52LnRzIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vLi9zcmMvcG9wdXAudHN4Iiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvbm9kZSBtb2R1bGUgZGVjb3JhdG9yIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuc3RhdHVzID0gdm9pZCAwO1xyXG5leHBvcnRzLnN0YXR1cyA9IHtcclxuICAgIEdMT0JBTF9RVU9UQV9OT1RfRU5PVUdIOiBcIkdMT0JBTF9RVU9UQV9OT1RfRU5PVUdIXCIsXHJcbiAgICBRVU9UQV9OT1RfRU5PVUdIOiBcIlFVT1RBX05PVF9FTk9VR0hcIixcclxuICAgIFVTRVJfUVVPVEFfVVBEQVRFRDogXCJVU0VSX1FVT1RBX1VQREFURURcIixcclxuICAgIFNFUlZJQ0VfUVVPVEFfVVBEQVRFRDogXCJTRVJWSUNFX1FVT1RBX1VQREFURURcIixcclxuICAgIE9LOiBcIk9LXCIsXHJcbiAgICBGQUlMRUQ6IFwiRkFJTEVEXCIsXHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuU0VSVklDRV9JRCA9IGV4cG9ydHMuU0VSVklDRV9GUkFNRVdPUktfQkVfVVJMID0gZXhwb3J0cy5TRVJWSUNFX0ZSQU1FV09SS19VUkwgPSBleHBvcnRzLkFQSV9VUkwgPSB2b2lkIDA7XHJcbmV4cG9ydHMuQVBJX1VSTCA9IFwiaHR0cHM6Ly9waW55aW4tb2NyLWJhY2tlbmQtbzNtbW5qZWVmYS1hbi5hLnJ1bi5hcHBcIjsgLy9cclxuZXhwb3J0cy5TRVJWSUNFX0ZSQU1FV09SS19VUkwgPSBcImh0dHBzOi8vc2VydmljZS5uZWtvZGlnaS5jb21cIjtcclxuZXhwb3J0cy5TRVJWSUNFX0ZSQU1FV09SS19CRV9VUkwgPSBcImh0dHBzOi8vY2hhcmdlLWZyYW1ld29yay1iYWNrZW5kLW8zbW1uamVlZmEtYW4uYS5ydW4uYXBwXCI7XHJcbmV4cG9ydHMuU0VSVklDRV9JRCA9IFwicGlueWluLW9jclwiO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX3NldE1vZHVsZURlZmF1bHQpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcclxufSkgOiBmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBvW1wiZGVmYXVsdFwiXSA9IHY7XHJcbn0pO1xyXG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59O1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHJlYWN0XzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcInJlYWN0XCIpKTtcclxuY29uc3QgY2xpZW50XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInJlYWN0LWRvbS9jbGllbnRcIikpO1xyXG5jb25zdCBheGlvc18xID0gX19pbXBvcnRTdGFyKHJlcXVpcmUoXCJheGlvc1wiKSk7XHJcbmNvbnN0IG1hdGVyaWFsXzEgPSByZXF1aXJlKFwiQG11aS9tYXRlcmlhbFwiKTtcclxuY29uc3QgZW52XzEgPSByZXF1aXJlKFwiLi9lbnZcIik7XHJcbnZhciBwaW55aW4gPSByZXF1aXJlKFwiY2hpbmVzZS10by1waW55aW5cIik7XHJcbmNvbnN0IHN0YXR1c18xID0gcmVxdWlyZShcIi4vY29uc3RzL3N0YXR1c1wiKTtcclxuY29uc3QgUG9wdXAgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBbcmVzLCBzZXRSZXNdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwpKTtcclxuICAgIGNvbnN0IFt0cmFuc2xhdGUsIHNldFRyYW5zbGF0ZV0gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoXCJcIik7XHJcbiAgICBjb25zdCBmaXJzdENhbGwgPSAoMCwgcmVhY3RfMS51c2VSZWYpKHRydWUpO1xyXG4gICAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoXCJcIik7XHJcbiAgICBjb25zdCBbZXJyb3JVcmwsIHNldEVycm9yVXJsXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShcIlwiKTtcclxuICAgIGNvbnN0IFticm93c2VySWQsIHNldEJyb3dzZXJJZF0gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoXCJcIik7XHJcbiAgICBjb25zdCBbdXNlcklkLCBzZXRVc2VySWRdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKFwiXCIpO1xyXG4gICAgY29uc3QgW3JlZGlyZWN0SWQsIHNldFJlZGlyZWN0SWRdID0gKDAsIHJlYWN0XzEudXNlU3RhdGUpKFwiXCIpO1xyXG4gICAgKDAsIHJlYWN0XzEudXNlRWZmZWN0KSgoKSA9PiB7XHJcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImJyb3dzZXJJZFwiXSwgKHJlcykgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgICAgIGxldCBpZDtcclxuICAgICAgICAgICAgaWYgKCFyZXMuYnJvd3NlcklkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzID0geWllbGQgKDAsIGF4aW9zXzEuZGVmYXVsdCkoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJnZXRcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGAke2Vudl8xLlNFUlZJQ0VfRlJBTUVXT1JLX0JFX1VSTH0vdXNlci91bmlxdWVfaWRgLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZCA9IHJlcy5kYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgYnJvd3NlcklkOiBpZCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlkID0gcmVzLmJyb3dzZXJJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgcmVkaXJlY3RSZXMgPSB5aWVsZCAoMCwgYXhpb3NfMS5kZWZhdWx0KSh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwiZ2V0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGAke2Vudl8xLlNFUlZJQ0VfRlJBTUVXT1JLX0JFX1VSTH0vcmVkaXJlY3QvJHtlbnZfMS5TRVJWSUNFX0lEfS8ke2lkfWAsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBsZXQgcmVkaXJlY3RlZFVzZXIgPSByZWRpcmVjdFJlcy5kYXRhLmlkO1xyXG4gICAgICAgICAgICBzZXRSZWRpcmVjdElkKHJlZGlyZWN0ZWRVc2VyKTtcclxuICAgICAgICAgICAgc2V0VXNlcklkKHJlZGlyZWN0ZWRVc2VyID8gcmVkaXJlY3RlZFVzZXIgOiBpZCk7XHJcbiAgICAgICAgICAgIHNldEJyb3dzZXJJZChpZCk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfSwgW10pO1xyXG4gICAgY29uc3QgZGFzaEJvYXJkVXJsID0gKDAsIHJlYWN0XzEudXNlTWVtbykoKCkgPT4gYCR7ZW52XzEuU0VSVklDRV9GUkFNRVdPUktfVVJMfS8ke2Vudl8xLlNFUlZJQ0VfSUR9P2xpbmtfdGFyZ2V0PSR7YnJvd3NlcklkfWAsIFticm93c2VySWRdKTtcclxuICAgIGNvbnN0IGRpc3BsYXlXb3JkID0gKHVzZXJJZCwgd29yZCkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGlmICghd29yZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJJZCwgd29yZCk7XHJcbiAgICAgICAgICAgIGxldCB3b3JkcyA9IHlpZWxkICgwLCBheGlvc18xLmRlZmF1bHQpKHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICB1cmw6IGAke2Vudl8xLkFQSV9VUkx9L3NlZ21lbnRhdGlvbmAsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7IFVzZXJJZDogdXNlcklkLCBUZXh0OiB3b3JkIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkaXNwbGF5V29yZHMod29yZHMuZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGlmICgoMCwgYXhpb3NfMS5pc0F4aW9zRXJyb3IpKGUpKSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5V29yZHMoW10pO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICgoX2EgPSBlLnJlc3BvbnNlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZGF0YS5zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHN0YXR1c18xLnN0YXR1cy5HTE9CQUxfUVVPVEFfTk9UX0VOT1VHSDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IoXCJUb28gbWFueSBmcmVlIHVzZXIuIFBsZWFzZSBzdWJzY3JpYmUuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvclVybChkYXNoQm9hcmRVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIHN0YXR1c18xLnN0YXR1cy5RVU9UQV9OT1RfRU5PVUdIOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcihcIllvdSB1c2VkIGFsbCB5b3VyIHF1b3RhLiBQbGVhc2Ugc3Vic2NyaWJlLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3JVcmwoZGFzaEJvYXJkVXJsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IoXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBkaXNwbGF5V29yZHMgPSAod29yZHMpID0+IHtcclxuICAgICAgICBsZXQgcGlueWluV29yZCA9IHdvcmRzLm1hcCgod29yZCkgPT4gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwicnVieVwiLCBudWxsLFxyXG4gICAgICAgICAgICB3b3JkLFxyXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInJ0XCIsIHsgXCJkYXRhLXJ0XCI6IHBpbnlpbih3b3JkKSB9KSkpKTtcclxuICAgICAgICBzZXRSZXMocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBmb250U2l6ZTogMjQgfSB9LCBwaW55aW5Xb3JkKSk7XHJcbiAgICAgICAgY29uc3QgdXR0ciA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2Uod29yZHMuam9pbihcIlwiKSk7XHJcbiAgICAgICAgdXR0ci5sYW5nID0gXCJ6aC1DTlwiO1xyXG4gICAgICAgIHV0dHIudm9pY2UgPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzXHJcbiAgICAgICAgICAgIC5nZXRWb2ljZXMoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKCh2b2ljZSkgPT4gdm9pY2Uudm9pY2VVUkkubGVuZ3RoID09IFwiR29vZ2xlIOaZrumAmuivne+8iOS4reWbveWkp+mZhu+8iVwiLmxlbmd0aClbMF07XHJcbiAgICAgICAgdXR0ci5yYXRlID0gMC44O1xyXG4gICAgICAgIC8vIOeZuuiogOOCkuWGjeeUnyAo55m66KiA44Kt44Ol44O844Gr55m66KiA44KS6L+95YqgKVxyXG4gICAgICAgIHNwZWVjaFN5bnRoZXNpcy5zcGVhayh1dHRyKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBkb1RyYW5zbGF0ZSA9ICh0YXJnZXQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGxldCBlbmcgPSB5aWVsZCAoMCwgYXhpb3NfMS5kZWZhdWx0KSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogYCR7ZW52XzEuQVBJX1VSTH0vdHJhbnNsYXRlYCxcclxuICAgICAgICAgICAgZGF0YTogeyBVc2VySWQ6IHVzZXJJZCwgVGV4dDogdGFyZ2V0LCBMYW5nVG86IFwiZW5cIiB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChlbmcuc3RhdHVzID09PSAyMDQpIHtcclxuICAgICAgICAgICAgc2V0VHJhbnNsYXRlKFwiRVJSXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgc2V0VHJhbnNsYXRlKGVuZy5kYXRhKTtcclxuICAgICAgICAgICAgY29uc3QgdXR0ciA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2UodGFyZ2V0KTtcclxuICAgICAgICAgICAgdXR0ci5sYW5nID0gXCJ6aC1DTlwiO1xyXG4gICAgICAgICAgICB1dHRyLnZvaWNlID0gd2luZG93LnNwZWVjaFN5bnRoZXNpc1xyXG4gICAgICAgICAgICAgICAgLmdldFZvaWNlcygpXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKCh2b2ljZSkgPT4gdm9pY2Uudm9pY2VVUkkubGVuZ3RoID09IFwiR29vZ2xlIOaZrumAmuivne+8iOS4reWbveWkp+mZhu+8iVwiLmxlbmd0aClbMF07XHJcbiAgICAgICAgICAgIC8vIOeZuuiogOOCkuWGjeeUnyAo55m66KiA44Kt44Ol44O844Gr55m66KiA44KS6L+95YqgKVxyXG4gICAgICAgICAgICB1dHRyLnJhdGUgPSAwLjg7XHJcbiAgICAgICAgICAgIHNwZWVjaFN5bnRoZXNpcy5zcGVhayh1dHRyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfSk7XHJcbiAgICAoMCwgcmVhY3RfMS51c2VFZmZlY3QpKCgpID0+IHtcclxuICAgICAgICBpZiAoIXVzZXJJZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGlmICghZmlyc3RDYWxsLmN1cnJlbnQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBmaXJzdENhbGwuY3VycmVudCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IGYgPSAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgd2luZG93LnNwZWVjaFN5bnRoZXNpcy5nZXRWb2ljZXMoKTtcclxuICAgICAgICAgICAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRhcmdldFwiXSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAvLyAgIGRpc3BsYXlXb3JkcyhyZXMudGFyZ2V0IGFzIHN0cmluZ1tdKTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ0YXJnZXRcIl0sIChyZXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlXb3JkKHVzZXJJZCwgcmVzLnRhcmdldCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkb1RyYW5zbGF0ZSh3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhc3RlXCIsIChlKSA9PiBlICYmIGUuY2xpcGJvYXJkRGF0YSA/IHVwbG9hZEZpbGUoZS5jbGlwYm9hcmREYXRhLmZpbGVzWzBdKSA6IG51bGwpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGYoKTtcclxuICAgIH0sIFt1c2VySWRdKTtcclxuICAgIGNvbnN0IHVwbG9hZEltYWdlID0gKGUpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGlmIChlLnRhcmdldC5maWxlcyA9PT0gbnVsbCB8fCBlLnRhcmdldC5maWxlcy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB1cGxvYWRGaWxlKGUudGFyZ2V0LmZpbGVzWzBdKTtcclxuICAgICAgICBlLnRhcmdldC5maWxlcyA9IG51bGw7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHVwbG9hZEZpbGUgPSAoaW1nKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGlmICghaW1nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaW1hZ2VcIiwgaW1nKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJ1c2VyX2lkXCIsIHVzZXJJZCk7XHJcbiAgICAgICAgbGV0IHJlc18gPSB5aWVsZCAoMCwgYXhpb3NfMS5kZWZhdWx0KSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogYCR7ZW52XzEuQVBJX1VSTH0vb2NyYCxcclxuICAgICAgICAgICAgZGF0YTogZm9ybURhdGEsXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAocmVzXy5zdGF0dXMgPT09IDIwNCkge1xyXG4gICAgICAgICAgICBzZXRSZXMocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQobWF0ZXJpYWxfMS5UeXBvZ3JhcGh5LCBudWxsLCByZXNfLnN0YXR1c1RleHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRpc3BsYXlXb3JkcyhyZXNfLmRhdGEpO1xyXG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyB0YXJnZXQ6IHJlc18uZGF0YSB9LCAoKSA9PiBjb25zb2xlLmxvZyhcInNhdmVkXCIpKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQobWF0ZXJpYWxfMS5Cb3gsIHsgd2lkdGg6IFwiNDgwcHhcIiB9LFxyXG4gICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KG1hdGVyaWFsXzEuVHlwb2dyYXBoeSwgbnVsbCwgXCJQaW55aW4gT0NSXCIpLFxyXG4gICAgICAgIHJlcyxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChtYXRlcmlhbF8xLlR5cG9ncmFwaHksIG51bGwsIHRyYW5zbGF0ZSksXHJcbiAgICAgICAgZXJyb3IgPyAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQobWF0ZXJpYWxfMS5BbGVydCwgeyBzZXZlcml0eTogXCJlcnJvclwiLCBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogZXJyb3JVcmwsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSB9LCBlcnJvcikpIDogbnVsbCxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChtYXRlcmlhbF8xLlN0YWNrLCB7IGRpcmVjdGlvbjogXCJyb3dcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiIH0sXHJcbiAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiLCB7IGFjdGlvbjogXCIvdXBsb2FkXCIsIG1ldGhvZDogXCJQT1NUXCIgfSxcclxuICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KG1hdGVyaWFsXzEuQnV0dG9uLCB7IFwiYXJpYS1sYWJlbFwiOiBcInVwbG9hZFwiLCBjb21wb25lbnQ6IFwibGFiZWxcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIFwiVVBMT0FEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7IHR5cGU6IFwiZmlsZVwiLCBoaWRkZW46IHRydWUsIGlkOiBcInVwbG9hZFwiLCBuYW1lOiBcInVwbG9hZFwiLCBvbkNoYW5nZTogKGUpID0+IHVwbG9hZEltYWdlKGUpIH0pKSksXHJcbiAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KG1hdGVyaWFsXzEuQnV0dG9uLCB7IG9uQ2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5jcmVhdGUoeyB1cmw6IGRhc2hCb2FyZFVybCB9KTtcclxuICAgICAgICAgICAgICAgIH0gfSwgcmVkaXJlY3RJZCA/IFwiREFTSEJPQVJEXCIgOiBcIkxvZ2luXCIpKSkpO1xyXG59O1xyXG5jb25zdCByb290ID0gY2xpZW50XzEuZGVmYXVsdC5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSk7XHJcbnJvb3QucmVuZGVyKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuZGVmYXVsdC5TdHJpY3RNb2RlLCBudWxsLFxyXG4gICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUG9wdXAsIG51bGwpKSk7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJwb3B1cFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtnaXRodWJfbGFuZ3VhZ2VfZXh0ZW5zaW9uXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2dpdGh1Yl9sYW5ndWFnZV9leHRlbnNpb25cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wb3B1cC50c3hcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
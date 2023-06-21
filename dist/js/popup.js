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
exports.API_URL = void 0;
exports.API_URL = "https://pinyin-ocr-backend-o3mmnjeefa-an.a.run.app";


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
const fingerprintjs_1 = __importDefault(__webpack_require__(/*! @fingerprintjs/fingerprintjs */ "./node_modules/@fingerprintjs/fingerprintjs/dist/fp.esm.js"));
const status_1 = __webpack_require__(/*! ./consts/status */ "./src/consts/status.ts");
const Popup = () => {
    const [res, setRes] = (0, react_1.useState)(react_1.default.createElement("div", null));
    const [translate, setTranslate] = (0, react_1.useState)("");
    const firstCall = (0, react_1.useRef)(true);
    const fp = (0, react_1.useRef)("AAAA");
    const [error, setError] = (0, react_1.useState)("");
    const [errorUrl, setErrorUrl] = (0, react_1.useState)("");
    const initFp = () => {
        return new Promise((resolve) => {
            chrome.storage.local.get(["fp"], (res) => __awaiter(void 0, void 0, void 0, function* () {
                if (res.fp) {
                    fp.current = res.fp;
                    resolve(res.fp);
                }
                else {
                    const fp_ = yield newFp();
                    fp.current = fp_;
                    resolve(fp_);
                }
            }));
            const newFp = () => __awaiter(void 0, void 0, void 0, function* () {
                const fp = yield fingerprintjs_1.default.load();
                const result = yield fp.get();
                chrome.storage.local.set({ fp: result.visitorId }, () => console.log("saved"));
                return result.visitorId;
            });
        });
    };
    const getSubscribeUrl = () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, axios_1.default)({
            method: "post",
            url: `${env_1.API_URL}/subscribe`,
            data: { UserId: fp.current },
        });
        return res.data;
    });
    const displayWord = (word) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!word)
            return;
        try {
            let words = yield (0, axios_1.default)({
                method: "post",
                url: `${env_1.API_URL}/segmentation`,
                data: { UserId: fp.current, Text: word },
            });
            displayWords(words.data);
        }
        catch (e) {
            if ((0, axios_1.isAxiosError)(e)) {
                displayWords([]);
                switch ((_a = e.response) === null || _a === void 0 ? void 0 : _a.data.status) {
                    case status_1.status.GLOBAL_QUOTA_NOT_ENOUGH:
                        setError("Too many free user. Please subscribe.");
                        setErrorUrl(yield getSubscribeUrl());
                        break;
                    case status_1.status.QUOTA_NOT_ENOUGH:
                        setError("You used all your quota. Please subscribe.");
                        setErrorUrl(yield getSubscribeUrl());
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
            data: { UserId: fp.current, Text: target, LangTo: "en" },
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
        if (!firstCall.current)
            return;
        firstCall.current = false;
        const f = () => __awaiter(void 0, void 0, void 0, function* () {
            yield initFp();
            window.speechSynthesis.getVoices();
            // chrome.storage.local.get(["target"], function (res) {
            //   displayWords(res.target as string[]);
            // });
            chrome.storage.local.get(["target"], function (res) {
                displayWord(res.target);
            });
            document.addEventListener("mouseup", () => {
                doTranslate(window.getSelection().toString());
            });
            window.addEventListener("paste", (e) => e && e.clipboardData ? uploadFile(e.clipboardData.files[0]) : null);
        });
        f();
    }, []);
    const uploadImage = (0, react_1.useCallback)((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (e.target.files === null || e.target.files.length === 0)
            return;
        uploadFile(e.target.files[0]);
        e.target.files = null;
    }), [fp]);
    const uploadFile = (img) => __awaiter(void 0, void 0, void 0, function* () {
        const formData = new FormData();
        if (!img)
            return;
        formData.append("image", img);
        formData.append("user_id", fp.current);
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
        react_1.default.createElement("form", { action: "/upload", method: "POST" },
            react_1.default.createElement(material_1.Button, { "aria-label": "upload", component: "label", variant: "contained" },
                "UPLOAD",
                react_1.default.createElement("input", { type: "file", hidden: true, id: "upload", name: "upload", onChange: (e) => uploadImage(e) }))),
        res,
        react_1.default.createElement(material_1.Typography, null, translate),
        error ? (react_1.default.createElement(material_1.Alert, { severity: "error", onClick: () => {
                chrome.tabs.create({
                    url: errorUrl,
                });
            } }, error)) : null));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uLy4vc3JjL2NvbnN0cy9zdGF0dXMudHMiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi8uL3NyYy9lbnYudHMiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi8uL3NyYy9wb3B1cC50c3giLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9jaHVuayBsb2FkZWQiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2dpdGh1Yi1sYW5ndWFnZS1leHRlbnNpb24vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9ub2RlIG1vZHVsZSBkZWNvcmF0b3IiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9naXRodWItbGFuZ3VhZ2UtZXh0ZW5zaW9uL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vZ2l0aHViLWxhbmd1YWdlLWV4dGVuc2lvbi93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zdGF0dXMgPSB2b2lkIDA7XHJcbmV4cG9ydHMuc3RhdHVzID0ge1xyXG4gICAgR0xPQkFMX1FVT1RBX05PVF9FTk9VR0g6IFwiR0xPQkFMX1FVT1RBX05PVF9FTk9VR0hcIixcclxuICAgIFFVT1RBX05PVF9FTk9VR0g6IFwiUVVPVEFfTk9UX0VOT1VHSFwiLFxyXG4gICAgVVNFUl9RVU9UQV9VUERBVEVEOiBcIlVTRVJfUVVPVEFfVVBEQVRFRFwiLFxyXG4gICAgU0VSVklDRV9RVU9UQV9VUERBVEVEOiBcIlNFUlZJQ0VfUVVPVEFfVVBEQVRFRFwiLFxyXG4gICAgT0s6IFwiT0tcIixcclxuICAgIEZBSUxFRDogXCJGQUlMRURcIixcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5BUElfVVJMID0gdm9pZCAwO1xyXG5leHBvcnRzLkFQSV9VUkwgPSBcImh0dHBzOi8vcGlueWluLW9jci1iYWNrZW5kLW8zbW1uamVlZmEtYW4uYS5ydW4uYXBwXCI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xyXG59KSA6IGZ1bmN0aW9uKG8sIHYpIHtcclxuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcclxufSk7XHJcbnZhciBfX2ltcG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0U3RhcikgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChrICE9PSBcImRlZmF1bHRcIiAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgX19jcmVhdGVCaW5kaW5nKHJlc3VsdCwgbW9kLCBrKTtcclxuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn07XHJcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgcmVhY3RfMSA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwicmVhY3RcIikpO1xyXG5jb25zdCBjbGllbnRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicmVhY3QtZG9tL2NsaWVudFwiKSk7XHJcbmNvbnN0IGF4aW9zXzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImF4aW9zXCIpKTtcclxuY29uc3QgbWF0ZXJpYWxfMSA9IHJlcXVpcmUoXCJAbXVpL21hdGVyaWFsXCIpO1xyXG5jb25zdCBlbnZfMSA9IHJlcXVpcmUoXCIuL2VudlwiKTtcclxudmFyIHBpbnlpbiA9IHJlcXVpcmUoXCJjaGluZXNlLXRvLXBpbnlpblwiKTtcclxuY29uc3QgZmluZ2VycHJpbnRqc18xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJAZmluZ2VycHJpbnRqcy9maW5nZXJwcmludGpzXCIpKTtcclxuY29uc3Qgc3RhdHVzXzEgPSByZXF1aXJlKFwiLi9jb25zdHMvc3RhdHVzXCIpO1xyXG5jb25zdCBQb3B1cCA9ICgpID0+IHtcclxuICAgIGNvbnN0IFtyZXMsIHNldFJlc10gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCkpO1xyXG4gICAgY29uc3QgW3RyYW5zbGF0ZSwgc2V0VHJhbnNsYXRlXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShcIlwiKTtcclxuICAgIGNvbnN0IGZpcnN0Q2FsbCA9ICgwLCByZWFjdF8xLnVzZVJlZikodHJ1ZSk7XHJcbiAgICBjb25zdCBmcCA9ICgwLCByZWFjdF8xLnVzZVJlZikoXCJBQUFBXCIpO1xyXG4gICAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSAoMCwgcmVhY3RfMS51c2VTdGF0ZSkoXCJcIik7XHJcbiAgICBjb25zdCBbZXJyb3JVcmwsIHNldEVycm9yVXJsXSA9ICgwLCByZWFjdF8xLnVzZVN0YXRlKShcIlwiKTtcclxuICAgIGNvbnN0IGluaXRGcCA9ICgpID0+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImZwXCJdLCAocmVzKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXMuZnApIHtcclxuICAgICAgICAgICAgICAgICAgICBmcC5jdXJyZW50ID0gcmVzLmZwO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzLmZwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZwXyA9IHlpZWxkIG5ld0ZwKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnAuY3VycmVudCA9IGZwXztcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZwXyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgY29uc3QgbmV3RnAgPSAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZwID0geWllbGQgZmluZ2VycHJpbnRqc18xLmRlZmF1bHQubG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geWllbGQgZnAuZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyBmcDogcmVzdWx0LnZpc2l0b3JJZCB9LCAoKSA9PiBjb25zb2xlLmxvZyhcInNhdmVkXCIpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQudmlzaXRvcklkO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcbiAgICBjb25zdCBnZXRTdWJzY3JpYmVVcmwgPSAoKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCByZXMgPSB5aWVsZCAoMCwgYXhpb3NfMS5kZWZhdWx0KSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogYCR7ZW52XzEuQVBJX1VSTH0vc3Vic2NyaWJlYCxcclxuICAgICAgICAgICAgZGF0YTogeyBVc2VySWQ6IGZwLmN1cnJlbnQgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gcmVzLmRhdGE7XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGRpc3BsYXlXb3JkID0gKHdvcmQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBpZiAoIXdvcmQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBsZXQgd29yZHMgPSB5aWVsZCAoMCwgYXhpb3NfMS5kZWZhdWx0KSh7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICAgICAgdXJsOiBgJHtlbnZfMS5BUElfVVJMfS9zZWdtZW50YXRpb25gLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogeyBVc2VySWQ6IGZwLmN1cnJlbnQsIFRleHQ6IHdvcmQgfSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGRpc3BsYXlXb3Jkcyh3b3Jkcy5kYXRhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgaWYgKCgwLCBheGlvc18xLmlzQXhpb3NFcnJvcikoZSkpIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlXb3JkcyhbXSk7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKChfYSA9IGUucmVzcG9uc2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5kYXRhLnN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2Ugc3RhdHVzXzEuc3RhdHVzLkdMT0JBTF9RVU9UQV9OT1RfRU5PVUdIOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcihcIlRvbyBtYW55IGZyZWUgdXNlci4gUGxlYXNlIHN1YnNjcmliZS5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEVycm9yVXJsKHlpZWxkIGdldFN1YnNjcmliZVVybCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBzdGF0dXNfMS5zdGF0dXMuUVVPVEFfTk9UX0VOT1VHSDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IoXCJZb3UgdXNlZCBhbGwgeW91ciBxdW90YS4gUGxlYXNlIHN1YnNjcmliZS5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEVycm9yVXJsKHlpZWxkIGdldFN1YnNjcmliZVVybCgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IoXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIHRyeSBhZ2FpbiBsYXRlci5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBkaXNwbGF5V29yZHMgPSAod29yZHMpID0+IHtcclxuICAgICAgICBsZXQgcGlueWluV29yZCA9IHdvcmRzLm1hcCgod29yZCkgPT4gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwicnVieVwiLCBudWxsLFxyXG4gICAgICAgICAgICB3b3JkLFxyXG4gICAgICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcInJ0XCIsIHsgXCJkYXRhLXJ0XCI6IHBpbnlpbih3b3JkKSB9KSkpKTtcclxuICAgICAgICBzZXRSZXMocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBzdHlsZTogeyBmb250U2l6ZTogMjQgfSB9LCBwaW55aW5Xb3JkKSk7XHJcbiAgICAgICAgY29uc3QgdXR0ciA9IG5ldyBTcGVlY2hTeW50aGVzaXNVdHRlcmFuY2Uod29yZHMuam9pbihcIlwiKSk7XHJcbiAgICAgICAgdXR0ci5sYW5nID0gXCJ6aC1DTlwiO1xyXG4gICAgICAgIHV0dHIudm9pY2UgPSB3aW5kb3cuc3BlZWNoU3ludGhlc2lzXHJcbiAgICAgICAgICAgIC5nZXRWb2ljZXMoKVxyXG4gICAgICAgICAgICAuZmlsdGVyKCh2b2ljZSkgPT4gdm9pY2Uudm9pY2VVUkkubGVuZ3RoID09IFwiR29vZ2xlIOaZrumAmuivne+8iOS4reWbveWkp+mZhu+8iVwiLmxlbmd0aClbMF07XHJcbiAgICAgICAgdXR0ci5yYXRlID0gMC44O1xyXG4gICAgICAgIC8vIOeZuuiogOOCkuWGjeeUnyAo55m66KiA44Kt44Ol44O844Gr55m66KiA44KS6L+95YqgKVxyXG4gICAgICAgIHNwZWVjaFN5bnRoZXNpcy5zcGVhayh1dHRyKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBkb1RyYW5zbGF0ZSA9ICh0YXJnZXQpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgIGxldCBlbmcgPSB5aWVsZCAoMCwgYXhpb3NfMS5kZWZhdWx0KSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgIHVybDogYCR7ZW52XzEuQVBJX1VSTH0vdHJhbnNsYXRlYCxcclxuICAgICAgICAgICAgZGF0YTogeyBVc2VySWQ6IGZwLmN1cnJlbnQsIFRleHQ6IHRhcmdldCwgTGFuZ1RvOiBcImVuXCIgfSxcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoZW5nLnN0YXR1cyA9PT0gMjA0KSB7XHJcbiAgICAgICAgICAgIHNldFRyYW5zbGF0ZShcIkVSUlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNldFRyYW5zbGF0ZShlbmcuZGF0YSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHV0dHIgPSBuZXcgU3BlZWNoU3ludGhlc2lzVXR0ZXJhbmNlKHRhcmdldCk7XHJcbiAgICAgICAgICAgIHV0dHIubGFuZyA9IFwiemgtQ05cIjtcclxuICAgICAgICAgICAgdXR0ci52b2ljZSA9IHdpbmRvdy5zcGVlY2hTeW50aGVzaXNcclxuICAgICAgICAgICAgICAgIC5nZXRWb2ljZXMoKVxyXG4gICAgICAgICAgICAgICAgLmZpbHRlcigodm9pY2UpID0+IHZvaWNlLnZvaWNlVVJJLmxlbmd0aCA9PSBcIkdvb2dsZSDmma7pgJror53vvIjkuK3lm73lpKfpmYbvvIlcIi5sZW5ndGgpWzBdO1xyXG4gICAgICAgICAgICAvLyDnmbroqIDjgpLlho3nlJ8gKOeZuuiogOOCreODpeODvOOBq+eZuuiogOOCkui/veWKoClcclxuICAgICAgICAgICAgdXR0ci5yYXRlID0gMC44O1xyXG4gICAgICAgICAgICBzcGVlY2hTeW50aGVzaXMuc3BlYWsodXR0cik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH0pO1xyXG4gICAgKDAsIHJlYWN0XzEudXNlRWZmZWN0KSgoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFmaXJzdENhbGwuY3VycmVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGZpcnN0Q2FsbC5jdXJyZW50ID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgZiA9ICgpID0+IF9fYXdhaXRlcih2b2lkIDAsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xyXG4gICAgICAgICAgICB5aWVsZCBpbml0RnAoKTtcclxuICAgICAgICAgICAgd2luZG93LnNwZWVjaFN5bnRoZXNpcy5nZXRWb2ljZXMoKTtcclxuICAgICAgICAgICAgLy8gY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcInRhcmdldFwiXSwgZnVuY3Rpb24gKHJlcykge1xyXG4gICAgICAgICAgICAvLyAgIGRpc3BsYXlXb3JkcyhyZXMudGFyZ2V0IGFzIHN0cmluZ1tdKTtcclxuICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbXCJ0YXJnZXRcIl0sIGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXlXb3JkKHJlcy50YXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9UcmFuc2xhdGUod2luZG93LmdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCAoZSkgPT4gZSAmJiBlLmNsaXBib2FyZERhdGEgPyB1cGxvYWRGaWxlKGUuY2xpcGJvYXJkRGF0YS5maWxlc1swXSkgOiBudWxsKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmKCk7XHJcbiAgICB9LCBbXSk7XHJcbiAgICBjb25zdCB1cGxvYWRJbWFnZSA9ICgwLCByZWFjdF8xLnVzZUNhbGxiYWNrKSgoZSkgPT4gX19hd2FpdGVyKHZvaWQgMCwgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LmZpbGVzID09PSBudWxsIHx8IGUudGFyZ2V0LmZpbGVzLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIHVwbG9hZEZpbGUoZS50YXJnZXQuZmlsZXNbMF0pO1xyXG4gICAgICAgIGUudGFyZ2V0LmZpbGVzID0gbnVsbDtcclxuICAgIH0pLCBbZnBdKTtcclxuICAgIGNvbnN0IHVwbG9hZEZpbGUgPSAoaW1nKSA9PiBfX2F3YWl0ZXIodm9pZCAwLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcclxuICAgICAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGlmICghaW1nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgZm9ybURhdGEuYXBwZW5kKFwiaW1hZ2VcIiwgaW1nKTtcclxuICAgICAgICBmb3JtRGF0YS5hcHBlbmQoXCJ1c2VyX2lkXCIsIGZwLmN1cnJlbnQpO1xyXG4gICAgICAgIGxldCByZXNfID0geWllbGQgKDAsIGF4aW9zXzEuZGVmYXVsdCkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6IFwicG9zdFwiLFxyXG4gICAgICAgICAgICB1cmw6IGAke2Vudl8xLkFQSV9VUkx9L29jcmAsXHJcbiAgICAgICAgICAgIGRhdGE6IGZvcm1EYXRhLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHJlc18uc3RhdHVzID09PSAyMDQpIHtcclxuICAgICAgICAgICAgc2V0UmVzKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KG1hdGVyaWFsXzEuVHlwb2dyYXBoeSwgbnVsbCwgcmVzXy5zdGF0dXNUZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBkaXNwbGF5V29yZHMocmVzXy5kYXRhKTtcclxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgdGFyZ2V0OiByZXNfLmRhdGEgfSwgKCkgPT4gY29uc29sZS5sb2coXCJzYXZlZFwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KG1hdGVyaWFsXzEuQm94LCB7IHdpZHRoOiBcIjQ4MHB4XCIgfSxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChtYXRlcmlhbF8xLlR5cG9ncmFwaHksIG51bGwsIFwiUGlueWluIE9DUlwiKSxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChcImZvcm1cIiwgeyBhY3Rpb246IFwiL3VwbG9hZFwiLCBtZXRob2Q6IFwiUE9TVFwiIH0sXHJcbiAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KG1hdGVyaWFsXzEuQnV0dG9uLCB7IFwiYXJpYS1sYWJlbFwiOiBcInVwbG9hZFwiLCBjb21wb25lbnQ6IFwibGFiZWxcIiwgdmFyaWFudDogXCJjb250YWluZWRcIiB9LFxyXG4gICAgICAgICAgICAgICAgXCJVUExPQURcIixcclxuICAgICAgICAgICAgICAgIHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwgeyB0eXBlOiBcImZpbGVcIiwgaGlkZGVuOiB0cnVlLCBpZDogXCJ1cGxvYWRcIiwgbmFtZTogXCJ1cGxvYWRcIiwgb25DaGFuZ2U6IChlKSA9PiB1cGxvYWRJbWFnZShlKSB9KSkpLFxyXG4gICAgICAgIHJlcyxcclxuICAgICAgICByZWFjdF8xLmRlZmF1bHQuY3JlYXRlRWxlbWVudChtYXRlcmlhbF8xLlR5cG9ncmFwaHksIG51bGwsIHRyYW5zbGF0ZSksXHJcbiAgICAgICAgZXJyb3IgPyAocmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQobWF0ZXJpYWxfMS5BbGVydCwgeyBzZXZlcml0eTogXCJlcnJvclwiLCBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaHJvbWUudGFicy5jcmVhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogZXJyb3JVcmwsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSB9LCBlcnJvcikpIDogbnVsbCkpO1xyXG59O1xyXG5jb25zdCByb290ID0gY2xpZW50XzEuZGVmYXVsdC5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSk7XHJcbnJvb3QucmVuZGVyKHJlYWN0XzEuZGVmYXVsdC5jcmVhdGVFbGVtZW50KHJlYWN0XzEuZGVmYXVsdC5TdHJpY3RNb2RlLCBudWxsLFxyXG4gICAgcmVhY3RfMS5kZWZhdWx0LmNyZWF0ZUVsZW1lbnQoUG9wdXAsIG51bGwpKSk7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdGxvYWRlZDogZmFsc2UsXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuXHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubm1kID0gKG1vZHVsZSkgPT4ge1xuXHRtb2R1bGUucGF0aHMgPSBbXTtcblx0aWYgKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xuXHRyZXR1cm4gbW9kdWxlO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJwb3B1cFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtnaXRodWJfbGFuZ3VhZ2VfZXh0ZW5zaW9uXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2dpdGh1Yl9sYW5ndWFnZV9leHRlbnNpb25cIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9wb3B1cC50c3hcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
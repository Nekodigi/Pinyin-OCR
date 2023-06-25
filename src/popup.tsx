import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import axios, { Axios, isAxiosError } from "axios";
import { set, useForm } from "react-hook-form";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import {
  API_URL,
  SERVICE_FRAMEWORK_BE_URL,
  SERVICE_FRAMEWORK_URL,
  SERVICE_ID,
} from "./env";
var pinyin = require("chinese-to-pinyin");
import FingerPrintJS from "@fingerprintjs/fingerprintjs";
import { status } from "./consts/status";

const Popup = () => {
  const [res, setRes] = useState<JSX.Element>(<div></div>);
  const [translate, setTranslate] = useState("");
  const firstCall = useRef(true);
  const [error, setError] = useState("");
  const [errorUrl, setErrorUrl] = useState("");
  const [browserId, setBrowserId] = useState("");
  const [userId, setUserId] = useState("");
  const [redirectId, setRedirectId] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["browserId"], async (res) => {
      let id;
      if (!res.browserId) {
        let res = await axios({
          method: "get",
          url: `${SERVICE_FRAMEWORK_BE_URL}/user/unique_id`,
        });
        id = res.data.id;

        chrome.storage.local.set({ browserId: id });
      } else {
        id = res.browserId;
      }
      let redirectRes = await axios({
        method: "get",
        url: `${SERVICE_FRAMEWORK_BE_URL}/redirect/${SERVICE_ID}/${id}`,
      });
      let redirectedUser = redirectRes.data.id;
      setRedirectId(redirectedUser);
      setUserId(redirectedUser ? redirectedUser : id);
      setBrowserId(id);
    });
  }, []);

  const dashBoardUrl = useMemo(
    () => `${SERVICE_FRAMEWORK_URL}/${SERVICE_ID}?link_target=${browserId}`,
    [browserId]
  );

  const displayWord = async (userId: string, word: string) => {
    if (!word) return;
    try {
      console.log(userId, word);
      let words = await axios({
        method: "post",
        url: `${API_URL}/segmentation`,
        data: { UserId: userId, Text: word },
      });
      displayWords(words.data);
    } catch (e) {
      if (isAxiosError(e)) {
        displayWords([]);
        switch (e.response?.data.status) {
          case status.GLOBAL_QUOTA_NOT_ENOUGH:
            setError("Too many free user. Please subscribe.");
            setErrorUrl(dashBoardUrl);
            break;
          case status.QUOTA_NOT_ENOUGH:
            setError("You used all your quota. Please subscribe.");
            setErrorUrl(dashBoardUrl);
            break;
          default:
            setError("Something went wrong. Please try again later.");
            break;
        }
      }
    }
  };

  const displayWords = (words: string[]) => {
    let pinyinWord = words.map((word) => (
      <ruby>
        {word}
        <rt data-rt={pinyin(word)}></rt>
      </ruby>
    ));
    setRes(<div style={{ fontSize: 24 }}>{pinyinWord}</div>);
    const uttr = new SpeechSynthesisUtterance(words.join(""));
    uttr.lang = "zh-CN";
    uttr.voice = window.speechSynthesis
      .getVoices()
      .filter(
        (voice) => voice.voiceURI.length == "Google 普通话（中国大陆）".length
      )[0];
    uttr.rate = 0.8;

    // 発言を再生 (発言キューに発言を追加)
    speechSynthesis.speak(uttr);
  };

  const doTranslate = async (target: string) => {
    let eng = await axios({
      method: "post",
      url: `${API_URL}/translate`,
      data: { UserId: userId, Text: target, LangTo: "en" },
    });
    if (eng.status === 204) {
      setTranslate("ERR");
    } else {
      setTranslate(eng.data);
      const uttr = new SpeechSynthesisUtterance(target);
      uttr.lang = "zh-CN";
      uttr.voice = window.speechSynthesis
        .getVoices()
        .filter(
          (voice) => voice.voiceURI.length == "Google 普通话（中国大陆）".length
        )[0];
      // 発言を再生 (発言キューに発言を追加)
      uttr.rate = 0.8;

      speechSynthesis.speak(uttr);
    }
    return;
  };

  useEffect(() => {
    if (!userId) return;
    if (!firstCall.current) return;

    firstCall.current = false;
    const f = async () => {
      window.speechSynthesis.getVoices();
      // chrome.storage.local.get(["target"], function (res) {
      //   displayWords(res.target as string[]);
      // });
      chrome.storage.local.get(["target"], (res) => {
        displayWord(userId, res.target);
      });

      document.addEventListener("mouseup", () => {
        doTranslate(window.getSelection()!.toString());
      });
      window.addEventListener("paste", (e: any) =>
        e && e.clipboardData ? uploadFile(e.clipboardData.files[0]) : null
      );
    };
    f();
  }, [userId]);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) return;
    uploadFile(e.target.files[0]);
    e.target.files = null;
  };

  const uploadFile = async (img?: File) => {
    const formData = new FormData();
    if (!img) return;
    formData.append("image", img);
    formData.append("user_id", userId);

    let res_ = await axios({
      method: "post",
      url: `${API_URL}/ocr`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res_.status === 204) {
      setRes(<Typography>{res_.statusText}</Typography>);
    } else {
      displayWords(res_.data);
      chrome.storage.local.set({ target: res_.data }, () =>
        console.log("saved")
      );
    }
  };

  return (
    <Box width="480px">
      <Typography>Pinyin OCR</Typography>

      {res}
      <Typography>{translate}</Typography>
      {error ? (
        <Alert
          severity="error"
          onClick={() => {
            chrome.tabs.create({
              url: errorUrl,
            });
          }}
        >
          {error}
        </Alert>
      ) : null}
      <Stack direction="row" justifyContent={"space-between"}>
        <form action="/upload" method="POST">
          <Button aria-label="upload" component="label">
            UPLOAD
            <input
              type="file"
              hidden
              id="upload"
              name="upload"
              onChange={(e) => uploadImage(e)}
            />
          </Button>
        </form>
        <Button
          onClick={() => {
            chrome.tabs.create({ url: dashBoardUrl });
          }}
        >
          {redirectId ? "DASHBOARD" : "Login"}
        </Button>
      </Stack>
    </Box>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root")! as HTMLElement
);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

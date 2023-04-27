import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import axios, { Axios } from "axios";
import { useForm } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { API_URL } from "./env";
//import pinyin from  "chinese-to-pinyin"
var pinyin = require("chinese-to-pinyin")
// var hanzi = require("hanzi");
// hanzi.start();

const Popup = () => {
  const [image, setImage] = useState<File | undefined>();
  const [res, setRes] = useState<JSX.Element>(<div></div>);
  const [translate, setTranslate] = useState("");
  const firstCall = useRef(true);



  const displayWords = (words: string[]) => {
    let pinyinWord = words.map((word) => <ruby>{word}<rt data-rt={pinyin(word)} ></rt></ruby>)
    setRes(<div style={{fontSize: 24}}>{pinyinWord}</div>)
    const uttr = new SpeechSynthesisUtterance(words.join(""))
    uttr.lang='zh-CN'
    uttr.voice = window.speechSynthesis.getVoices().filter(voice => voice.voiceURI.length == "Google 普通话（中国大陆）".length)[0]
    uttr.rate = 0.8;

// 発言を再生 (発言キューに発言を追加)
    speechSynthesis.speak(uttr)
  }

  const doTranslate = async (target: string) => {
     let eng = await axios({
        method: "post",
        url: `${API_URL}/translate`,
        data: {Text: target, LangTo: "en"},
      });
      if (eng.status === 204){
        setTranslate("ERR")
      }else{
        setTranslate(eng.data)
        const uttr = new SpeechSynthesisUtterance(target)
        uttr.lang='zh-CN'
        uttr.voice = window.speechSynthesis.getVoices().filter(voice => voice.voiceURI.length == "Google 普通话（中国大陆）".length)[0]
    // 発言を再生 (発言キューに発言を追加)
        uttr.rate = 0.8;

        speechSynthesis.speak(uttr)
      }
    return 
  }

  useEffect(() => {
    if(!firstCall.current)return;
    firstCall.current = false;
    window.speechSynthesis.getVoices();
    
    chrome.storage.local.get(['target'], function(res) {
      displayWords(res.target as string[])
    });
    document.addEventListener("mouseup", () => {
      doTranslate(window.getSelection()!.toString())
    });
      window.addEventListener("paste", (e: any) => e && e.clipboardData ? uploadFile(e.clipboardData.files[0]): null);
  }, []);


  

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) return;
    setImage(e.target.files[0]);
    uploadFile(e.target.files[0]);
    e.target.files = null;
  };

  const uploadFile = async (img?: File) => {
    const formData = new FormData();
    if (!img) return;
    formData.append("image", img);

    let res_ = await axios({
      method: "post",
      url: `${API_URL}/ocr`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    

    if (res_.status === 204){
      setRes(<Typography>{res_.statusText}</Typography>)
    }else{
      displayWords(res_.data)
    }

    

    
    
    

  };

  return (
    <Box width="480px">
      <Typography>Pinyin OCR</Typography>
      
      <form action="/upload" method="POST">
          <Button aria-label="upload" component="label" variant="contained">UPLOAD<input
            type="file"
            hidden
            id="upload"
            name="upload"
            onChange={(e) => uploadImage(e)}
          /></Button>
      </form>
      
     {res}
     <Typography>{translate}</Typography>
    </Box>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")! as HTMLElement);

root.render(  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

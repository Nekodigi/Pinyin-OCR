import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios, { Axios } from "axios";
import { useForm } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
//import pinyin from  "chinese-to-pinyin"
var pinyin = require("chinese-to-pinyin")
var hanzi = require("hanzi");
hanzi.start();

const Popup = () => {
  const [image, setImage] = useState<File | undefined>();
  const [res, setRes] = useState<JSX.Element>(<div></div>);

  useEffect(() => {
    chrome.storage.local.get(['target'], function(res) {
      let words = hanzi.segment(res.target) as string[]
      let pinyinWord = words.map((word) => <ruby>{word}<rt>{pinyin(word)}</rt></ruby>)
      setRes(<div style={{fontSize: 24}}>{pinyinWord}</div>)
    });
    // document.addEventListener("click", () => {
    //   chrome.storage.local.get(['target'], function(res) {
    //     setRes(<div style={{fontSize: 24}}>LOAD"{res.target}"</div>) 
    //   });
    // });
    // document.addEventListener("selectionchange", () => {
    //   chrome.storage.local.get(['target'], function(res) {
    //     setRes(<div style={{fontSize: 24}}>LOAD"{res.target}"</div>) 
    //   });
    // });
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
      url: `http://localhost:8080/ocr`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    if (res_.status === 204){
      setRes(<Typography>res_.statusText</Typography>)
    }else{
      let words = res_.data as string[]
      let pinyinWord = words.map((word) => <ruby>{word}<rt>{pinyin(word)}</rt></ruby>)
      setRes(<div style={{fontSize: 24}}>{pinyinWord}</div>)
      
      // let pinyin_ = await axios({
      //   method: "post",
      //   url: `http://localhost:8080/gpt`,
      //   data: {"Text": res_.data},
      // });
      // if (pinyin_.status === 204){
      //   setRes(<Typography>pinyin_.statusText</Typography>)
      // }else{
        
      //   setRes(<div dangerouslySetInnerHTML={{__html: pinyin_.data}} style={{fontSize: "24px"}}></div>)
      // }
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
    </Box>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")! as HTMLElement);

root.render(  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

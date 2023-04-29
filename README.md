# pinyin-ocr-frontend

- [Demo](#demo)
- [Feature](#feature)
- [TODO](#todo)
- [Setup](#setup)
- [Usage](#usage)
- [Install](#install)
- [Source Code](#source-code)

## **Demo**


[![IMAGE ALT TEXT](http://img.youtube.com/vi/ynAHunbV380/0.jpg)](http://www.youtube.com/watch?v=ynAHunbV380 "Video Title")

## **Feature**

- Read Chinese characters from images
- Read selected text in the browser
- Display Chinese pinyin
- Display translation of Chinese characters
- Translate to Chinese if other languages are detected
- Read selected Chinese characters aloud

## **TODO**

- Improve design
- Post to Chrome Extension
- Paste character data
- Select target language for translation
- Select speech synthesis voice
- Disable speech synthesis

## **Setup**

1. Prepare GCP (Backend)  
Translate API and Vision AI are required to run. Also, it is recommended to deploy to Cloud Run. Please refer to the boilerplate and input the information in dev.env.  

1. Register the extension (Frontend)  
Create src/env.ts and input the URL of the deployed backend. Update the dist folder with **`yarn watch`**. Enable Developer mode in Chrome, and then load the dist folder from Load unpacked.

## **Usage**

1. Read Chinese characters from images  
Take a screenshot and copy it. Click the extension and open the popup, then paste it with ctrl+v or upload the image with the UPLOAD button. After a few seconds, the Chinese characters will be displayed.

1. Read selected text on websites  
When you open the popup with selected text on the screen, the selected text will be displayed.

1. Translate Chinese to English  
When you select Chinese, the translation of the selected text will be displayed.

1. Translate other languages to Chinese  
In the same way, when you select text in other languages and open the popup, it will be displayed in Chinese.

1. Read Chinese aloud  
It will be played back both when the popup is opened and when Chinese is selected in the popup.

## **Install**

Enable Developer mode and load the dist folder from Load unpacked.

**[https://github.com/Nekodigi/pinyin-ocr-frontend](https://github.com/Nekodigi/pinyin-ocr-frontend)**

## **Source Code**

- Backend

**[https://github.com/Nekodigi/pinyin-ocr-backend](https://github.com/Nekodigi/pinyin-ocr-backend)**

- Frontend

**[https://github.com/Nekodigi/pinyin-ocr-frontend](https://github.com/Nekodigi/pinyin-ocr-frontend)**

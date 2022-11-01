import Spider from "./spider.js";

export default class Translate {
  #languagesArr;
  #translatedResult;
  #buttonsLangBlock;
  #textareaInput;
  #textareaOutput;
  #selectedLang;
  #lastInputTime;
  #lastInputText;
  #innerText;
  #clearButton;
  #responseTranslate;
  #timeDelay;
  #clickButton;
  #canvas;
  #spiders;
  #ctx;

  constructor() {
    this.#languagesArr = [
      { value: "en", text: "English" },
      { value: "ru", text: "Russian" },
      { value: "fr", text: "French" },
      { value: "de", text: "German" },
    ];

    this.#selectedLang = "en";
    this.#timeDelay = 700;
    setInterval(() => {
      const nowTime = Date.now();
      if (
        this.#lastInputTime + this.#timeDelay < nowTime &&
        this.#lastInputText !== this.#textareaInput.value &&
        this.#textareaInput.value.length > 0
      ) {
        this.#translateFunc();
      }
    }, this.#timeDelay);

    this.#spiders = [];
  }

  #createTranslateHTML() {
    const mainContainer = document.createElement("div");
    mainContainer.className = "ju-container";

    const headerBlock = document.createElement("header");
    headerBlock.className = "ju-header";
    const heading = document.createElement("p");
    heading.className = "ju-heading";
    heading.textContent = "Language translator";
    headerBlock.append(heading);

    const mainBlock = document.createElement("main");
    mainBlock.className = "ju-main";

    const translateBox = document.createElement("div");
    translateBox.className = "ju-translate-box";

    const textBlock = document.createElement("p");
    textBlock.className = "ju-text-block";
    textBlock.textContent = "The language is detected automatically";

    this.#textareaInput = document.createElement("textarea");
    this.#textareaInput.placeholder = "Enter the text";
    this.#textareaInput.className = "ju-textarea";
    this.#clearButton = document.createElement("button");
    this.#clearButton.className = "ju-clear-button";
    this.#clearButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    width="20" height="20"
    viewBox="0 0 48 48"
    style=" fill:#ffffff8c;"><path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z"></path></svg>`;

    translateBox.append(textBlock, this.#textareaInput, this.#clearButton);

    this.#translatedResult = document.createElement("div");
    this.#translatedResult.className = "ju-translate-box";

    this.#buttonsLangBlock = document.createElement("div");
    this.#buttonsLangBlock.className = "ju-btns-block";
    let btnLangItem;

    this.#languagesArr.forEach((lang) => {
      btnLangItem = document.createElement("button");
      btnLangItem.className = "ju-btn-lang";
      btnLangItem.dataset.lang = lang.value;
      btnLangItem.textContent = lang.text;
      this.#buttonsLangBlock.append(btnLangItem);

      if (lang.value === "en") {
        btnLangItem.classList.add("ju-selected");
      }
    });

    this.#textareaOutput = document.createElement("textarea");
    this.#textareaOutput.className = "ju-textarea";
    this.#textareaOutput.placeholder = "Here you will see translated text";

    this.#clickButton = document.createElement("button");
    this.#clickButton.className = "ju-click-btn";
    this.#clickButton.textContent = "Click me";

    this.#clickButton.addEventListener("click", (event) => {
      const isBtnClick = event.target.closest(".ju-click-btn");
      if (isBtnClick) {
        if (this.#canvas.classList.contains("ju-canvas-hide")) {
          this.#canvas.classList.remove("ju-canvas-hide");
          for (let i = 0; i < 3; i++) {
            this.#spiders.push(new Spider(this.#ctx));
          }
        } else {
          this.#canvas.classList.add("ju-canvas-hide");
          this.#spiders = [];
        }
      }
    });

    this.#canvas = document.createElement("canvas");
    this.#canvas.className = "ju-canvas";
    this.#canvas.classList.add("ju-canvas-hide");
    this.#ctx = this.#canvas.getContext("2d");

    this.#ctx.canvas.width = window.innerWidth;
    this.#ctx.canvas.height = window.innerHeight / 2.5;

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", () => {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
      this.#spiders.forEach((spider) => spider.render());
    });

    this.#translatedResult.append(this.#buttonsLangBlock, this.#textareaOutput);
    mainBlock.append(translateBox, this.#translatedResult, this.#clickButton);
    mainContainer.append(headerBlock, mainBlock, this.#canvas);

    return mainContainer;
  }

  #getSelectedLanguage() {
    this.#buttonsLangBlock.addEventListener("click", (event) => {
      const isBntLang = event.target.closest(".ju-btn-lang");
      if (isBntLang) {
        const btnLangClick = event.target.closest("[data-lang]");
        this.#selectedLang = btnLangClick.getAttribute("data-lang");

        const buttonsArr = document.querySelectorAll(".ju-btn-lang");
        buttonsArr.forEach((btn) => {
          if (event.target === btn) {
            btn.classList.add("ju-selected");
          } else {
            btn.classList.remove("ju-selected");
          }
        });
      }
      return this.#selectedLang;
    });
  }

  #getTextToTranslate() {
    this.#textareaInput.addEventListener("input", (event) => {
      this.#lastInputTime = Date.now();
    });
  }

  #translateFunc = async () => {
    this.#innerText = this.#textareaInput.value.trim();
    try {
      this.#textareaOutput.placeholder = "In progress...";
      const response = await fetch(
        `https://functions.yandexcloud.net/d4et92dp9bciufd0avqv?text=${
          this.#innerText
        }&targetLanguage=${this.#selectedLang}`
      );
      const translation = await response.json();
      this.#lastInputText = this.#textareaInput.value;

      this.#responseTranslate = ""; //
      translation.translations.forEach((obj) => {
        this.#responseTranslate += obj.text + " ";
      });
      this.#textareaOutput.textContent = this.#responseTranslate;
    } catch (error) {
      console.log("error occurred", error);
    } finally {
      this.#textareaOutput.placeholder = "Here you will see translated text";
    }
  };

  #clearTextarea() {
    this.#clearButton.addEventListener("click", (event) => {
      const isBtnClear = event.target.closest(".ju-clear-button");
      if (isBtnClear) {
        this.#textareaInput.value = "";
        this.#textareaOutput.textContent = "";
        this.#lastInputText = "";
      }
    });
  }

  renderTranslate() {
    const body = document.querySelector("body");
    const containerTranslator = this.#createTranslateHTML();
    body.prepend(containerTranslator);
    this.#getSelectedLanguage();
    this.#getTextToTranslate();
    this.#clearTextarea();
    return containerTranslator;
  }
}

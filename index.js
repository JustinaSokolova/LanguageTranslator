class Translate {
  #translatedResult;
  #buttonsLangBlock;
  #textareaInput;
  #textareaOutput;
  #selectedLang;
  #lastInputTime;
  #lastInputText;

  constructor(languagesArr) {
    this.languagesArr = languagesArr;
    this.#selectedLang = "en";

    setInterval(() => {
      const nowTime = Date.now();
      if (
        this.#lastInputTime + 1000 < nowTime &&
        this.#lastInputText != this.#textareaInput.value
      ) {
        this.#translateFunc();
      }
    }, 1000);
  }

  #createTranslateHTML() {
    const mainContainer = document.querySelector(".container");
    mainContainer.className = "container";

    const headerBlock = document.createElement("header");
    const heading = document.createElement("h1");
    heading.className = "heading";
    heading.textContent = "Language translator";
    headerBlock.append(heading);

    const mainBlock = document.createElement("main");
    mainBlock.className = "main";

    const translateBox = document.createElement("div");
    translateBox.className = "translate-box";

    const textBlock = document.createElement("p");
    textBlock.className = "text-block";
    textBlock.textContent = "The language is detected automatically";

    this.#textareaInput = document.createElement("textarea");
    this.#textareaInput.placeholder = "Enter the text";

    translateBox.append(textBlock, this.#textareaInput);

    this.#translatedResult = document.createElement("div");
    this.#translatedResult.className = "translate-box";

    this.#buttonsLangBlock = document.createElement("div");
    this.#buttonsLangBlock.className = "btns-block";
    let btnLangItem;

    this.languagesArr.forEach((lang) => {
      btnLangItem = document.createElement("button");
      btnLangItem.className = "btn-lang";
      btnLangItem.dataset.lang = lang.value;
      btnLangItem.textContent = lang.text;
      this.#buttonsLangBlock.append(btnLangItem);

      if (btnLangItem.hasAttribute("data-lang") === "en") {
        btnLangItem.classList.add("selected");
      }
    });

    this.#textareaOutput = document.createElement("textarea");
    this.#textareaOutput.id = "output-text";
    this.#textareaOutput.placeholder = "Here you will see translated text";

    this.#translatedResult.append(this.#buttonsLangBlock, this.#textareaOutput);
    mainBlock.append(translateBox, this.#translatedResult);
    mainContainer.append(headerBlock, mainBlock);

    return mainContainer;
  }

  #getSelectedLanguage() {
    this.#buttonsLangBlock.addEventListener("click", (event) => {
      const isBntLang = event.target.closest(".btn-lang");
      if (isBntLang) {
        const btnLangClick = event.target.closest("[data-lang]");
        this.#selectedLang = btnLangClick.getAttribute("data-lang");

        const buttonsArr = document.querySelectorAll(".btn-lang");
        buttonsArr.forEach((btn) => {
          if (event.target === btn) {
            btn.classList.add("selected");
          } else {
            btn.classList.remove("selected");
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
    const text = this.#textareaInput.value.trim();
    try {
      this.#textareaOutput.placeholder = "In progress...";
      const response = await fetch(
        `https://functions.yandexcloud.net/d4et92dp9bciufd0avqv?texts=${text}&targetLanguage=${
          this.#selectedLang
        }`
      );
      const translation = await response.json();
      this.#lastInputText = this.#textareaInput.value;

      let string = "";
      translation.translations.forEach((obj) => {
        string += obj.text + " ";
      });
      this.#textareaOutput.innerText = string;
    } catch (error) {
      console.log("error occurred", error);
    } finally {
      this.#textareaOutput.placeholder = "Here you will see translated text";
    }
  };

  renderTranslate(body) {
    body.prepend(this.#createTranslateHTML());
    this.#getSelectedLanguage();
    this.#getTextToTranslate();
  }
}

const languagesArr = [
  { value: "en", text: "English" },
  { value: "ru", text: "Russian" },
  { value: "fr", text: "French" },
  { value: "de", text: "German" },
];

const customTranslate = new Translate(languagesArr);
const body = document.querySelector("body");

customTranslate.renderTranslate(body);

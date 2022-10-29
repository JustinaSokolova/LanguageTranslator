class Translate {
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

  constructor(languagesArr) {
    this.languagesArr = languagesArr;
    this.#selectedLang = "en";

    setInterval(() => {
      const nowTime = Date.now();
      //   this.#lastInputText = "";

      const timeCondition = this.#lastInputTime + 1000 < nowTime;
      const textCondition1 = this.#lastInputText !== this.#textareaInput.value;
      const textCondition2 = this.#textareaInput.value.length > 0;

      console.log(timeCondition, textCondition1, textCondition2);

      if (
        // this.#lastInputTime + 1000 < nowTime &&
        // this.#lastInputText !== this.#textareaInput.value &&
        // this.#textareaInput.value !== ""
        timeCondition &&
        textCondition1 &&
        textCondition2
      ) {
        this.#translateFunc();
      }
    }, 1000);
  }

  #createTranslateHTML() {
    const mainContainer = document.querySelector(".container");
    mainContainer.className = "container";

    const headerBlock = document.createElement("header");
    headerBlock.className = "header";
    const heading = document.createElement("h3");
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

    this.#clearButton = document.createElement("button");
    this.#clearButton.className = "clear-button";
    this.#clearButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
    width="20" height="20"
    viewBox="0 0 48 48"
    style=" fill:#ffffff8c;"><path d="M 39.486328 6.9785156 A 1.50015 1.50015 0 0 0 38.439453 7.4394531 L 24 21.878906 L 9.5605469 7.4394531 A 1.50015 1.50015 0 0 0 8.484375 6.984375 A 1.50015 1.50015 0 0 0 7.4394531 9.5605469 L 21.878906 24 L 7.4394531 38.439453 A 1.50015 1.50015 0 1 0 9.5605469 40.560547 L 24 26.121094 L 38.439453 40.560547 A 1.50015 1.50015 0 1 0 40.560547 38.439453 L 26.121094 24 L 40.560547 9.5605469 A 1.50015 1.50015 0 0 0 39.486328 6.9785156 z"></path></svg>`;

    translateBox.append(textBlock, this.#textareaInput, this.#clearButton);

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
    this.#innerText = this.#textareaInput.value.trim();
    try {
      this.#textareaOutput.placeholder = "In progress...";
      const response = await fetch(
        `https://functions.yandexcloud.net/d4et92dp9bciufd0avqv?texts=${
          this.#innerText
        }&targetLanguage=${this.#selectedLang}`
      );
      const translation = await response.json();
      this.#lastInputText = this.#textareaInput.value;

      translation.translations.forEach((obj) => {
        this.#responseTranslate += obj.text + " ";
      });
      this.#textareaOutput.innerText = this.#responseTranslate;
    } catch (error) {
      console.log("error occurred", error);
    } finally {
      this.#textareaOutput.placeholder = "Here you will see translated text";
    }
  };

  #clearTextarea() {
    this.#clearButton.addEventListener("click", (event) => {
      const isBtnClear = event.target.closest(".clear-button");
      if (isBtnClear) {
        this.#textareaInput.value = "";
        this.#textareaOutput.value = "";
        this.#innerText = this.#textareaInput.value.trim();
      }
    });
  }

  renderTranslate(body) {
    body.prepend(this.#createTranslateHTML());
    this.#getSelectedLanguage();
    this.#getTextToTranslate();
    this.#clearTextarea();
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

import "./style/style.css";
import favicon from "./assets/favicon.png";
import Translate from "./modules/translator.module";

const translatorModule = new Translate();
translatorModule.renderTranslate();

const head = document.querySelector("head");
const link = document.createElement("link");
link.rel = "icon";
link.href = favicon;
head.append(link);

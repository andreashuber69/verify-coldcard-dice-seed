import { render } from "preact";
import { getElement } from "./getElement.js";
import { Main } from "./Main.js";

render(<Main />, getElement(HTMLElement, "#main"));

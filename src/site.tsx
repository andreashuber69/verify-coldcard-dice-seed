import { render } from "preact";
import { getElement } from "./getElement.js";
import { MainWithHooks } from "./Main.js";

render(<MainWithHooks />, getElement(HTMLElement, "#main"));

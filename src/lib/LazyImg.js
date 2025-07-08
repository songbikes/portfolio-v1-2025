class LazyImg extends HTMLElement {
  static get observedAttributes() {
    return ["src", "alt"];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "src") this.img.src = newValue;
    if (name === "alt") this.img.alt = newValue;
  }
  constructor() {
    super();
    this.img = document.createElement("img");
    this.img.loading = "lazy";
    this.appendChild(this.img);
  }
  connectedCallback() {
    this.img.src = this.getAttribute("src") || "";
    this.img.alt = this.getAttribute("alt") || "";
  }
}
customElements.define("lazy-img", LazyImg);

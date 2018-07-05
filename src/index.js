import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lit-html.js';
import './components/plot-generator.js';

    // TODO open shadow root not working with just <link> tag?
class App extends HTMLElement {
  
  constructor() {
    super();

    // TODO open shadow root not working with just <link> tag?
    this.root = this.attachShadow({ mode: 'open' });
    render(this.template(), this.root);
  }

  template() {
    return html`
      <style>
        div#container {
          width: 400px;
          margin: 0 auto;
          text-align: center;
        }
      </style>

      <div id="container">
        
        <h2>Random Plot Generator</h2>
        <plot-generator></plot-generator>

      </div>
    `;
  }
}
  
customElements.define('pe-app', App);
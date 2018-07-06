import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';
import './components/plot-generator.js';

// TODO open shadow root not working with just <link> tag?
class App extends HTMLElement {
  
  constructor() {
    super();
    this.points = 100;
    this.regenerate = false;

    this.root = this.attachShadow({ mode: 'open' });
    
    render(this.template(), this.root);
  }

  setPoints() {
    const inputElement = this.root.getElementById('num-points');
    const userInput = inputElement.value;

    this.points = parseInt(userInput, 10);

    render(this.template(), this.root);
  }

  toggleRegnerate() {
    this.regenerate = !this.regenerate;

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
        <label for="num-points">Number of Points: ${this.points}</label>
        <input id="num-points" type="range" value="100" max="400" onchange=${ () => this.setPoints() } />

        <br/>

        <label for="regenerate">Regenerate: ${this.regenerate}</label>
        <input id="regenerate" type="checkbox" onchange=${ () => this.toggleRegnerate() } />

        <plot-generator regenerate$=${this.regenerate} points$=${this.points}></plot-generator>

      </div>
    `;
  }
}
  
customElements.define('pe-app', App);
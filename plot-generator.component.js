import { html, render, svg } from './node_modules/lit-html/lit-html.js';
import { repeat } from '../../../node_modules/lit-html/lib/repeat.js';

class PlotGenerator extends HTMLElement {
  constructor() {
    super();
    this.X_MAX = 400;
    this.Y_MAX = 400;
    this.NUM_POINTS = 100;

    this.points = this.generatePoints(this.NUM_POINTS);
    this.root = this.attachShadow({ mode: 'closed' });
    render(this.template(), this.root);

    setInterval(() => {
      this.points = this.generatePoints(this.NUM_POINTS);
      render(this.template(), this.root);
    }, 500);
  }

  generatePoints(size) {
    return [...Array(size).keys()].map((index) => {
      return {
        id: index,
        x: Math.floor(Math.random() * Math.floor(this.X_MAX)),
        y: Math.floor(Math.random() * Math.floor(this.Y_MAX))
      };
    })
  }

  template() {
    return svg`
      <svg width="${this.X_MAX}" height="${this.Y_MAX}">
        ${repeat(this.points, (point) => point.id, (point) => svg`
          <circle cx="${point.x}" cy="${point.y}" r="2" stroke="red" stroke-width="3" fill="red"></circle>
        `)}
      </svg>
    `;
  }
}
  
customElements.define('plot-generator', PlotGenerator);
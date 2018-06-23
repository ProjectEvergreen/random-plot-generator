import { html, render, svg } from './node_modules/lit-html/lit-html.js';
import { repeat } from './node_modules/lit-html/lib/repeat.js';

class PlotGenerator extends HTMLElement {
  constructor() {
    super();
    this.X_MAX = 400;
    this.Y_MAX = 400;
    this.NUM_POINTS = 100;
    this.INTERVAL_MS = 500;
    this.points = this.generatePoints(this.NUM_POINTS);
    
    this.root = this.attachShadow({ mode: 'closed' });
    render(this.template(), this.root);

    // setInterval(() => {
    //   this.points = this.generatePoints(this.NUM_POINTS);
    //   render(this.template(), this.root);
    // }, this.INTERVAL_MS);
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
      <svg width="${this.X_MAX}" height="${this.Y_MAX}" style="border: 1px solid #020202">
        ${repeat(this.points, (point) => point.id, (point) => {
          const color = point.x > point.y ? 'green' : 'blue';

          return svg`
            <circle 
              cx="${point.x}" 
              cy="${point.y}" 
              r="2" 
              stroke-width="3" 
              fill="${color}"
              stroke="${color}">
            </circle>
          `
        })}

        <line x1="0" x2="${this.X_MAX}" y1="0" y2="${this.Y_MAX}" stroke="black"/>
      </svg>
    `;
  }
}
  
customElements.define('plot-generator', PlotGenerator);
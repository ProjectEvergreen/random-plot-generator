import { render, svg } from 'https://unpkg.com/lit-html@0.10.2/lit-html.js';
import { repeat } from 'https://unpkg.com/lit-html@0.10.2/lib/repeat.js';
import PlotDataTrainer from '../services/plot-data-trainer.js';

class PlotGenerator extends HTMLElement {
  constructor() {
    super();
    this.X_MAX = 400;
    this.Y_MAX = 400;
    this.NUM_POINTS = 100;
    this.INTERVAL_MS = 500;
    this.points = this.generatePoints(this.NUM_POINTS);
    const dataset = this.generatePoints(this.NUM_POINTS * 1000);

    this.weightTrainer = new PlotDataTrainer(dataset);

    this.root = this.attachShadow({ mode: 'closed' });
    render(this.template(), this.root);
  }

  static get observedAttributes() {
    return ['random'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {

      case 'random':
        if (newVal === 'true') {
          this.randomizePoints();
        }
        break;
      default:

    }
  }

  getTeamColorForPoint(point) {
    return this.weightTrainer.guessPlotPosition(point) === 1 ? 'green' : 'blue';
  }

  // 1 (above / right position)
  // -1 (below / left position)
  generatePoints(size) {
    return [...Array(size).keys()].map((index) => {
      const x = Math.floor(Math.random() * Math.floor(this.X_MAX));
      const y = Math.floor(Math.random() * Math.floor(this.Y_MAX));
      
      return {
        id: index,
        control: x > y ? 1 : -1,
        x,
        y
      };
    });
  }

  randomizePoints() {
    setInterval(() => {
      this.points = this.generatePoints(this.NUM_POINTS);
      render(this.template(), this.root);
    }, this.INTERVAL_MS);
  }

  template() {
    return svg`
      <svg width="${this.X_MAX}" height="${this.Y_MAX}" style="border: 1px solid #020202">
        ${repeat(this.points, (point) => point.id, (point) => {
          const color = this.getTeamColorForPoint(point);

          return svg`<circle 
            cx="${point.x}" 
            cy="${point.y}" 
            r="2" 
            stroke-width="3" 
            fill="${color}"
            stroke="${color}">
          </circle>`;
        })}

        <!-- TODO why does this has to come _after_ the <circle>s are generated?? -->
        <line x1="0" x2="${this.X_MAX}" y1="0" y2="${this.Y_MAX}" stroke="black"/>
      </svg>
    `;
  }
}
  
customElements.define('plot-generator', PlotGenerator);
import { html, render, svg } from './node_modules/lit-html/lit-html.js';
import { repeat } from './node_modules/lit-html/lib/repeat.js';

function random(high, low) {
  return Math.random() * (high - low) + low;
}

class PlotGenerator extends HTMLElement {
  constructor() {
    super();
    this.X_MAX = 400;
    this.Y_MAX = 400;
    this.NUM_POINTS = 100;
    this.INTERVAL_MS = 500;
    this.points = this.generatePoints(this.NUM_POINTS);

    const point = {x: 200, y: 400}; 
    const sample1 = {x: 721, y: 432 };
    const sample2 = {x: 211, y: 122 };
    const sample3 = {x: 328, y: 833 };
    const sample4 = {x: 900, y: 400 };
    this.randomWeights = {
      x: random(-1, 1),
      y: random(-1, 1)
    }

    this.trainedWeights = this.train(this.randomWeights, sample1, this.team(sample1));
    this.trainedWeights = this.train(this.trainedWeights, sample2, this.team(sample2));
    this.trainedWeights = this.train(this.trainedWeights, sample3, this.team(sample3));
    this.trainedWeights = this.train(this.trainedWeights, sample4, this.team(sample4));

    console.log('randomWeights', this.randomWeights);
    console.log('control', this.team(point));
    console.log('train', this.train(this.randomWeights, point, this.team(point))); 
    console.log('trainedWeights', this.trainedWeights);

    this.root = this.attachShadow({ mode: 'closed' });
    render(this.template(), this.root);
  }

  static get observedAttributes() {
    return ['random'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    switch (name) {

      case 'random':
        if(newVal === 'true'){
          this.randomizePoints();
        }
        break;
      default:

    }
  }

  train(weights, point, control) {
    const guessResult = this.guessPlotPosition(weights, point);
    const error = control - guessResult;

    return {
      x: weights.x + (point.x * error),
      y: weights.y + (point.y * error)
    };
  }

  // 1 (above / right position)
  // -1 (below / left position)
  guessPlotPosition(weights, point) {
    const sum = point.x * weights.x + point.y * weights.y;
    const plotPosition = sum >= 0 ? 1 : -1;

    return plotPosition;
  }

  getTeamColorForPointPosition(point) {
    // const plotPosition = this.guessPlotPosition(this.randomWeights, point);
    const plotPosition = this.guessPlotPosition(this.trainedWeights, point);

    return plotPosition === 1 ? 'green' : 'blue';
  }

  team(point) {
    return point.x > point.y ? 1 : -1;
  }

  randomizePoints() {
    setInterval(() => {
      this.points = this.generatePoints(this.NUM_POINTS);
      render(this.template(), this.root);
    }, this.INTERVAL_MS);
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
          const color = this.getTeamColorForPointPosition(point);

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

        <!-- TODO why does this has to come _after_ the <circle>s are generated?? -->
        <line x1="0" x2="${this.X_MAX}" y1="0" y2="${this.Y_MAX}" stroke="black"/>
      </svg>
    `;
  }
}
  
customElements.define('plot-generator', PlotGenerator);
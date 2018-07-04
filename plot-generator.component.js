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
    
    this.randomWeights = {
      x: random(-1, 1),
      y: random(-1, 1)
    }

    this.trainedWeights = this.randomWeights;
    this.generatePoints(this.NUM_POINTS * 1000).forEach(point => {
      this.trainedWeights = this.train(this.trainedWeights, {x: point.x, y: point.y}, point.team);
    });

    console.log('randomWeights', this.randomWeights);
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
    const learningRate = 0.1;

    return {
      x: weights.x + point.x * error * learningRate,
      y: weights.y + point.y * error * learningRate
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
    const plotPosition = this.guessPlotPosition(this.trainedWeights, point);

    return plotPosition === 1 ? 'green' : 'blue';
  }

  getTeam(point) {
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
      const x = Math.floor(Math.random() * Math.floor(this.X_MAX));
      const y = Math.floor(Math.random() * Math.floor(this.Y_MAX));
      
      return {
        id: index,
        team: this.getTeam({x, y}),
        x,
        y
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
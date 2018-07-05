
// this repo is for demonstration purposes only
// so it is ok that this is somewhat coupled to the PlotGenerator component
class PlotDataTrainer {
  
  constructor(dataset) {
    this.randomWeights = {
      x: PlotDataTrainer.random(-1, 1),
      y: PlotDataTrainer.random(-1, 1)
    };
    this.trainedWeights = this.randomWeights;

    dataset.forEach(point => {
      this.trainedWeights = this.trainDataset(this.trainedWeights, { x: point.x, y: point.y }, point.control);
    });
  }

  static random(high, low) {
    return Math.random() * (high - low) + low;
  }

  trainDataset(weights, point, control) {
    const guessResult = this.guessPlotPosition(point);
    const error = control - guessResult;
    const learningRate = 0.1;

    return {
      x: weights.x + point.x * error * learningRate,
      y: weights.y + point.y * error * learningRate
    };
  }

  guessPlotPosition(point) {
    const sum = point.x * this.trainedWeights.x + point.y * this.trainedWeights.y;
    const plotPosition = sum >= 0 ? 1 : -1;

    return plotPosition;
  }

}

export default PlotDataTrainer;
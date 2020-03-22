const { isObject } = require('./helpers');

class AggregationQueryBuilder {
  constructor() {
    this.query = [];
  }

  addPipeline(pipeline) {
    if (!isObject(pipeline) || Object.keys(pipeline).length != 1) {
      throw new Error(`Bad pipeline ${pipeline}`);
    }

    this.query.push(pipeline);

    return this;
  }

  match($match) {
    return this.addPipeline({ $match });
  }

  unwind($unwind) {
    return this.addPipeline({ $unwind });
  }

  facet($facet) {
    return this.addPipeline({ $facet });
  }

  project($project) {
    return this.addPipeline({ $project });
  }

  sort($sort) {
    return this.addPipeline({ $sort });
  }

  build() {
    return this.query;
  }
}

module.exports = AggregationQueryBuilder;
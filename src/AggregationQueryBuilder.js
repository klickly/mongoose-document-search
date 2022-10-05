const { isObject } = require('./helpers');

class AggregationQueryBuilder {

    constructor () {
        this.query = [];
    }

    addPipeline (pipeline) {
        if (!isObject(pipeline) || Object.keys(pipeline).length !== 1) {
            throw new Error(`Bad pipeline ${pipeline}`);
        }
        this.query.push(pipeline);

        return this;
    }

    match ($match) {
        return this.addPipeline({ $match });
    }

    group ($group) {
        return this.addPipeline({ $group });
    }

    unwind ($unwind) {
        return this.addPipeline({ $unwind });
    }

    lookup ($lookup) {
        return this.addPipeline({ $lookup });
    }

    project ($project) {
        return this.addPipeline({ $project });
    }

    sort ($sort) {
        return this.addPipeline({ $sort });
    }

    skip ($skip) {
        return this.addPipeline({ $skip });
    }

    limit ($limit) {
        return this.addPipeline({ $limit });
    }

    facet ($facet) {
        return this.addPipeline({ $facet });
    }

    build () {
        return this.query;
    }

    exec (Model) {
        return Model.aggregate(this.build()).exec();
    }

    toString () {
        return JSON.stringify(this.query);
    }

}

module.exports = AggregationQueryBuilder;

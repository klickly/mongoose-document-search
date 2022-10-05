const MetaBuilder = require('./MetaBuilder');
const AggregationQueryBuilder = require('./AggregationQueryBuilder');
const { isObject, isString, isNumber, convertObjectTypes } = require('./helpers');

const DEFAULT_LENGTH = 10;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const SORT_MAP = { asc: 1, desc: -1 };

function documentSearchPlugin (schema) {
    schema.static('search', async function (query, options = {}) {
        options = Object.assign({
            length: DEFAULT_LENGTH,
            page: DEFAULT_PAGE,
            limit: DEFAULT_LIMIT
        }, options);

        if (options.convertTypes) {
            query = convertObjectTypes(query);
        }

        if (typeof options.page === 'string' && isNumber(options.page)) {
            options.page = parseInt(options.page, 10);
        }

        if (typeof options.limit === 'string' && isNumber(options.limit)) {
            options.limit = parseInt(options.limit, 10);
        }

        if (typeof options.page !== 'number') {
            throw new Error('options.page is not a number');
        }

        if (typeof options.limit !== 'number') {
            throw new Error('options.limit is not a number');
        }

        const regExpQuery = {};

        if (Array.isArray(options.fields)) {
            for (let i = 0; i < options.fields.length; i++) {
                const field = options.fields[ i ];
                regExpQuery[ field ] = { $regex: new RegExp(query[ field ], 'i') };
                delete query[ field ];
            }
        }

        const aggregationQuery = new AggregationQueryBuilder();

        aggregationQuery.match({
            ...query,
            ...regExpQuery
        });

        if (options.additionalPipelines && typeof options.additionalPipelines === 'function') {
            options.additionalPipelines(aggregationQuery);
        }

        if (options.sort) {
            if (isObject(options.sort)) {
                aggregationQuery.sort(options.sort);
            }
            if (isString(options.sort) && regExpQuery) {
                aggregationQuery.sort(Object.keys(regExpQuery).reduce((acc, field) => {
                    acc[ field ] = SORT_MAP[ options.sort ] || SORT_MAP.asc;
                    return acc;
                }, {}));
            }
        } else if (schema.path('createdAt')) {
            aggregationQuery.sort({ createdAt: -1 });
        }

        aggregationQuery
            .facet({
                total: [{ $group: { _id: null, count: { $sum: 1 } } }],
                data: [{ $skip: (options.limit * options.page) - options.limit }, { $limit: options.limit }]
            })
            .unwind('$total')
            .project({
                totalDocuments: '$total.count',
                data: '$data'
            });

        const [{ data, totalDocuments } = {
            data: [],
            totalDocuments: 0
        }] = await this.aggregate(aggregationQuery.build()).exec();

        return {
            data,
            meta: new MetaBuilder({ ...options, totalDocuments }).build()
        };
    });
}

module.exports = documentSearchPlugin;

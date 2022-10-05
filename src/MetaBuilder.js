class MetaBuilder {
    constructor (options) {
        this.options = options;
        return this;
    }

    build () {
        const { options } = this;

        const totalPages = Math.ceil(options.totalDocuments / options.limit);

        let currentPage = parseInt(options.page, 10);

        if (currentPage < 1) {
            currentPage = 1;
        }

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let firstPage = Math.max(1, currentPage - Math.floor(options.length / 2));
        let lastPage = Math.min(totalPages, currentPage + Math.floor(options.length / 2));

        if (lastPage - firstPage + 1 < options.length) {
            if (currentPage < (totalPages / 2)) {
                lastPage = Math.min(totalPages, lastPage + (options.length - (lastPage - firstPage)));
            } else {
                firstPage = Math.max(1, firstPage - (options.length - (lastPage - firstPage)));
            }
        }

        if (lastPage - firstPage + 1 > options.length) {
            if (currentPage > (totalPages / 2)) {
                firstPage++;
            } else {
                lastPage--;
            }
        }

        return {
            totalPages,
            currentPage,
            firstPage,
            lastPage,
            previousPage: currentPage - 1,
            nextPage: currentPage + 1,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
            totalDocuments: options.totalDocuments
        };
    }
}

module.exports = MetaBuilder;

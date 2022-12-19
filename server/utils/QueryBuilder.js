class QueryBuilder {
    constructor(queryParams) {
        this.queryParams = queryParams;
        this.queryOptions = {}
    }


    paginate() {
        const page = this.queryParams.page ||= 1;
        const limit = this.queryParams.size ||= 10;


        this.queryOptions.limit = +limit;
        this.queryOptions.offset = (page - 1) * limit;
        return this;
    }



    createPagination(queryResult) {

        if (!queryResult.count && !queryResult.rows) return queryResult;

        const allPagesCount = Math.ceil(queryResult.count / this.queryOptions.limit)
        const page = +this.queryParams.page;
        const isLastPage = allPagesCount === page;
        return {
            data: queryResult.rows,
            pagination: {
                allItemsCount: queryResult.count,
                page,
                allPagesCount,
                isFirstPage: page === 1,
                isLastPage,
                pageSize: this.queryOptions.size
            }
        }


    }

    #createOrderArr() {
        const orderArr = this.queryParams.sort.split(',').map(e => {
            const orderItem = [];
            if (e.startsWith('-')) {
                orderItem[0] = e.slice(1)
                orderItem[1] = 'desc'
            } else {
                orderItem[0] = e;
                orderItem[1] = 'asc'
            }
            return orderItem
        })
        return orderArr
    }

    sort() {

        if (this.queryParams.sort) this.queryOptions.order = this.#createOrderArr()
        else {
            this.queryOptions.order = [["createdAt", "desc"]]
        }

        return this;

    }


}


module.exports = QueryBuilder



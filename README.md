# mongoose-document-search
Search plugin for mongoose
```
schema.plugin(documentSearchPlugin)

const { data, meta } = Model.search(filter, options);

filter - just a filter object like for .find method

options
page { number }
limit { number }
sort { string asc | string desc | object{[prop]: number } }
fields { string[] } - search fields from filter object
 
 #Example
const result = await Cats.search({name: 'monty'}, { page: 1, limit: 10, fields: ['name'], sort: 'desc' });

result.data { object[] }
result.meta {
  totalPages
  currentPage
  firstPage
  lastPage
  previousPage
  nextPage
  hasPreviousPage
  hasNextPage
  totalDocuments
}
```

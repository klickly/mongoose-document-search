# mongoose-document-search
#### Search plugin for mongoose

1) Use plugin for your schema `schema.plugin(documentSearchPlugin)`

2) Use static `search` method for your model  `const result = Model.search(filter, options);`

**`filter`** - just like mongoose filter object like for `.find` method

type: `object`

**`options`** - pagination and search options

type: `object`
###### page
type: `string|number`
default: `1`
###### limit
type: `string|number`
default: `10`
###### sort
type: `string|object`
- string `asc` or `desc` is used it will be applied for `fields`
- object  `{ createdAt: 1, name: -1 }`

###### fields
type: `string[]` 
search field in `filter` object

**`result`** - search response

type: `object`

###### data

type: `object[]`

###### meta

type: `object`
```
{
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

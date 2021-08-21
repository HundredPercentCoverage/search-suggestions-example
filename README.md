# Search Suggestion API Example
An Express API that talks to a locally running instance of Elasticsearch to provide search suggestions (countries) for a query to a given endpoint. Not locked down for auth.

When running, the API will provide a list of country name suggestions for a given query, e.g:

```
GET localhost:3000/suggestions?q=arab

[
  "Saudi Arabia",
  "United Arab Emirates"
]
```

The index schema and mapping will allow suggestions on any word within the suggestion, not just from the start like an autocomplete suggester. It uses an **nGram edge analyzer** to do this. [Here is a good article explaining this more.](https://kb.objectrocket.com/elasticsearch/how-to-implement-autocomplete-with-edge-n-grams-in-elasticsearch)

## Requirements
- Node and `npm`
- Locally running Elasticsearch instance on `localhost:9200` (I used version `7.13.2`)

## Running
- Clone
- Run `npm install`
- Run `npm start`
- In e.g. Postman, hit `localhost:3000/suggestions` with a `POST` request
- After indexing, hit `localhost:3000/suggestions?q=arab` with a `GET` request to retrieve suggestions for countries
- To delete the index, hit `localhost:3000/suggestions` with a `DELETE` request
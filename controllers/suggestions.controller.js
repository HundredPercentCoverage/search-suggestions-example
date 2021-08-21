const elasticsearch = require('elasticsearch');
const es = new elasticsearch.Client({
  host: 'localhost:9200',
});
const suggestionSchema = require('./suggestions.schema.json');
const countryList = require('../data/countries');

exports.getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Missing query parameter q'});
    }

    const result = await es.search({
      index: 'country-suggestions',
      body: {
        query: {
          match: {
            suggest: {
              query: q,
              analyzer: 'standard',
              fuzziness: 1
            }
          }
        }
      }
    });

    const suggestions = result.hits.hits.map(hit => hit._source.suggest[0]);

    res.status(200).json(suggestions);
  } catch (err) {
    res.status(500).json({ message: `Error retrieving suggestions - ${err.toString()}`})
  }
}

exports.deleteIndex = async (req, res) => {
  try {
    await es.indices.delete({ index: 'country-suggestions' });
    res.status(200).json({ message: 'Suggestions index deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: `Error deleting suggstion index - ${err.toString()}`})
  }
}

exports.indexSuggestions = async (req, res) => {
  try {
    const indexAlreadyExists = await es.indices.exists({ index: 'country-suggestions' });

    if (indexAlreadyExists) {
      throw new Error('Index already exists - it needs to be deleted first.');
    }

    // includeTypeName is needed for ES7 - https://stackoverflow.com/a/55699726/9508975
    await es.indices.create({ index: 'country-suggestions', includeTypeName: true, body: suggestionSchema });

    const esBody = [];
    countryList.forEach(country => {
      esBody.push({ index: { _index: 'country-suggestions', _type: 'suggestions' }});
      esBody.push({ suggest: [country] });
    });

    es.bulk({ body: esBody });

    res.status(200).json({ message: 'Suggestions indexed successfully' });
  } catch (err) {
    res.status(500).json({ message: `Error indexing suggestions - ${err}` });
  }
}
const express = require('express');
const morgan = require('morgan');

const app = express();
const PORT = 3000;
const suggestionsRouter = require('./routes/suggestions');

app.use(morgan('dev'));
app.use('/suggestions', suggestionsRouter);

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use('/api', require('./routes/fetch-sounds'));
app.use('/api', require('./routes/fetch-sounds-copy'));
app.use('/sounds', express.static(path.join(__dirname, '/sounds')));

//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});


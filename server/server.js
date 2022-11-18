const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use('/api', require('./routes/fetch-sounds'));


//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});


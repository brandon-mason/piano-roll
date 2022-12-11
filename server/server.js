const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;

app.use(cors());

app.use('/api', require('./routes/sound-file-count.js'));
app.use('/sounds', express.static(path.join(__dirname, '/sounds')));



//server 
app.listen(PORT, () => {
  console.log(`node server is running on port %s`, PORT);
});


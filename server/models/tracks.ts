const SchemaT = require('mongoose').Schema;

const SavedTrackSchema = new SchemaT({
  userId: { 
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  midiNoteInfo: {
    type: String,
    required: true,
  }
})
const SchemaT = require('mongoose').Schema;

const SavedTrackSchema = new SchemaT({
  userId: { 
    type: String,
    required: true,
  },
  trackname: {
    type: String,
    required: true,
  },
  midiNoteInfo: {
    type: String,
    required: true,
  }
})

module.exports = require('mongoose').model('SavedTracks', SavedTrackSchema);
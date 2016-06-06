// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var activitySchema = mongoose.Schema({
    event: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Activity', activitySchema);

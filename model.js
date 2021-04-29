// BEGIN DATA MODEL
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb+srv://web4200:MYPASSWORD@cluster0.cxlp3.mongodb.net/seniorProjectData?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	encryptedPassword: {
		type: String,
		required: true
	},
	scheduleData: {
		type: String,
		required: [true, "You must specify the player's current schedule."]
	},
	classData: {
		type: String,
		required: [true, "You must specify the player's class data."]
	},
	weekData: {
		type: String,
		required: [true, "You must specify the player's current week."]
	},
	friendData: {
		type: String,
		required: [true, "You must specify the player's friend data."]
	}

});

userSchema.methods.setEncryptedPassword = function(plainPassword, callback) {
	bcrypt.hash(plainPassword, 12).then((hash) => {
		this.encryptedPassword = hash;
		callback();
	});
};

userSchema.methods.verifyPassword = function (plainPassword, callback) {
	bcrypt.compare(plainPassword, this.encryptedPassword).then(result => {
		callback(result);
	});
};

const User = mongoose.model('User', userSchema);

module.exports = {
	User, User
};

var names	= require('./names');
var genders	= require('./genders');

module.exports = {
	"en": {
		"translation": {
			"NAMES" 			: names.NAMES,
			"NAMES_ATTRIBUTES"  : names.NAMES_ATTRIBUTES,
			"GENDERS" 			: genders.GENDERS,

			"CONTINUE_PROMPT" 	: " Now, what was your question?",
			"NOT_FOUND_MESSAGE" : "I'm sorry, I currently do not know ",
			"REPEAT_MESSAGE" 	: "Try saying repeat.",
			"REPROMPT" 			: "Would you like analyize a different name?",
			"STOP_MESSAGE" 		: "Goodbye!",
			"UNHANDLED" 		: "I'm sorry, I didn't get that. You can repeat that command.",
			"WELCOME_MESSAGE" 	: "Welcome to Name Analysis. You can ask questions to learn about the meaning behind someones name. Please tell me your first name...",
			"WELCOME_REPROMPT" 	: "For instructions on what you can say, please say help me."
		}
	}
};

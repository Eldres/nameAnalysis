'use strict';

var Alexa           = require('alexa-sdk');
var alexaLib        = require('./alexaLib.js');
var APP_ID 			= "amzn1.ask.skill.0f86fe6d-e239-468a-b876-a796628daed4";
var languageStrings = require('./languageStrings');
var langEN          = languageStrings.en.translation;

exports.handler = function(event, context, callback) {
    var alexa       = Alexa.handler(event, context);
    alexa.appId     = APP_ID;
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
	'NameAnalysisIntent': function() {
		var requestedName 				  = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Name);
		var myName 						  = langEN.NAMES[requestedName];
		var requestedGender 			  = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Gender);
		var genders 					  = langEN.GENDERS[requestedGender];
		
		this.attributes['repromptSpeech'] = langEN.REPROMPT;

		if (myName){
			this.attributes['name'] = myName;
		}else if(requestedName){
			this.attributes['speechOutput'] = alexaLib.notFoundMessage(this.event.request.intent.slots.Name.name, requestedName);
		}
		else{
			this.attributes['speechOutput'] = langEN.UNHANDLED;
		}

		if(this.attributes['continue']){
			this.emit(':ask', this.attributes['name'] + ". " + this.attributes['repromptSpeech']);
		}
		else{
			this.emit(':tell', this.attributes['speechOutput']);
		}
	},
	'Unhandled': function () {
        this.attributes['continue']         = true;
        this.attributes['speechOutput']     = langEN.UNHANDLED;
        this.attributes['repromptSpeech']   = langEN.HELP_REPROMPT;
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'LaunchRequest': function () {
        // Alexa, ask [my-skill-invocation-name] to (do something)...
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['continue']         = true;
        this.attributes['speechOutput']     = langEN.WELCOME_MESSAGE;
        this.attributes['repromptSpeech']   = langEN.WELCOME_REPROMPT;
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = langEN.HELP_MESSAGE;
        this.attributes['repromptSpeech'] = langEN.HELP_REPROMPT;
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', langEN.STOP_MESSAGE);
    }
};
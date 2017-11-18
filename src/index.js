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
        this.emit('GetUserNameIntent');
    },
	'GetUserNameIntent': function() {
        var requestedName   = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Name);
        var myName          = langEN.NAMES[requestedName];
        
        this.attributes['repromptSpeech'] = langEN.REPROMPT;

        if (myName){ //get user name
            this.attributes['name'] = myName;
        }else if(requestedName){ //if user provides a name that is not in my dictionary
            this.attributes['speechOutput'] = alexaLib.notFoundMessage(this.event.request.intent.slots.Name.name, requestedName);
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }

        this.attributes['speechOutput'] = "Hi, " + this.attributes['name'] + ". Whats your gender?";
        this.emit(':ask', this.attributes['speechOutput'], 'GetUserGenderIntent');
    },
    'GetUserGenderIntent': function() {
        var requestedGender  = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Gender);
        var myGender         = langEN.GENDERS[requestedGender];
        var UserName         = this.attributes['name'];
        
        this.attributes['repromptSpeech'] = langEN.REPROMPT;

        if(myGender){ //get user gender
            this.emit(':ask', UserName);
        }else if(requestedName){ //if user provides a gender that is not in my dictionary
            this.attributes['speechOutput'] = alexaLib.notFoundMessage(this.event.request.intent.slots.Gender.gender, requestedGender);
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
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
        this.emit(':ask', 'Welcome to Name Analysis. I can help you understand whether your first name is helping or hurting you… Please tell me your first name…');
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
    'AMAZON.YesIntent': function() {
        this.emit('NameAnalysisIntent');
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Thank you for trying Name Analysis. Remember your name can both help you and hurt you!');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', langEN.STOP_MESSAGE);
    }
};

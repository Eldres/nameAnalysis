'use strict';

var Alexa           = require('alexa-sdk');
var alexaLib        = require('./alexaLib.js');
var APP_ID 			= "amzn1.ask.skill.ccbb2c53-f198-4f41-b158-0a5ac90e2557";
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
        var requestedName     = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Name);
        var thisName          = langEN.NAMES[requestedName];
        var thisNameDesc      = thisName.description;
        var thisNameGender    = thisName.genderType;
        
        this.attributes['repromptSpeech'] = "Would you like to analyze a different name? Or you may stop by saying 'Stop'.";
        
        if(thisName||requestedName){ //checks to see if provided name exists in my dictionary of names
            this.attributes['name'] = requestedName; //store user input into session attribute, if given name is in dict
            this.attributes['description'] = thisNameDesc; //stores user input of requested names description into session attribute
            this.attributes['gender'] = thisNameGender; //stores the gender type of the requested name into a session attribute
        }
        else if(!requestedName){ //if user provides a name that is not in my dictionary
            this.attributes['speechOutput'] = "I'm sorry I do not know the name analysis for "+requestedName+" , please try another name for analysis."; //returns not found message if user provides name not listed in dict
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }

        this.attributes['speechOutput'] = "Hi, " + this.attributes['name'] + ". Whats your gender?";
        this.emit(':ask', this.attributes['speechOutput']);
    },
    'GetUserGenderIntent': function() {
        var requestedGender  = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Gender);
        var thisGender       = langEN.GENDERS[requestedGender];
        var myName           = this.attributes['name'];
        var myGender         = this.attributes['gender'];
        var myNameDesc       = this.attributes['description'];
        
        this.attributes['repromptSpeech'] = "Would you like to analyze a different name? Or you may stop by saying 'Stop'.";

        if(thisGender == myGender){ //checks if requestedGender and genderType of name are the same
            this.attributes['speechOutput'] = myNameDesc; //sets NameDesc from session attribute to speechOutput
        }
        else if(requestedGender){ //if user provides a gender that is not in my dictionary
            this.attributes['speechOutput'] = "I'm sorry I only have information based on binary gender types. Please provide a gender type that is either male or female.";
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }

        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']); //no clue as to why there is a long pause between the speechOutput and the repromptSpeech
    },
	'Unhandled': function () {
        //this.attributes['continue']         = true;
        this.attributes['speechOutput']     = langEN.UNHANDLED;
        this.attributes['repromptSpeech']   = langEN.HELP_REPROMPT;
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'LaunchRequest': function () {
        // Alexa, ask [my-skill-invocation-name] to (do something)...
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['speechOutput']     = langEN.WELCOME_MESSAGE;
        this.attributes['repromptSpeech']   = langEN.WELCOME_REPROMPT;
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput']   = langEN.HELP_MESSAGE;
        this.attributes['repromptSpeech'] = langEN.HELP_REPROMPT;
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'AMAZON.StartOverIntent': function () {
        this.emit('LaunchRequest');
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.YesIntent': function() {
        this.emit('LaunchRequest');
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Thank you for trying Name Analysis. Remember your name can both help you and hurt you!');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', langEN.STOP_MESSAGE);
    }
};
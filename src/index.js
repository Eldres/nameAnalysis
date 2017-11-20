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
        
        this.attributes['repromptSpeech'] = langEN.REPROMPT;
        
        /* working code
        if(thisName){
            this.attributes['name'] = requestedName; //store user input into session attribute, if given name is in dict
            thisName = this.attributes['name'];
        }
        this.attributes['speechOutput'] = "Hi, " + thisName + ". Whats your gender?";
        this.emit(':ask', this.attributes['speechOutput']);
        */

        if(thisName){
            this.attributes['name'] = requestedName; //store user input into session attribute, if given name is in dict
            thisName = this.attributes['name'];
            this.attributes['description'] = thisNameDesc;
        }
        else if(requestedName){ //if user provides a name that is not in my dictionary
            this.attributes['speechOutput'] = alexaLib.notFoundMessage(this.event.request.intent.slots.Name.name, requestedName); //returns not found message if user provides name not listed in dict
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }

        this.attributes['speechOutput'] = "Hi, " + thisName + ". Whats your gender?";
        this.emit(':ask', this.attributes['speechOutput']);
    },
    'GetUserGenderIntent': function() {
        var requestedGender  = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Gender);
        var myGender         = langEN.GENDERS[requestedGender];
        var myName           = this.attributes['name'];
        var myNameDesc       = this.attributes['description'];
        
        this.attributes['repromptSpeech'] = langEN.REPROMPT;

        if(myGender){ //checks to see if the provided gender exists in the dictionary
            this.attributes['speechOutput'] = myNameDesc;
            // if(myGender === "male"){ //this logic checks out -- if(myGender === "male"){
            //     this.attributes['speechOutput'] = myNameDesc;
            // }
        }
        else if(requestedName){ //if user provides a gender that is not in my dictionary
            this.attributes['speechOutput'] = alexaLib.notFoundMessage(this.event.request.intent.slots.Gender.gender, requestedGender);
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }

        this.emit(':tell', this.attributes['speechOutput']);
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
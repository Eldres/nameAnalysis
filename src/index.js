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
/* ** titles     ++ completed
**Potential skill name changes/ideas**
--Current-- Name Analysis
-name crunch
-name breakdown
-name report
-name audit
**FEATURES**
-Ask user for his/her first name (Based on Amazon.US_First_Name. **Add .GB_First_Name**) ++
-Ask user for his/her gender ++
	--handle input that is not name or gender ++
-Alexa reads out the name analysis for user based on provided name+gender
	**Future feature: ask user if they want more information, such as health analysis or ask if the analysis seems accurate to the user(easy yes/no prompt)**
-Alexa asks the user whether they want to try another name or stop.
-**Future feature: Add states. Remember the user's name and change the welcome message to reflect repeat visit.**

 */

var handlers = {
	'NameAnalysisIntent': function() {
        var requestedName     = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Name);
        var thisName          = langEN.NAMES[requestedName];


		var thisDescAdj       = langEN.DESCRIPTION.adjectives; //allows the usage of the adjectives object from DESCRIPTION.js
		var thisDescNoun      = langEN.DESCRIPTION.nouns;
		var thisDescVerb      = langEN.DESCRIPTION.verbs;
		var thisDescAdv       = langEN.DESCRIPTION.adverbs;
		var thisDescArt       = langEN.DESCRIPTION.articles;

		var rng               = Math.floor(Math.random()*113);
		if(rng == thisDescAdj){
			var rndDescAdj         = rng;
			this.attributes['adj'] = rndDescAdj;
		}

		console.log(requestedName); //cloudwatch test
        this.attributes['repromptSpeech'] = "Are you still there? I did not catch the name you want to analyze, please repeat the name or provide a new one. You may also stop by saying 'Stop'.";

        if(thisName){ //checks to see if provided name exists in my dictionary of names
	        /* OLD CODE BASE
	        //var thisNameDesc                    = thisName.description;
	        //var thisNameGender                  = thisName.genderType;
	        //this.attributes['description']      = thisNameDesc; //stores user input of requested names description into session attribute
	        //this.attributes['gender']           = thisNameGender; //stores the gender type of the requested name into a session attribute
	        */
	        this.attributes['name']             = requestedName; //store user input into session attribute, if given name is in dict

	        /*
	            *use Math.floor(Math.random() * 113) for below rnd name analysis            ==Currently there are 112 adjectives in the DESCRIPTION.js file==
	            *this will be the randomly generated name analysis based on DESCRIPTION.js
	        */
	        this.attributes['description']      = "Your name of "+this.attributes['name']+" creates a " + this.attributes['adj'] + ", ";


	        this.attributes['speechOutput']     = "Hi, " + this.attributes['name'] + ". Whats your gender?";
        }
        else if(!thisName){ //if user provides a name that is not in my dictionary
            this.attributes['speechOutput'] = "I'm sorry I do not know the name analysis for "+requestedName+" , please try another name for analysis."; //returns not found message if user provides name not listed in dict
        }else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }

        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
    },
    'GetUserGenderIntent': function() {
        var requestedGender  = alexaLib.validateAndSetSlot(this.event.request.intent.slots.Gender);
        var thisGender       = langEN.GENDERS[requestedGender];
        //var myName           = this.attributes['name'];
        //var myGender         = this.attributes['gender']; **obsolete based on new direction of name analysis
        var myNameDesc       = this.attributes['description'];

        this.attributes['repromptSpeech'] = "Would you like to analyze a different name? Or you may stop by saying 'Stop'.";

        if(thisGender){ //checks if requestedGender and genderType of name are the same   **old logic was: if(thisGender == myGender){...}**
            this.attributes['speechOutput'] = myNameDesc; //sets NameDesc from session attribute to speechOutput
        }
        else if(!thisGender){ //if user provides a gender that is not in my dictionary
            this.attributes['speechOutput'] = "I'm sorry I only have information based on binary gender types. Please provide a gender type that is either male or female.";
        }else if(thisGender != myGender){
        	this.attributes['speechOutput'] = "I'm sorry the provided gender type is not correct. Please provide a gender type that is closer aligned to the gender of the name provided.";
        }
        else{
            this.attributes['speechOutput'] = langEN.UNHANDLED;
        }
	    //no clue as to why there is a long pause between the speechOutput and the repromptSpeech -- might be because it was using :ask and not :tell
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech']);
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
        this.emit(':ask', 'Okay, what name would you like to check.');
    },
    'AMAZON.NoIntent': function() {
        this.emit(':tell', 'Thank you for trying Name Analysis. Remember your name can both help you and hurt you!');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', langEN.STOP_MESSAGE);
    }
};
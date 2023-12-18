/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const { LaunchRequestHandler } = require("./handlers/launch")
const { HelpIntentHandler } = require("./handlers/common/help")
const { CancelAndStopIntentHandler } = require("./handlers/common/cancel")
const { FallbackIntentHandler } = require("./handlers/common/fallback")
const { SessionEndedRequestHandler } = require("./handlers/common/sessionEnded")
const { IntentReflectorHandler } = require("./handlers/common/interceptor")
const { ErrorHandler } = require("./handlers/common/error")


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    // .withCustomUserAgent('sample/hello-world/v1.2')
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
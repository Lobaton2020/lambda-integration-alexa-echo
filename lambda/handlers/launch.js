const Alexa = require('ask-sdk-core');
const moment = require("moment-timezone")
const { getRemindersFromApi, buildRemindersBody } = require("./usecase/reminder")
const { map } = require("bluebird")

module.exports.LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        const speechText = "DONE";
        const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        const { permissions } = handlerInput.requestEnvelope.context.System.user;
        if (!permissions) {
            return handlerInput.responseBuilder
                .speak('Please enable Reminder permissions in the Amazon Alexa app.')
                .withAskForPermissionsConsentCard(['alexa::alerts:reminders:skill:readwrite'])
                .getResponse();
        }
        try {
            const currentDate = moment().tz("America/New_York").format("YYYY-MM-DD")
            const reminders = await getRemindersFromApi(currentDate)
            const handleMap = async (data) => {
                const reminderPayload = buildRemindersBody(data)
                await reminderApiClient.createReminder(reminderPayload)
            }
            const options = {
                concurrency: 10
            }
            await map(reminders, handleMap, options)

            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        } catch (error) {
            console.log(`ERROR_APP: ${error.message}`, error)
            return handlerInput.responseBuilder
                .speak("Opps! Somethink went wrong!, Error: " + error.message)
                .getResponse();

        }
    }
};
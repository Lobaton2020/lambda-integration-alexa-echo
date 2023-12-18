const axios = require("axios")
const URL_API = "https://graphql-api-theta.vercel.app/reminders"

const getRemindersFromApi = async (date) => {
    try {
        const { data } = await axios.get(`${URL_API}?date=${date}`)
        if (!Array.isArray(data)) {
            throw new Error("Data corrupta")
        }
        return data
    } catch (error) {
        console.log(`ERROR::${getRemindersFromApi.name}_::${error.message}`)
        return []
    }
}

/**
 * data: { description:string, hour, minute: number }
*/
const buildRemindersBody = ({ description, hour, minute }) => {
    const currentTime = moment().tz("America/Los_Angeles")
    const UTC_GMT = -5;
    const scheduledTime = currentTime.set({
        hour: `${hour + UTC_GMT}`.padStart(2, 0),
        minute: `${minute}`.padStart(2, 0),
        second: "00"
    }).format('YYYY-MM-DDTHH:mm:ss')
    return {
        "requestTime": currentTime.format('YYYY-MM-DDTHH:mm:ss'),
        "trigger": {
            "type": "SCHEDULED_ABSOLUTE",
            "scheduledTime": scheduledTime,
            "timeZoneId": "America/Los_Angeles"
        },
        "alertInfo": {
            "spokenInfo": {
                "content": [{
                    "locale": "en-US",
                    "text": description
                }]
            }
        },
        "pushNotification": {
            "status": "ENABLED"
        }
    };
}

module.exports = {
    getRemindersFromApi,
    buildRemindersBody
}
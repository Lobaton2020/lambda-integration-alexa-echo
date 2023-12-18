const axios = require("axios")
const moment = require("moment-timezone")
const URL_API = "https://graphql-api-theta.vercel.app/reminders"

const getRemindersFromApi = async (date) => {
    try {
        const { data } = await axios.get(`${URL_API}?date=${date}`)
        if (!Array.isArray(data)) {
            throw new Error("Data corrupta")
        }
        return data
    } catch (error) {
        console.log(`ERROR_AXIOS::${getRemindersFromApi.name}_::${error.message}`)
        return []
    }
}

/**
 * data: { description:string, hour, minute: number }
*/
const buildRemindersBody = ({ description, hour, minute }) => {
    const currentTime = moment().tz("America/New_York")
    const scheduledTime = currentTime.set({
        hour: `${hour}`.padStart(2, 0),
        minute: `${minute}`.padStart(2, 0),
        second: "00"
    }).format('YYYY-MM-DDTHH:mm:ss')
    return {
        "requestTime": currentTime.format('YYYY-MM-DDTHH:mm:ss'),
        "trigger": {
            "type": "SCHEDULED_ABSOLUTE",
            "scheduledTime": scheduledTime,
            "timeZoneId": "America/New_York"
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
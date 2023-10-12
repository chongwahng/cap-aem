const cds = require('@sap/cds');
const AEMClient = require('../../AEMClient_Solace')     // --> uses package solclientjs
const solace = require('solclientjs')

cds.on('served', async (services) => {
    const aem = new AEMClient()

    aem.connect().then(() => {

        services['gcoe.EmitterService'].on('test/in/clsgnewver', msg => {
            let messageText = JSON.stringify(msg.data)
            let message = solace.SolclientFactory.createMessage()

            message.setDestination(solace.SolclientFactory.createTopicDestination('test/in/clsgnewver'))
            message.setBinaryAttachment(messageText)
            message.setDeliveryMode(solace.MessageDeliveryModeType.DIRECT)

            console.log('Publishing message "' + messageText + '" to topic "' + 'test/in/clsgnewver' + '"...')

            try {
                aem.session.send(message)
                console.log(`Message published -> ${messageText}`)
            } catch (error) {
                console.log(error.toString())
            }
        })
    })
})

module.exports = cds.server

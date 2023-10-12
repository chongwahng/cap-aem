const cds = require('@sap/cds');
const AEMClient = require('../../AEMClient_Solace')     // --> uses package solclientjs
const solace = require('solclientjs')

cds.on('served', async (services) => {
    let messageConsumer

    const aem = new AEMClient()
    
    aem.connect(services['gcoe.ReceiverService'], 'q/test/in/clsgnewver').then(() => {
        aem.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
            console.log('=== Successfully connected and ready to start the message consumer. ===')
            
            try {
                messageConsumer = aem.session.createMessageConsumer({
                    queueDescriptor: { name: 'q/test/in/clsgnewver', type: solace.QueueType.QUEUE },
                    acknowledgeMode: solace.MessageConsumerAcknowledgeMode.CLIENT,
                    createIfMissing: true
                })

                messageConsumer.on(solace.MessageConsumerEventName.UP, function () {
                    console.log('=== Ready to receive messages. ===');
                })

                messageConsumer.on(solace.MessageConsumerEventName.MESSAGE, function (message) {
                    console.log('Received message: "' + message.getBinaryAttachment() + '",' + ' details:\n' + message.dump());

                    services['gcoe.ReceiverService'].emit('q/test/in/clsgnewver', message.getBinaryAttachment())

                    // Need to explicitly ack otherwise it will not be deleted from the message router
                    message.acknowledge();
                })

                messageConsumer.connect()
            } catch (error) {
                console.log(error.toString())
            }            
        })    
    })
})

module.exports = cds.server

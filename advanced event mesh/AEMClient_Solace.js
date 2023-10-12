const cds = require('@sap/cds')
const assert = require('assert')
const solace = require('solclientjs')

module.exports = class SolaceClient {
    constructor(useJSON = true) {
        this.connectionInfo = cds.env.requires.SAPAEM.credentials
        this.session = null

        assert(this.connectionInfo, 'No connection details specified in cds.requires.SAPAEM.credentials')

        this.factoryProps = new solace.SolclientFactoryProperties()
        this.factoryProps.profile = solace.SolclientFactoryProfiles.version10
        solace.SolclientFactory.init(this.factoryProps)
    }

    connect = (service, queue) => {
        try {
            this.session = solace.SolclientFactory.createSession({
                url: `${this.connectionInfo.protocol}://${this.connectionInfo.host}:${this.connectionInfo.port}`,
                vpnName: this.connectionInfo.vpn,
                userName: this.connectionInfo.user,
                password: this.connectionInfo.password
            })

            this.session.on(solace.SessionEventCode.UP_NOTICE, function (sessionEvent) {
                console.log('=== Successfully connected and ready to exchange message ===')
            })
        } catch (error) {
            console.log(error.toString())
        }

        return new Promise((resolve, reject) => {
            this.session.connect()
            resolve()
        })
    }
}
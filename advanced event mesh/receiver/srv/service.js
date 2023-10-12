const cds = require('@sap/cds');
const event = 'q/test/in/clsgnewver';

module.exports = async (srv) => {
    srv.on(event, async req => {
        console.log('received >', req.event, req.data);

        const { Toy, Owner } = JSON.parse(req.data)
        await UPDATE(cds.entities.Toys, Toy).with({ Owner: Owner });
        await INSERT.into(cds.entities.Changes).entries({
            Toy_ID: Toy,
            Data: `This toy now belongs to ${Owner}`
        });
    });
}
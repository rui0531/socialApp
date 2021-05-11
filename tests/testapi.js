var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();
var api = require('../js/api.js');

describe('messages', async function() {
    let server = await api.run();

    it('should be able to POST new message', function() {
        let group = "dance group"
        let message = { text: 'Message text', author: 'zoee1', msgID: 'msg5657' }
        return chai.request(server)
            .post(`/messages/${group}`)
            .send(message)
            .then(res => {
                //check the response status
                res.should.have.status(200);
                //check the response body
                res.body.should.be.a('object');
                //check response properties
                let obj = res.body;
                obj.should.have.property('msg');
                obj.msg.should.equal('Message Added.')
                obj.should.have.property('id');
                obj.id.should.equal('Exam');
            });
    });

    it('should not be able to POST duplicate message', function() {
        let group = "dance group"
        let message = { text: 'Message text', author: 'zoee1', msgID: 'msg5657' }
        return chai.request(server)
            .post(`/messages/${group}`)
            .send(message)
            .then(res => res.should.have.status(400));
    });
});
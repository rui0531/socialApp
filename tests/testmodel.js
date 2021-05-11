var mocha = require('mocha');
var chai = require('chai');
var model = require('../shared/model');
var should = chai.should();
var expect = chai.expect;

describe("Media", function() {
    it('should create and initialise a new media item', function() {
        // Create test item
        let testMedia = new model.Media('Venice Canal', 'Photo taken March 2019', 'zoee1', 'content/uploads/uploadedMedia-23455667.jpg');

        testMedia.should.be.instanceof(model.Media);
        testMedia.title.should.equal('Venice Canal');
        testMedia.description.should.equal('Photo taken March 2019');
        testMedia.user.should.equal('zoee1');
        testMedia.path.should.equal('content/uploads/uploadedMedia-23455667.jpg');
    });

    it('should not create an empty object', function() {
        let testFunc = () => new model.Media();
        expect(testFunc).to.throw(Error, /Missing media information/);
    });

    it('should reject incorrect initialisation from JSON (missing file path)', function() {
        let testFunc = () => model.Media.fromJSON({ title: "Venice Canal", description: "Gondola near Rialto Bridge, Venice", user: "max234" });

        expect(testFunc).to.throw(Error, /Missing file path/);
    });
});

describe("Message", function() {
    it('should create and initialise a new message item', function() {
        let testMessage = new model.Message('UUID-543556', 'This is a message', 'zoee1', Date('1995-12-17T03:24:00'), []);

        testMessage.should.be.instanceof(model.Message);
        testMessage.msgID.should.equal('UUID-543556');
        testMessage.text.should.equal('This is a message');
        testMessage.author.should.equal('zoee1');
        testMessage.date.should.equal(Date('1995-12-17T03:24:00'));
        testMessage.comments.should.eql([]); // Deep equality which looks at content (not strict equality) 
    });

    it('should not create an empty object', function() {
        let testFunc = () => new model.Message();
        expect(testFunc).to.throw(Error, /Missing message information/);
    });

    it('should reject incorrect initialisation from JSON (missing text)', function() {
        let testFunc = () => model.Message.fromJSON({ msgID: "UUID-543556", author: "zoee1" });

        expect(testFunc).to.throw(Error, /Missing message text/);
    });
});
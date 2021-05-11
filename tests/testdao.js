var mocha = require('mocha');
var chai = require('chai');
var chaiPromise = require('chai-as-promised');
chai.use(chaiPromise); // needed to deal with rejected promises
var should = chai.should(),
    expect = chai.expect;
var model = require('../shared/model');
var dao = require('../js/dao.js');

describe('DAO', function() {
    it('should be able to inisitialise and populate the data store', async function() {
        await expect(dao.init()).to.be.fulfilled;
    });

    it('should be able to get a user by username', async function() {
        let testUser = await dao.getByUsername("zoee1");

        testUser.should.be.instanceof(model.User);
        testUser.username.should.equal("zoee1");
    });

    it('should be able to get group by tag', async function() {
        let testGroups = await dao.getByTags("nature");

        for (let i in testGroups) {
            testGroups[i].should.be.an.instanceof(model.Group);
        }
    });
});
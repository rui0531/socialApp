/**
 * Data access object for the "Communities" webpage application/
 * Contains functions to add, edit and delete data on user, group and events from the database
 * @author CS5003 Group 25
 * @version 1.0
 * @module js/dao
 * @see module:shared/model
 */

(function() {
    const User = require("../shared/model.js").User;
    const Group = require("../shared/model.js").Group;
    const Event = require("../shared/model.js").Event;

    //everything needed to access the DB is contained within this module
    const config = require('../config-db.js');
    const MongoClient = require('mongodb').MongoClient;
    const fullurl = `mongodb://${config.username}:${config.password}@${config.url}:${config.port}/${config.database}?authSource=admin`;
    const sanitisedUrl = fullurl.replace(/:([^:@]{1,})@/, ':****@');
    const client = new MongoClient(fullurl, { useUnifiedTopology: true });

    // create collection for user; collection2 for group; collection3 for events
    let collection = null;
    let collection2 = null;
    let collection3 = null;

    const bcrypt = require('bcrypt');
    /**
     * Dummy data for users
     * @type {Array}
     */
    let userData = [
        { _id: "zoee1", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["nature", "exercise", "book"], groupsJoined: ["Reading Club", "Nature Group", "Trampoline Club", "Cycling Club", "Travel Memories"] },
        { _id: "anna1", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["dance", "inside", "walking", "exercise"], groupsJoined: ["Jazz Dance Group", "Salsa Dancing", "Travel Memories"] },
        { _id: "max234", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["dance", "book", "inside"], groupsJoined: ["Nature Group", "Jazz Dance Group", "Reading Club", "Travel Memories"] },
        { _id: "william123", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["over 50s", "social", "fun"], groupsJoined: ["Over 50s Club", "Reading Club", "Salsa Dancing", "Travel Memories"] },
        { _id: "Noah246", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["fun", "car", "adrenaline", "cycle", "dogs", "exercise"], groupsJoined: ["Car Racing Club", "Cycling Club"] },
        { _id: "amy234", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["dogs", "stars", "astronomy"], groupsJoined: ["Dog Walkers", "Stargazers"] },
        { _id: "sian789", password: bcrypt.hashSync("p4ssw0rd", 10), interests: ["astronomy", "homemade", "crafts"], groupsJoined: ["Stargazers", "Arts and Crafts Club"] }
    ]

    /**
     * dummy data for groups
     * @type {Array}
     */
    let groupData = [
        { _id: "Nature Group", tags: ["nature", "outside", "walking"], description: "a group for nature lovers", members: ["zoee1", "max234"], adminuser: ["max234"], msgs: [{ msgID: "msg1", text: "Hello welcome to the Nature Group!", author: "max234", date: new Date(), comments: [] }], media: [{ title: "National Parks", description: "Saw this clip on Nat Geo and there are so many beautiful places!", user: "max234", path: "uploads/uploadedMedia-1619093834159.mp4" }] },
        {
            _id: "Jazz Dance Group",
            tags: ["dance", "jazz"],
            description: "Dance club specialising in jazz",
            members: ["anna1", "max234"],
            adminuser: ["anna1"],
            msgs: [{
                    msgID: "msg2",
                    text: "Hello!",
                    author: "anna1",
                    date: new Date("2021-04-13T19:03:21.166Z"),
                    comments: [{ msgID: "cmnt1", text: "Reply!", author: "zoee1", date: new Date("2021-04-14T21:03:21.166Z"), comments: [] },
                        { msgID: "cmnt2", text: "Ok!", author: "anna1", date: new Date("2021-04-16T11:03:21.166Z"), comments: [] }
                    ]
                },
                {
                    msgID: "msg3",
                    text: "Hello again!",
                    author: "anna1",
                    date: new Date("2021-04-13T19:03:21.166Z"),
                    comments: [{ msgID: "cmnt3", text: "Reply on 2nd msg", author: "zoee1", date: new Date("2021-04-16T11:03:21.166Z"), comments: [] }]
                }
            ],
            media: [{ title: "Jazz Festival 2019", description: "Had a blast at the Jazz Festival.", user: "max234", path: "uploads/uploadedMedia-1619093492631.jpg" }]
        },
        { _id: "Reading Club", tags: ["nature", "book", "inside", "over 50s", "social"], description: "Meet up for discussing books", members: ["zoee1", "max234", "william123"], adminuser: ["zoee1"], msgs: [{ msgID: "msg4", text: "Hello welcome to the reading group!", author: "zoee1", date: new Date(), comments: [] }], media: [{ title: "My Library...", description: "...I wish! ", user: "zoee1", path: "uploads/uploadedMedia-1619094188407.jpeg" }] },
        { _id: "Trampoline Club", tags: ["exercise", "indoor", "trampoline", "fun"], description: "group for trampoline enthusiasts", members: ["zoee1"], adminuser: ["zoee1"], msgs: [{ msgID: "msg5", text: "Welcome to Trampoline Club!", author: "zoee1", date: new Date(), comments: [] }], media: [{ title: "Get that warm up done!", description: "Don't start with the big jumps! Warm up your muscles first", user: "zoee1", path: "uploads/uploadedMedia-1619094307236.mp4" }] },
        { _id: "Salsa Dancing", tags: ["dance", "salsa", "inside", "over 50s"], description: "Dance club specialising in salsa", members: ["anna1", "william123"], adminuser: ["anna1"], msgs: [{ msgID: "msg6", text: "Welcome to the Salsa Dancing club!!", author: "anna1", date: new Date(), comments: [{ msgID: 'b366cadf-5227-440b-b363-65d7418e8903', text: 'Good to be here!', author: "william123", date: new Date(), comments: [] }] }], media: [{ title: "My kids at lessons", description: "So glad they're enjoying salsa. Start them young!", user: "william123", path: "uploads/uploadedMedia-1619094504146.jpg" }] },
        { _id: "Car Racing Club", tags: ["car", "adrenaline"], description: "Do you love car racing join our group!", members: ["Noah246"], adminuser: ["Noah246"], msgs: [{ msgID: "msg7", text: "Welcome to the Car Racing Club!", author: "Noah246", date: new Date(), comments: [] }], media: [{ title: "Drag Event 18/04/19", description: "That was an incredible afternoon!", user: "Noah246", path: "uploads/uploadedMedia-1619094638256.mp4" }, { title: "Drag Event 18/04/19", description: "My pride and joy", user: "Noah246", path: "uploads/uploadedMedia-1619094677358.jpg" }] },
        { _id: "Cycling Club", tags: ["nature", "outside", "cycle"], description: "Meet ups for cyclists", members: ["zoee1", "Noah246"], adminuser: ["zoee1"], msgs: [{ msgID: "msg8", text: "Welcome to the Cycling Club!", author: "zoee1", date: new Date(), comments: [] }], media: [{ title: "Exploring", description: "She never caught up to me LOL!", user: "zoee1", path: "uploads/uploadedMedia-1619094894070.jpg" }] },
        { _id: "Over 50s Club", tags: ["nature", "book", "over 50s", "social"], description: "social group for over 50s", members: ["william123"], adminuser: ["william123"], msgs: [{ msgID: "msg9", text: "Hello, thank you for joining our over 50s social club!", author: "william123", date: new Date(), comments: [] }], media: [{ title: "Meetup", description: "Good fun at our last meetup! looking forward to next month's event.", user: "william123", path: "uploads/uploadedMedia-1619095104838.jpg" }] },
        { _id: "Dog Walkers", tags: ["nature", "dogs", "walking", "social"], description: "Meet others for doggy play dates", members: ["amy234"], adminuser: ["amy234"], msgs: [{ msgID: "msg10", text: "Hello, thank you for joining our dog walking club!", author: "amy234", date: new Date(), comments: [] }], media: [{ title: "Doggy Art", description: "Sometimes I draw random things on my iPad", user: "amy234", path: "uploads/uploadedMedia-1619086107313.png" }, { title: "City dog", description: "This dog I'm walking is soooo cute", user: "amy234", path: "uploads/uploadedMedia-1619095336594.jpg" }] },
        { _id: "Stargazers", tags: ["nature", "book", "stars", "astronomy"], description: "we love stars", members: ["sian789", "amy234"], adminuser: ["sian789"], msgs: [{ msgID: "msg11", text: "Hello, thank you for joining our stargazing club!", author: "sian789", date: new Date(), comments: [] }], media: [{ title: "Nebula", description: "Dark Sky Site USA", user: "sian789", path: "uploads/uploadedMedia-1619095456698.jpg" }] },
        { _id: "Arts and Crafts Club", tags: ["nature", "book", "homemade", "crafts"], description: "join us to make some crafts!", members: ["sian789"], adminuser: ["sian789"], msgs: [{ msgID: "msg9", text: "Hello, welcome to our art and crafts club", author: "sian789", date: new Date(), comments: [] }], media: [{ title: "Latest Embroidery Piece", description: "Still some more to go but I'm loving it! This is my first time working on dark cloth but it's so rewarding!", user: "sian789", path: "uploads/uploadedMedia-1619095575991.jpeg" }] },
        { _id: "Travel Memories", tags: ["travel", "nature", "photography"], description: "Sharing travel memories", members: ["anna1", "william123", "zoee1", "max234"], adminuser: ["anna1"], msgs: [{ msgID: "msg56", text: "Hello! Where have you travelled?", author: "anna1", date: new Date("2021-04-13T19:03:21.166Z"), comments: [{ msgID: "cmnt78", text: "Venice!", author: "zoee1", date: new Date("2021-04-14T21:03:21.166Z"), comments: [] }, { msgID: "cmnt678", text: "How nice!", author: "anna1", date: new Date("2021-04-16T11:03:21.166Z"), comments: [] }] }, { msgID: "msg56765", text: "Hello new members!", author: "anna1", date: new Date("2021-04-13T19:03:21.166Z"), comments: [{ msgID: "cmnt3", text: "Hi! I'm Max", author: "max234", date: new Date("2021-04-16T11:03:21.166Z"), comments: [] }] }], media: [{ title: "Venice Canal", description: "I love Venice, it's such a romantic place. I took this photo in July 2019.", user: "zoee1", path: "uploads/uploadedMedia-1618840592180.jpg" }, { title: "Drone Video", description: "I took my first drone video (it has no audio). Hope you enjoy!", user: "max234", path: "uploads/uploadedMedia-1618840553840.mp4" }] }
    ]

    /**
     * dummy data for events 
     * @type {Array}
     */
    let eventData = [
        { _id: "event1", eventName: "Beginner Jazz", location: "edinburgh", date: "2020-11-05", comments: "Jazz class for beginners", usersGoing: ["anna1"], createdBy: "anna1", groupName: "Jazz Dance Group" },
        { _id: "event2", eventName: "Advanced Jazz", location: "Online", date: "2021-04-20", comments: "Jazz class for advanced dancers", usersGoing: ["anna1"], createdBy: "anna1", groupName: "Jazz Dance Group" },
        { _id: "event3", eventName: "A walk in the local area", location: "st andrews", date: "2021-04-21", comments: "Short easy walk for everyone", usersGoing: ["zoee1", "max234"], createdBy: "zoee1", groupName: "Nature Group" },
        { _id: "event4", eventName: "Book Group", location: "london", date: "2021-04-24", comments: "The first book group we will be readng Pride and Prejudice", usersGoing: ["zoee1", "max234", "william123"], createdBy: "william123", groupName: "Reading Club" },
        { _id: "event5", eventName: "First Social", location: "Reading", date: "2021-04-25", comments: "Tea and cake social", usersGoing: ["max234", "william123", "zoee1"], createdBy: "zoee1", groupName: "Over 50s Club" },
        { _id: "event6", eventName: "Candle making", location: "london", date: "2021-04-20", comments: "join us at our first event to make a candle", usersGoing: ["sian789"], createdBy: "sian789", groupName: "Arts and Crafts Club" },
        { _id: "event7", eventName: "Travel Meetup", location: "St Salvatore's Quad, St Andrews", date: "2021-05-28", comments: "Come meet fellow travellers. We will watch a travel documentary under the stars. Suggest a film today!", usersGoing: ["anna1"], createdBy: "anna1", groupName: "Travel Memories" }
    ]

    /**
     * initialise the database 
     * with the dummy data
     */
    let init = function() {
        return client.connect()
            .then(conn => {
                //if the collection does not exist it will automatically be created
                //collection = client.db().collection(config.collection);
                //test if the collections work
                collection = client.db().collection('collection');
                collection2 = client.db().collection('collection2');
                collection3 = client.db().collection('collection3');
                console.log("Connected!", sanitisedUrl);
            })
            .catch(err => { console.log(`Could not connect to ${sanitisedUrl}`, err); throw err; })
            .then(() => collection.deleteMany()) // Delete whole table for users
            .then(() => collection2.deleteMany()) // Delete whole table for groups
            .then(() => collection3.deleteMany()) // Delete whole table for events
            .then(() => collection.insertMany(userData))
            .then(res => console.log("User Data inserted with IDs", res.insertedIds))
            .then(() => collection2.insertMany(groupData))
            .then(res => console.log("Group Data inserted with IDs", res.insertedIds))
            .then(() => collection3.insertMany(eventData))
            .then(res => console.log("Event Data inserted with IDs", res.insertedIds))
            .catch(err => {
                console.log("Could not add data ", err.message);
                //For now, ingore duplicate entry errors, otherwise re-throw the error for the next catch
                if (err.name != 'BulkWriteError' || err.code != 11000) {
                    client.close();
                    console.log("Disconnected")
                    throw err;
                }
            })
    }

    //* ======================== Users ================================ */

    /**
     * Get all users from DB
     * @returns {Array} array of users 
     */
    const getUsers = function() {
        return collection.find({}).project({ username: "$_id", _id: 0, password: 1, interests: 1, groupsJoined: 1 }).toArray()
            .then(users => users.map(user => User.fromJSON(user)))
    }

    /**
     * Add user to DB
     * @param {Object} jsn - User to add to database in json format 
     * @returns {string} - the id of inserted data
     */
    const addUser = function(jsn) {
        jsn._id = jsn.username
        delete jsn.username
        return collection.insertOne(jsn)
            .then(result => result.insertedId)
    }

    /**
     * Get user info by username
     * @param {string} username - username to get data about
     * @returns {Object|null}
     */
    const getByUsername = function(username) {
        return collection.findOne({ _id: username }, { projection: { username: "$_id", _id: 0, password: 1, interests: 1, groupsJoined: 1 } })
            .then(user => User.fromJSON(user))
            // .catch(err => "Could not find")
    }

    /**
     * update user info
     * @param {Object} jsn - user data to replace old data 
     * @returns {string} number of modified entries 
     */
    const updateUser = function(jsn) {
        //let user = User.fromJSON(jsn)
        jsn._id = jsn.username
        delete jsn.username
        return collection.updateOne({ _id: jsn._id }, { $set: jsn })
            .then(result => result.modifiedCount)
    }

    /**
     * Delete user
     * @param {string} username username of user to delete 
     * @returns {string} number of deleted entries 
     */
    const deleteUser = function(username) {
        return collection.deleteOne({ _id: username })
            .then(result => result.deletedCount)
    }

    /* ======================== Groups ================================ */

    /**
     * Get all groups from DB
     * @returns {Array} array of groups
     */
    const getGroups = function() {
        return collection2.find({}).project({ groupname: "$_id", _id: 0, tags: 1, description: 1, members: 1, adminuser: 1, msgs: 1 }).toArray()
            .then(groups => groups.map(group => Group.fromJSON(group)))
    }

    /**
     * Add group to DB
     * @param {Object} jsn - group to add to database in json format 
     * @returns {string} - the id of inserted data
     */
    const addGroup = function(jsn) {
        jsn._id = jsn.groupname
        delete jsn.groupname
        return collection2.insertOne(jsn)
            .then(result => result.insertedId)
    }

    /**
     * Get group info by groupname
     * @param {string} groupname - groupname to get data about
     * @returns {Object|null}
     */
    const getByGroupName = function(groupname) {
        return collection2.findOne({ _id: groupname }, { projection: { groupname: "$_id", _id: 0, tags: 1, description: 1, members: 1, adminuser: 1, msgs: 1, media: 1 } })
            .then(group => Group.fromJSON(group))
            //.catch(err => "Could not find")
    }

    /**
     * Get group info by adminuser
     * @param {string} adminuser - adminuser to get data about
     * @returns {Object|null}
     */
    const getByAdmin = function(adminuser) {
        return collection2.find({ adminuser: adminuser }).project({ groupname: "$_id", _id: 0, tags: 1, description: 1, members: 1, adminuser: 1 }).toArray()
            .then(groups => groups.map(group => Group.fromJSON(group)))
            //.catch(err => "Could not find")
    }

    /**
     * Get group info by tags
     * @param {string} tag - tag to get data about
     * @returns {Object|null}
     */
    const getByTags = function(tag) {
        return collection2.find({ tags: tag }).project({ groupname: "$_id", _id: 0, tags: 1, description: 1, members: 1, adminuser: 1 }).toArray()
            .then(groups => groups.map(group => Group.fromJSON(group)))
            // .catch(err => "Could not find")
    }

    /**
     * update group info
     * @param {Object} jsn - group data to replace old data 
     * @returns {string} number of modified entries 
     */
    const updateGroup = function(jsn) {
        return collection2.updateOne({ _id: jsn.groupname }, { $set: jsn })
            .then(result => result.modifiedCount)
    }

    /**
     * Delete group update collection2
     * @param {Object} jsn group data(groupname) to delete  
     */
    const deleteGroup = function(jsn) {
        return collection2.deleteOne({ _id: jsn.groupname })
            .catch(err => {
                console.log("Could not delete group ", jsn, err.message);
            })
    }

    /**
     * delete group update collection (remove  groupsJoined) 
     * @param {Object} jsn group data(username) to delete 
     */
    const deleteGroupUser = function(jsn) {
        return collection.updateOne({ _id: jsn.username }, { $pull: { groupsJoined: jsn.groupname } })
            .catch(err => {
                console.log("Could not delete group joined (userdb) ", jsn, err.message);
            })
    }

    /**
     * delete group update collection3
     * @param {Object} jsn group data(event) to delete 
     */
    const deleteGroupEvent = function(jsn) {
        return collection3.deleteOne({ groupName: jsn })
            .catch(err => {
                console.log("Could not delete group (event)", jsn, err.message);
            })
    }

    /**
     * leave group, update collection2
     * @param {Object} jsn group data to leave
     */
    const leaveGroup = function(jsn) {
        return collection2.updateOne({ _id: jsn.groupname }, { $pull: { members: jsn.username } })
            .catch(err => {
                console.log("Could not leave group ", jsn, err.message);
            })
    }

    /**
     * Join group, update collection2
     * @param {Object} jsn group data to join
     * @returns {Object} - The group data that joined
     */
    const joinGroup = function(jsn) {
        return collection2.updateOne({ _id: jsn.groupname }, { $push: { members: jsn.username } })
            .then(group => Group.fromJSON(group))
            .catch(err => {
                console.log("Could not join group(groupdb) ", jsn, err.message);
            })
    }

    /**
     * Join group, update collection
     * @param {Object} jsn group data(username) to join
     * @returns {Object} - The user data with groupjoined
     */
    const joinUser = function(jsn) {
        return collection.updateOne({ _id: jsn.username }, { $push: { groupsJoined: jsn.groupname } })
            .then(user => Group.fromJSON(user))
            .catch(err => {
                console.log("Could not join group(userdb) ", jsn, err.message);
            })
    }

    /* ======================== Messages ================================ */

    /**
     * Adds a message to the group document
     * @param {string} groupname - The groupname to look for in the database
     * @param {Object} msg - The message object to be added to the group
     * @returns {result} The result of inserting a message in the group
     */
    const addMessage = function(groupname, msg) {
        return collection2.updateOne({ _id: groupname }, { $push: { msgs: msg } })
            .catch(err => console.log("Error adding message", err));
    }

    /**
     * Finds the group document that a message belongs to
     * @param {string} msgID - The ID of the message
     * @returns {Object} - The group that the message belongs to
     */
    const getGroupByMsgID = function(msgID) {
        return collection2.findOne({ "msgs.msgID": msgID }, { projection: { groupname: "$_id", _id: 0, tags: 1, description: 1, members: 1, adminuser: 1, msgs: 1 } })
            .catch(err => console.log("Error finding group", err));
    }

    /**
     * Deletes a message from a group
     * @param {string} msgID - The ID of the message to delete
     * @returns {result} The result of updating a group document
     */
    const deleteMessage = function(msgID) {
        return collection2.updateOne({ "msgs.msgID": msgID }, { $pull: { msgs: { msgID: msgID } } })
            .catch(err => console.log("Error deleting message", err));
    }

    /**
     * Adds a comment to a message in a group
     * @param {string} msgID - The ID of the message to which to add a comment
     * @param {Object} comment - The comment object to be added to the message
     * @returns {result} The result of updating a group document
     */
    const addComment = function(msgID, comment) {
        const updateDocument = { $push: { "msgs.$[message].comments": comment } }
        const options = { arrayFilters: [{ "message.msgID": msgID }] }

        return collection2.updateOne({ "msgs.msgID": msgID }, updateDocument, options)
            .catch(err => console.log("Error adding comment", err));
    }

    /**
     * Finds the group document that a comment belongs to
     * @param {string} commentID - the ID of the comment
     * @returns {Object} - The group that the comment belongs to
     */
    const getGroupByCommentID = function(commentID) {
        return collection2.findOne({ "msgs.comments.msgID": commentID }, { projection: { groupname: "$_id", _id: 0, tags: 1, description: 1, members: 1, adminuser: 1, msgs: 1 } })
            .catch(err => console.log("Error finding group", err));
    }

    /**
     * Deletes a comment of a message from the group document
     * @param {string} commentID - The ID of the comment to delete
     * @param {string} msgID - The ID of the message to delete from
     * @returns {result} The result of updating a group document
     */
    // Delete message from message
    const deleteComment = function(commentID, msgID) {
        // Looks for the comment to remove
        const updateDocument = { $pull: { "msgs.$[message].comments": { msgID: commentID } } }
            // Looks for the message to remove from
        const options = { arrayFilters: [{ "message.msgID": msgID }] }

        return collection2.updateOne({ "msgs.msgID": msgID }, updateDocument, options)
            .catch(err => console.log("Error deleting comment", err));
    }

    /* ======================== Media ================================ */
    /**
     * Adds media file descriptions to the group document
     * @param {string} groupname 
     * @param {Object} media 
     * @returns {result} The result of inserting media in the group
     */
    const addMedia = function(groupname, media) {
        return collection2.updateOne({ _id: groupname }, { $push: { media: media } })
            .catch(err => console.log("Error adding media", err));
    }

    /* ======================== Events ================================ */

    /**
     * get all events 
     * @returns {Array} array of events
     */
    const getAllEvents = function() {
        return collection3.find({}).project({ eventId: "$_id", _id: 0, eventName: 1, location: 1, date: 1, comments: 1, usersGoing: 1, createdBy: 1, groupName: 1 }).toArray()
            .then(events => events.map(event => Event.fromJSON(event)))
    }

    /**
     * get events by groupId
     * @param {string} groupName 
     * @returns {Array}
     */
    const getEventsByGroup = function(groupName) {
        return collection3.find({ groupName: groupName }).project({ eventId: "$_id", _id: 0, eventName: 1, location: 1, date: 1, comments: 1, usersGoing: 1, createdBy: 1, groupName: 1 }).toArray()
            .then(events => events.map(event => Event.fromJSON(event)))
    }

    /**
     * Add event from json structure
     * @param {Object} jsn 
     * @returns {number}
     */
    const addEvent = function(jsn) {
        jsn._id = jsn.eventID
        delete jsn.eventID
        return collection3.insertOne(jsn)
            .then(result => result.insertedId)
    }

    /**
     * get events by eventID
     * @param {string} eventId 
     * @returns {Event}
     */
    const getEventsById = function(eventId) {
        return collection3.findOne({ _id: eventId }, { projection: { eventId: "$_id", _id: 0, eventName: 1, location: 1, date: 1, comments: 1, usersGoing: 1, createdBy: 1, groupName: 1 } })
            // .then(events => events.map(event => Event.fromJSON(event)))
            .then(event => Event.fromJSON(event))
    }

    /**
     * Add a user to event
     * @param {Object} jsn 
     * @returns {number}
     */
    const addUserToEvent = function(jsn) {
        jsn._id = jsn.eventId;
        delete jsn.eventId
        return collection3.updateOne({ _id: jsn._id }, { $set: jsn })
            .then(result => result.modifiedCount)
    }

    /**
     * Remove event from the db
     * @param {Object} jsn 
     */
    const deleteEvent = function(jsn) {
        jsn._id = jsn.eventId;
        delete jsn.eventId
        return collection3.deleteOne({ _id: jsn._id }, { $set: jsn })
    }

    //==========================================================//


    //make the dao functions accessible from outside the module
    module.exports = {
        /**
         * Function to initialise the data access object
         * @see module:js/dao~init
         */
        init: init,
        /**
         * Function to get all users
         * @see module:js/dao~getUsers
         */
        getUsers: getUsers,
        /**
         * Function to add user
         * @see module:js/dao~addUser
         */
        addUser: addUser,
        /**
         * Function to add user by username
         * @see module:js/dao~getByUsername
         */
        getByUsername: getByUsername,
        /**
         * Function to add update user info
         * @see module:js/dao~updateUser
         */
        updateUser: updateUser,
        /**
         * Function to delete user
         * @see module:js/dao~deleteUser
         */
        deleteUser: deleteUser,

        /**
         * Function to get all groups
         * @see module:js/dao~getGroups
         */
        getGroups: getGroups,
        /**
         * Function to add new group
         * @see module:js/dao~addGroup
         */
        addGroup: addGroup,
        /**
         * Function to get group by groupname
         * @see module:js/dao~getByGroupName
         */
        getByGroupName: getByGroupName,
        /**
         * Function to get group by tag
         * @see module:js/dao~getByTags
         */
        getByTags: getByTags,
        /**
         * Function to update group info
         * @see module:js/dao~updateGroup
         */
        updateGroup: updateGroup,
        /**
         * Function to delete a group
         * @see module:js/dao~deleteGroup
         */
        deleteGroup: deleteGroup,
        /**
         * Function to remove user from group
         * @see module:js/dao~leaveGroup
         */
        leaveGroup: leaveGroup,
        /**
         * Function to add user to group
         * @see module:js/dao~joinGroup
         */
        joinGroup: joinGroup,
        /**
         * Function to add group to user list
         * @see module:js/dao~joinUser
         */
        joinUser: joinUser,
        /**
         * Function to remove group from user list
         * @see module:js/dao~deleteGroupUser
         */
        deleteGroupUser: deleteGroupUser,
        /**
         * Function to remove group from events
         * @see module:js/dao~deleteGroupEvent
         */
        deleteGroupEvent: deleteGroupEvent,
        /**
         * Function to get group by admin
         * @see module:js/dao~getByAdmin
         */
        getByAdmin: getByAdmin,

        /**
         * Function to add a message to a group document
         * @see module:js/dao~addMessage
         */
        addMessage: addMessage,
        /**
         * Function to get a group from a message ID
         * @see module:js/dao~getGroupByMsgID
         */
        getGroupByMsgID: getGroupByMsgID,
        /**
         * Function to delete a message from a group document
         * @see module:js/dao~deleteMessage
         */
        deleteMessage: deleteMessage,
        /**
         * Function to add a comment to a message in a group document
         * @see module:js/dao~addComment
         */
        addComment: addComment,
        /**
         * Function to get a group from a comment ID
         * @see module:js/dao~getGroupByCommentID
         */
        getGroupByCommentID: getGroupByCommentID,
        /**
         * Function to delete a comment from a group document
         * @see module:js/dao~deleteComment
         */
        deleteComment: deleteComment,
        /**
         * Function to add a media description to a group document
         * @see module:js/dao~addMedia
         */
        addMedia: addMedia,
        /**
         * Function to get all events
         * @see module:js/dao~getAllEvents
         */
        getAllEvents: getAllEvents,
        /**
         * Function to get events by group name
         * @see module:js/dao~getEventsByGroup
         */
        getEventsByGroup: getEventsByGroup,
        /**
         * Function to add event
         * @see module:js/dao~addEvent
         */
        addEvent: addEvent,
        /**
         * Function to get events by event id
         * @see module:js/dao~getEventsById
         */
        getEventsById: getEventsById,
        /**
         * Function to attend the event
         * @see module:js/dao~addUserToEvent
         */
        addUserToEvent: addUserToEvent,
        /**
         * Function to delete a event
         * @see module:js/dao~deleteEvent
         */
        deleteEvent: deleteEvent
    };
})();
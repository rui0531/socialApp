/**
 * Model for the community webpage 
 * Includes model for User, Group, Message, Media, Event
 * Designed for both server and client side
 * 
 * @author CS5003 Group 25
 * @module shared/model
 * @version 1.0
 *  **/

(function() {
    /**
     * Represents a User
     * Contains username, password, interests, groups joined
     */

    // create User class
    class User {
        /**
         * 
         * @param {string} username 
         * @param {string} password 
         * @param {Array} interests 
         * @param {Array} groupsJoined 
         */
        constructor(username, password, interests, groupsJoined) {
                this._username = username;
                this._password = password;
                this._interests = interests;
                this._groupsJoined = groupsJoined;
            }
            /**
             * gets the username
             * @type {string}
             * @readonly
             */
        get username() { return this._username }
            /**
             * gets the password
             * @type {string}
             * @readonly
             */
        get password() { return this._password }
            /**
             * gets the interests
             * @type {Array}
             * @readonly
             */
        get interests() { return this._interests }
            /**
             * gets the groups joined 
             * @type {Array}
             * @readonly
             */
        get groupsJoined() { return this._groupsJoined }

        /**
         * Adds an interest to existing array
         * @param {string} interest 
         */
        addInterest(interest) {
                this._interests.push(interest)
            }
            /**
             * finds index of interest to delete and removes it from existing array
             * @param {string} interest 
             */
        deleteInterest(interest) {
                let i = this._interests.indexOf(interest)
                i != -1 ? this._interests.splice(i, 1) : ""
            }
            /**
             * Adds a group to groups joined
             * @param {string} group 
             */
        addGroup(group) {
                this._groupsJoined.push(group)
            }
            /**
             * Finds index of group to remove and removes from existing array
             * @param {string} group 
             */
        deleteGroup(group) {
            let i = this._groupsJoined.indexOf(group)
            i != -1 ? this._groupsJoined.splice(i, 1) : ""
        }

        /**
         * Converts from the class representation to plain json
         * @returns {Object} Returns the json representation
         */
        toJSON() {
            let jsn = new Object();
            jsn.username = this._username;
            jsn.password = this._password;
            jsn.interests = this._interests;
            jsn.groupsJoined = this._groupsJoined;
            return jsn;
        }

        /**
         * Converts a json object into a User object
         * Validates the data 
         * @param {Object} jsn - json representation
         * @returns {User} the User converted from the json
         */
        static fromJSON(jsn) {
            //check not null
            if (jsn == null) { return "null value" } //{throw new Error("null value")}
            //validate username is string
            let isValidUsername = jsn.hasOwnProperty("username") && typeof jsn.username == "string" && jsn.username.length > 4 && jsn.username.length < 21
            if (!isValidUsername) { return "invalid username" } //{throw new Error("invalid username")}
            //validate password is string
            let isValidPassword = jsn.hasOwnProperty("password") && typeof jsn.password == "string" && jsn.password.length > 7 && jsn.password.length < 100
            if (!isValidPassword) { return "invalid password" } //{throw new Error("invalid password")}
            //validate interests is array or undefined
            let isValidInterests = Array.isArray(jsn.interests) || jsn.interests == undefined
            if (!isValidInterests) { return "invalid interests" } //{throw new Error("invalid interests")}
            //validate groups joined is array or undefined
            let isValidGroupsJoined = Array.isArray(jsn.groupsJoined) || jsn.groupsJoined == undefined
            if (!isValidGroupsJoined) { return "invalid groups joined" } //{throw new Error("invalid groups joined")}

            if (isValidUsername && isValidPassword && isValidInterests && isValidGroupsJoined) {
                let u = new User(
                    jsn.username,
                    jsn.password,
                    (jsn.interests) ? jsn.interests : new Array(),
                    (jsn.groupsJoined) ? jsn.groupsJoined : new Array());
                return u;
            }
        }
    }

    /**
     * Represents a Group
     * Contains groupname, description, tags, members, adminuser, msgs, media
     */
    // create Group class
    class Group {
        /**
         * Creates a new Group object.
         * @param {string} groupname - The unique groupname of group
         * @param {string} description - The text description of the group
         * @param {Array} tags - The tags of the group
         * @param {Array} members - The members who joined the group
         * @param {Array} adminuser - The user who created this group
         * @param {Array} msgs - The messages of this group
         * @param {Array} media - The media of this group
         */
        constructor(groupname, description, tags, members, adminuser, msgs, media) {
                this._groupname = groupname;
                this._description = description;
                this._tags = tags;
                this._members = members;
                this._adminuser = adminuser;
                this._msgs = msgs;
                this._media = media
            }
            /**
             * The groupname of this group
             * @type {string}
             * @readonly
             */
        get groupname() { return this._groupname };
        /**
         * The description of this group
         * @type {string}
         * @readonly
         */
        get description() { return this._description };
        set description(newDesc) {
                if (typeof(newDesc) === 'string' && newDesc != "") this._description = newDesc;
                else throw new Error("Invalid description");
            }
            /**
             * The description of this group
             * @type {string}
             * @readonly
             */
        get tags() { return this._tags };
        /**
         * Add tags to existing array
         * @param {string} tag 
         */
        addTag(tag) {
                this._tags.push(tag)
            }
            /**
             * The members of this group
             * @type {Array}
             * @readonly
             */
        get members() { return this._members };
        /**
         * The admin user of this group
         * @type {Array}
         * @readonly
         */
        get adminuser() { return this._adminuser };
        /**
         * The messages of this group
         * @type {Array}
         * @readonly
         */
        get messages() { return this._msgs }
            /**
             * The media of this group
             * @type {Array}
             * @readonly
             */
        get media() { return this._media }
            /**
             * Add message to existing array
             * @param {string} msg
             */
        addMessage(msg) {
                this._msgs.push(msg);
            }
            /**
             * Add path to existing array
             * @param {string} path
             */
        addMedia(path) {
                this._media.push(path);
            }
            /**
             * Converts from the class representation to plain json
             * @returns {Object} Returns the json representation
             */
            // Convert to JSON
        toJSON() {
                let group = new Object();
                group.groupname = this._groupname;
                group.description = this._description;
                group.tags = this._tags;
                group.members = this._members;
                group.adminuser = this._adminuser;
                group.msgs = this._msgs;
                group.media = this._media;
                return group;
            }
            /**
             * Converts a json object into a Group object
             * Validates the data 
             * @param {Object} jsn - json representation
             * @returns {Group} the Group converted from the json
             */
        static fromJSON(jsn) {
            if (jsn == null) { return "invalid value" }
            let isValidGroupname = jsn.hasOwnProperty("groupname") && typeof jsn.groupname == "string" && jsn.groupname.length > 4 && jsn.groupname.length < 21
            if (!isValidGroupname) { return "invalid groupname" }
            let isValidDescription = jsn.hasOwnProperty("description") && typeof jsn.description == "string"
            if (!isValidDescription) { return "invalid description" }
            let isValidTags = Array.isArray(jsn.tags) || jsn.tags == undefined
            if (!isValidTags) { return "invalid tags" }
            let isValidMembers = Array.isArray(jsn.members) || jsn.members == undefined
            if (!isValidMembers) { return "invalid members" }
            let isValidAdminuser = Array.isArray(jsn.adminuser) || jsn.adminuser == undefined
            if (!isValidAdminuser) { return "invalid adminuser" }

            if (isValidGroupname && isValidDescription && isValidTags && isValidMembers && isValidAdminuser) {
                return new Group(jsn.groupname, jsn.description, jsn.tags, jsn.members, jsn.adminuser, (jsn.msgs) ? jsn.msgs.map(m => Message.fromJSON(m)) : new Array(), (jsn.media) ? jsn.media : new Array());
            }
        }
    }

    /** Class representing a Message. Comments are represented by this class too. */
    class Message {
        /**
         * Creates a new Message object.
         * @param {string} msgID - The unique ID of the message
         * @param {string} text - The text content of the message
         * @param {string} author - The user who created the message
         * @param {Date} date - The creation date of the message
         * @param {Array} comments - The comments attached to this message
         */
        constructor(msgID, text, author, date, comments) {
            if (typeof(msgID) == 'undefined' || typeof(text) == 'undefined' ||
                typeof(author) == 'undefined' || typeof(date) == 'undefined' || typeof(comments) == 'undefined') {
                throw new Error("Missing message information");
            }
            this._msgID = msgID;
            this._text = text;
            this._author = author;
            this._date = date;
            this._comments = comments;
        }

        /**
         * The ID of this message
         * @type {string}
         * @readonly
         */
        get msgID() { return this._msgID; }

        /**
         * The text content of this message
         * @type {string}
         */
        get text() { return this._text; }
        set text(t) { this._text = t; }

        /**
         * The user who created this message
         * @type {string}
         * @readonly
         */
        get author() { return this._author; }

        /**
         * The creation date of this message
         * @type {Date}
         * @readonly
         */
        get date() { return this._date; }

        /**
         * The comments attached to this message
         * @type {Array} 
         */
        get comments() { return this._comments; }

        /**
         * Converts from Message object properties to JSON object
         * @returns {Object} the JSON representation
         */
        toJSON() {
            let messages = {};
            messages.msgID = this._msgID;
            messages.text = this._text;
            messages.author = this._author;
            messages.date = this._date;
            messages.comments = this._comments;
            return messages;
        }

        // Convert to string
        toJSONstring() {
            return JSON.stringify(this.toJSON());
        }

        /**
         * Converts a JSON object into a Message object
         * @param {Object} jsn - the JSON object to initialise from
         * @returns {Message} the Message object converted from JSON
         */
        // Create message from JSON
        static fromJSON(jsn) {
            if (jsn == null) { throw new Error("null value"); }
            if (!jsn.hasOwnProperty("msgID")) { throw new Error("Missing message ID") }
            if (!jsn.hasOwnProperty("text") || jsn.text.length === 0) { throw new Error("Missing message text") }
            if (!jsn.hasOwnProperty("author") || !(typeof jsn.author == "string")) { throw new Error("Invalid author"); }

            return new Message(jsn.msgID, jsn.text, jsn.author, (jsn.date) ? jsn.date : new Date(), (jsn.comments) ? jsn.comments : new Array());
        }

        // build from string
        static fromJSONString(str) {
            return Message.fromJSON(JSON.parse(str));
        }
    }

    /** Class representing a Media file. */
    class Media {
        /**
         * Creates a new Media object.
         * @param {string} title - The title of the media file
         * @param {string} description - A description of the media file
         * @param {string} user - The user who uploaded the file
         * @param {string} path - The path where the file is located on the server
         */
        constructor(title, description, user, path) {
            if (typeof(title) == 'undefined' || typeof(description) == 'undefined' ||
                typeof(user) == 'undefined' || typeof(path) == 'undefined') {
                throw new Error("Missing media information");
            }
            this._title = title;
            this._description = description;
            this._user = user;
            this._path = path;
        }

        /**
         * The title of this media file
         * @type {string}
         */
        get title() { return this._title; }

        /**
         * The description of this media file
         * @type {string}
         */
        get description() { return this._description; }

        /**
         * The user who uploaded this media file
         * @type {string}
         */
        get user() { return this._user; }

        /**
         * The path where this file is located on the server
         * @type {string}
         */
        get path() { return this._path; }

        /**
         * Converts from Media object properties to JSON object
         * @returns {Object} the JSON representation
         */
        toJSON() {
            let media = {};
            media.title = this._title;
            media.description = this._description;
            media.user = this._user;
            media.path = this._path;
            return media;
        }

        // Convert to string
        toJSONstring() {
            return JSON.stringify(this.toJSON());
        }

        /**
         * Converts a JSON object into a Media object
         * @param {Object} jsn - the JSON object to initialise from
         * @returns {Media} the Media object converted from JSON
         */
        static fromJSON(jsn) {
            if (jsn == null) { throw new Error("null value"); }
            if (!jsn.hasOwnProperty("path")) { throw new Error("Missing file path") }
            if (!jsn.hasOwnProperty("title") || jsn.title.length === 0) { throw new Error("Please include a title.") }
            if (!jsn.hasOwnProperty("description") || jsn.description.length === 0) { throw new Error("Please include a short description."); }
            if (!jsn.hasOwnProperty("user") || !(typeof jsn.user == "string")) { throw new Error("Invalid upload user"); }

            return new Media(jsn.title, jsn.description, jsn.user, jsn.path);
        }

        // build from string
        static fromJSONString(str) {
            return Media.fromJSON(JSON.parse(str));
        }
    }

    /** Class representing an Event */
    class Event {
        /**
         * creates a new event object
         * @param {string} eventId 
         * @param {string} eventName 
         * @param {string} location 
         * @param {Date} date 
         * @param {string} comments 
         * @param {Array} usersGoing 
         * @param {string} createdBy 
         * @param {string} groupName 
         */
        constructor(eventId, eventName, location, date = new Date(), comments, usersGoing, createdBy, groupName) {
            this._eventId = eventId;
            this._eventName = eventName;
            this._location = location;
            this._date = date;
            this._comments = comments;
            this._usersGoing = usersGoing;
            this._createdBy = createdBy;
            this._groupName = groupName;
        }

        /**
         * gets the event id
         * @type {string}
         */
        get eventId() { return this._eventId };
        /**
         * get the event name 
         * @type {string}
         */
        get eventName() { return this._eventName };
        /**
         * gets the location
         * @type {string}
         */
        get location() { return this.location };
        /**
         * gets the date of the event
         * @type {Date}
         */
        get date() { return this.date };
        /**
         * gets the comments about the event
         * @type {string}
         */
        get comments() { return this._comments };
        /**
         * gets the users attending the event
         * @type {Array}
         */
        get usersGoing() { return this._usersGoing };
        /**
         * gets the user who created the event
         * @type {string}
         */
        get createdBy() { return this._createdBy };
        /**
         * gets the group the event is part of
         * @type {string}
         */
        get groupName() { return this._groupName };

        /**
         * adds user to the event
         * @type {string}
         */
        addUser(user) {
            this._usersGoing.push(user)
        }

        /**
         * Converts from the Event representation to plain json
         * @returns {Object} Returns the json representation
         */
        toJSON() {
            let jsn = new Object();
            jsn.eventId = this._eventId;
            jsn.eventName = this._eventName;
            jsn.location = this._location;
            jsn.date = this._date;
            jsn.comments = this._comments;
            jsn.usersGoing = this._usersGoing;
            jsn.createdBy = this._createdBy;
            jsn.groupName = this._groupName;

            return jsn;
        }

        /**
         * Converts a json object into an Event object
         * Validates the data 
         * @param {Object} jsn - json representation
         * @returns {Event} the Event converted from the json
         */
        static fromJSON(jsn) {
            if (jsn == null) { throw new Error("null value"); }
            let isValideventId = jsn.hasOwnProperty("eventId")
            if (!isValideventId) { return "Missing event ID" }
            let isValideventName = jsn.hasOwnProperty("eventName") && typeof jsn.eventName == "string"
            if (!isValideventName) { return "Invalid event name"; }
            let isValidLocation = jsn.hasOwnProperty("location") && typeof jsn.location == "string"
            if (!isValidLocation) { return "Invalid group description"; }
            let isValidDate = jsn.hasOwnProperty("date")
            if (!isValidDate) { return "Missing date information"; }
            let isValidComments = jsn.hasOwnProperty("comments") && typeof jsn.comments == "string"
            if (!isValidComments) { return "Invalid comments"; }
            let isValiduserGoing = jsn.hasOwnProperty("usersGoing") && Array.isArray(jsn.usersGoing)
            if (!isValiduserGoing) { return "Invalid userGoing"; }
            let isValidcreatedBy = jsn.hasOwnProperty("createdBy") && typeof jsn.createdBy == "string"
            if (!isValidcreatedBy) { return "Invalid created user"; }
            let isValidgroupName = jsn.hasOwnProperty("groupName") && typeof jsn.groupName == "string"
            if (!isValidgroupName) { return "Invalid groupName"; }


            return new Event(jsn.eventId, jsn.eventName, jsn.location, jsn.date, jsn.comments, jsn.usersGoing, jsn.createdBy, jsn.groupName);
        }

    }

    // Export all classes
    var moduleExports = {
        User: User,
        Group: Group,
        Message: Message,
        Media: Media,
        Event: Event
    };

    /* Check if we are running in a browser. If so, attach the exported closure to the main window.
    Otherwise, use the node.js module exporting functionality. This way we can use this module both 
    in the browser and on the server */
    if (typeof __dirname == 'undefined')
        window.exports = moduleExports;
    else
        module.exports = moduleExports
}());
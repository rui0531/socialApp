/**
 * API for the communities webpage
 * Includes routes to link the client with the dao
 * @version 1.0
 * @author CS5003 Group 25
 * @module js/api 
 * @see module:js/dao
 * @see module:shared/model
 */

(function() {
    // add constants for each class created in the model
    const dao = require('./dao.js');
    const media = require('./media');
    const User = require('../shared/model.js').User;
    const Group = require('../shared/model.js').Group;
    const Message = require('../shared/model.js').Message;
    const Media = require('../shared/model.js').Media;
    const Event = require('../shared/model.js').Event;

    //everything needed for the express app 
    const express = require('express');
    const bodyParser = require('body-parser');
    const uuid = require('uuid');
    const multer = require('multer');
    const path = require('path');
    const bcrypt = require('bcrypt');

    const app = express();
    const API_PORT = 3000;
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true })) //optional but useful for url encoded data

    app.use(express.static('content'));
    app.use(express.static('shared'));

    /*====================================== USERS ======================================*/
    /**
     * Get all users from DB
     * @param {Object} req the client request
     * @param {Object} res the server response
     */
    const getUserRoute = function(req, res) {
        dao.getUsers()
            .then(users => {
                res.json(users)
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: "Could not find users" });
                console.log("Could not find users", err);
            })
    }

    /**
     * Get specific user from DB
     * @param {Object} req the client request
     * @param {Object} res the server response
     */
    const getByUsernameRoute = function(req, res) {
        let username = req.params.username
        dao.getByUsername(username)
            .then(user => {
                res.json(user)
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: "Could not find users" });
                console.log("Could not find user", err);
            })
    }

    /**
     * Add a user to the DB
     * @param {Object} req the client request include user info - username, password, interests, groups joined
     * @param {Object} res the server response
     */
    const addUserRoute = function(req, res) {
        let username = req.body.username
        let password = req.body.password
        let interests = req.body.interests
        let groupsJoined = req.body.groupsJoined


        let user = { username: username, password: password, interests: interests, groupsJoined: groupsJoined }
            //validates info
        if (typeof User.fromJSON(user) == "string") {
            res.status(400).json({ msg: User.fromJSON(user), err: "Error" });
        } else {

            //check if username alreay exists
            password = bcrypt.hashSync(password, 10);
            let user = { username: username, password: password, interests: interests, groupsJoined: groupsJoined }

            dao.getByUsername(username)
                .then(userResponse => {
                    if (userResponse != "null value") {
                        console.log("api user exists", user)
                        res.status(400).json({ msg: "Username already exists" })
                    } else {
                        console.log("api catch username doesnt exist")
                            //add user to DB as username doesnt exist
                        dao.addUser(user)
                            .then(id => res.json({ msg: "User added", id: id }))
                            .catch(err => {
                                let msg = "Could not add user"
                                res.status(400).json({ msg: msg, err: "Error" });
                                console.log(msg, err);
                            })
                    }
                })
                .catch(err => {
                    let msg = "Error getting user by username"
                    res.status(400).json({ msg: msg, err: "Error" });
                    console.log(msg, err);
                })
        }
    }

    /**
     * add interests to existing user
     * @param {Object} req the client request include user info - username,interests
     * @param {Object} res the server response
     */
    const addInterestRoute = function(req, res) {
        let username = req.params.username
        let interests = req.body.interests
            //let groupsJoined = req.body.groupsJoined
        if (Array.isArray(interests)) {
            //get current user info
            dao.getByUsername(username)
                .then(user => {
                    //add each interest to the User object
                    for (i of interests) {
                        user.addInterest(i)
                    }
                    //update the database with new user info
                    dao.updateUser(user.toJSON())
                        .then(response => {
                            console.log("number modified:", response)
                            res.status(200).json({ msg: "Added interests successfully", username: username })
                        })
                        .catch(err => res.status(400).json({ msg: "Could not update user", username: username }))
                })
                .catch(err => res.status(400).json({ msg: "Could not find user with username:", username: username }))
        } else {
            res.status(400).json({ msg: "Invalid interests format", username: username })
        }
    }

    /**
     * delete interests from existing user
     * @param {Object} req the client request include user info - username,interests
     * @param {Object} res the server response
     */
    const deleteInterestRoute = function(req, res) {
        let username = req.params.username
        let interests = req.body.interests

        if (Array.isArray(interests)) {
            //get current user info
            dao.getByUsername(username)
                .then(user => {
                    //delete each interest from User object
                    for (i of interests) {
                        user.deleteInterest(i)
                    }
                    //update the DB with new user info
                    dao.updateUser(user.toJSON())
                        .then(response => {
                            console.log("number modified:", response)
                            res.status(200).json({ msg: "Deleted interests successfully", username: username })
                        })
                        .catch(err => res.status(400).json({ msg: "Could not update user", username: username }))
                })
                .catch(err => res.status(400).json({ msg: "Could not find user with username:", username: username }))
        } else {
            res.status(400).json({ msg: "Invalid interests format", username: username })
        }
    }

    /**
     * Comparing the password with hashing
     * @param {Object} req the client request include user info - username, password
     * @param {Object} res the server response
     */

    const hashingpassword = function(req, res) {
        let username = req.params.username
        let password = req.body.password
        dao.getByUsername(username)
            .then(user => {
                if (bcrypt.compareSync(password, user.password)) {
                    res.json({ msg: "successful" })
                } else {
                    res.json({ msg: "it is not matched" })

                }
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: "Could not find users" });
                console.log("Could not find user", err);
            })

    }





    /**
     * add group id to users groups joined - IS THIS USED?
     * @param {Object} req the client request include user info - username,group name
     * @param {Object} res the server response
     */
    // const addGroupUserRoute = function(req, res) {
    //     let username = req.params.username
    //     let groupId = req.body.groupId
    //         //TO DO: validate groupid exists
    //         //get current user info
    //     dao.getByUsername(username)
    //         .then(user => {
    //             user.addGroup(groupId)
    //             dao.updateUser(user.toJSON())
    //                 .then(response => {
    //                     console.log("number modified:", response)
    //                     res.status(200).json({ msg: "Added group successfully", username: username })
    //                 })
    //                 .catch(err => res.status(400).json({ msg: "Could not update user", username: username }))
    //         })
    //         .catch(err => res.status(400).json({ msg: "Could not find user with username:", username: username }))
    // }

    /**
     * delete group id from existing users groups joined - IS THIS USED?
     * @param {Object} req the client request include user info - username,group name
     * @param {Object} res the server response
     */
    // const deleteGroupUserRoute = function(req, res) {
    //     let username = req.params.username
    //     let groupId = req.body.groupId
    //         //get current user info
    //     dao.getByUsername(username)
    //         .then(user => {
    //             user.deleteGroup(groupId)
    //             dao.updateUser(user.toJSON())
    //                 .then(response => {
    //                     console.log("number modified:", response)
    //                     res.status(200).json({ msg: "Deleted group successfully", username: username })
    //                 })
    //                 .catch(err => res.status(400).json({ msg: "Could not update user", username: username }))
    //         })
    //         .catch(err => res.status(400).json({ msg: "Could not find user with username:", username: username }))
    // }



    /**
     * delete user from DB (having already checked the password)
     * @param {Object} req the client request include user info - username
     * @param {Object} res the server response
     */
    const deleteUserRoute = function(req, res) {
        let username = req.params.username

        dao.deleteUser(username) //delete user
            .then(response => {
                if (response == 1) { //number of documents deleted is returned
                    res.status(200).json({ success: true, msg: "delete user", username: username })
                } else {
                    res.status(400).json({ success: false, msg: "Error not deleted", username: username })
                }
            })
            .catch(err => res.status(400).json({ success: false, msg: "Could not delete", username: username }))
    }

    /*====================================== GROUPS ======================================*/
    /**
     * Get all groups from DB
     * @param {Object} req the client request
     * @param {Object} res the server response
     */
    const getGroupRoute = function(req, res) {
        dao.getGroups()
            .then(groups => {
                res.json(groups)
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: "Ccould not find groups" });
                console.log("Could not find groups", err);
            })
    }

    /**
     * Get group by name from DB
     * @param {Object} req the client request-groupname
     * @param {Object} res the server response
     */
    const getByGroupnameRoute = function(req, res) {
        let groupname = req.params.groupname;
        dao.getByGroupName(groupname)
            .then(group => {
                res.json(group)
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: `Could not find group by groupname ${groupname}` });
                console.log("Could not find group by groupname", err);
            })
    }

    /**
     * Get group by tags from DB
     * @param {Object} req the client request-tag
     * @param {Object} res the server response
     */
    const getByTagRoute = function(req, res) {
        let tag = req.params.tag;
        dao.getByTags(tag)
            .then(group => {
                res.json(group)
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: `Could not find group by tag ${tag}` });
                console.log("Could not find group by tags", err);
            })
    }

    /**
     * Get group by adminuser from DB
     * @param {Object} req the client request-adminuser
     * @param {Object} res the server response
     */
    const getByAdminRoute = function(req, res) {
        let adminuser = req.params.admin;
        dao.getByAdmin(adminuser)
            .then(group => {
                res.json(group)
            })
            .catch(err => {
                res.status(400).json({ status: "error", msg: `Could not find group by admin ${adminuser}` });
                console.log("Could not find group by admin", err);
            })
    }

    /**
     * Add a group to the DB
     * @param {Object} req the client request include group info - groupname, description, adminuser
     * @param {Object} res the server response
     */
    const addGroupRoute = function(req, res) {
        let groupname = req.body.groupname
        let description = req.body.description
        let tags = req.body.tags
        console.log(tags)
        let adminuser = req.body.adminuser
        let user = { username: adminuser[0], groupname: groupname }
        let group = { groupname: groupname, description: description, tags: tags, members: adminuser, adminuser: adminuser }
        if (groupname.length > 4 && groupname.length < 21) {
            dao.getByGroupName(groupname)
                .then(response => {
                    if (response == "invalid value") {
                        dao.addGroup(group)
                        dao.joinUser(user)
                        res.status(200).json({ msg: "Created group successfully", groupname: `${groupname}` })
                    } else {
                        let msg = "Please rename the group (already exists)"
                        res.status(400).json({ msg: msg, err: "Error" });
                    }
                })
        } else {
            let msg = "Please rename the group (between 4 and 21 characters)"
            res.status(400).json({ msg: msg, err: "Error" });
        }
    }

    /**
     * Update info(desc/tags) to existing group
     * @param {Object} req the client request include group info - groupname, description, tags
     * @param {Object} res the server response
     */
    const updateGroupRoute = function(req, res) {
        let groupname = req.params.groupname
            //tags need to be string, otherwise cant be pushed successfully
        let tags = req.body.tags
        dao.getByGroupName(groupname)
            .then(group => {
                if (tags) {
                    group.addTag(tags)
                }
                dao.updateGroup(group.toJSON())
                    .then(response => {
                        console.log("update group", response)
                        res.status(200).json({ msg: "Updated group successfully", groupname: groupname })
                    })
                    .catch(err => res.status(400).json({ msg: "Could not update group", groupname: groupname }))
            })
    }

    /**
     * Delete the group(only admin user can delete)
     * @param {Object} req the client request include group info - groupname, username
     * @param {Object} res the server response
     */
    const deleteGroupRoute = function(req, res) {
        let groupname = req.body.groupname
        let username = req.body.username
        let info = { username: username, groupname: groupname }
            //check groupname
        dao.getByGroupName(groupname)
            .then(response => {
                //only admin can delete group
                if (response.adminuser[0] == username) {
                    dao.deleteGroup(info)
                    dao.deleteGroupUser(info)
                    dao.deleteGroupEvent(groupname)
                    res.status(200).json({ msg: "Deleted successfully" })
                } else {
                    let msg = "Only admin can delete group"
                    res.status(400).json({ msg: msg, err: "Error" });
                }
            })
            .catch(err => {
                let msg = "Could not delete group"
                res.status(400).json({ msg: msg, err: "Error" });
            })
    }

    /**
     * Leave the group
     * @param {Object} req the client request include group info - groupname, username
     * @param {Object} res the server response
     */
    const leaveGroupRoute = function(req, res) {
        let groupname = req.body.groupname
        let username = req.body.username
        dao.getByGroupName(groupname)
            .then(group => {
                if (group == "invalid value") {
                    let msg = "Cannot leave group. Group does not exist"
                    res.status(400).json({ msg: msg, err: "Error" });
                } else {
                    for (i of group.members) {
                        if ((i == username) && (username != group.adminuser[0])) {
                            console.log(i)
                                //update group and user db
                            dao.leaveGroup(req.body)
                            dao.deleteGroupUser(req.body)
                            res.status(200).json({ "msg": "Leave successfully" })
                        }
                    }
                }

            })
            .catch(err => {
                let msg = "Could not leave group. Group does not exist"
                res.status(400).json({ msg: msg, err: "Error" });
            })
    }

    /**
     * Join Group
     * @param {Object} req the client request include group info - groupname, username
     * @param {Object} res the server response
     */
    const joinGroupRoute = function(req, res) {
        let groupname = req.body.groupname
        let username = req.body.username
            //check groupname from groupdb
        dao.getByGroupName(groupname)
            .then(group => {
                //console.log(group)
                if (group != "invalid value") {
                    //check username from userdb
                    dao.getByUsername(username)
                        .then(user => {
                            //console.log(user)
                            if (user != "null value") {
                                dao.joinGroup(req.body)
                                dao.joinUser(req.body)
                                res.status(200).json({ msg: "Joined group successfully", groupname: groupname })
                            } else {
                                console.log("nod")
                                let msg = "Could not find such user"
                                res.status(400).json({ msg: msg, err: "Error" });
                            }
                        })
                } else {
                    let msg = "Could not join group that not exist"
                    res.status(400).json({ msg: msg, err: "Error" });
                }
            })
            .catch(err => {
                let msg = "Could not join group that not exist"
                res.status(400).json({ msg: msg, err: "Error" });
            })
    }

    /*====================================== Messages ======================================*/

    /**
     * Gets a group from DB and sends its messages
     * @param {Object} req - The client request
     * @param {Object} res - The server response 
     */
    const getGroupMessages = function(req, res) {
        let group = req.params.GROUP;
        dao.getByGroupName(group)
            .then(group => res.json(group.messages))
            .catch(err => {
                res.status(400).json({ status: "error400", msg: "Could not find group" });
                console.log("Could not find group", err)
            });
    };

    /**
     * Adds a new message to the group
     * @param {Object} req - The client request includes the groupname, message text, author user
     * @param {Object} res - The server response  
     */
    const addGroupMessage = function(req, res) {
        let grp = req.params.GROUP;
        let text = req.body.text;
        let author = req.body.author;
        let msgID = uuid.v4(); // Creates unique message ID

        let msg = { msgID: msgID, text: text, author: author, date: new Date(), comments: new Array() };

        // Checks if object is a valid Message
        try {
            Message.fromJSON(msg);
            dao.getByGroupName(grp)
                .then(group => {
                    dao.addMessage(group.groupname, msg)
                        .then(response => {
                            console.log("added msg", msg);
                            res.status(200).json({ msg: "Message Added.", id: `${msgID}` })
                        })
                })
                .catch(err => {
                    res.status(400).json({ status: "error400", msg: "Error adding message" });
                    console.log("Error adding message", err);
                })
        } catch (err) {
            console.log("Invalid message:", err.message);
            res.status(400).json({ msg: err.message });
        }
    };

    /**
     * Deletes a message from a group
     * @param {Object} req - The client request includes the groupname, message ID and user requesting delete
     * @param {Object} res - The server response
     */
    const deleteGroupMessage = function(req, res) {
        let grp = req.params.GROUP;
        let msgID = req.body.msgID;
        let user = req.body.user;

        dao.getGroupByMsgID(msgID)
            .then(group => {
                if (group == null) {
                    res.status(400).json({ msg: "Message does not exist." });
                    throw new Error("Message does not exist");
                }
                let msgs = group.msgs;
                let index = msgs.findIndex(msg => msg.msgID === msgID);

                // Checks if the user matches the author
                if (group.groupname === grp && msgs[index].author === user) {
                    dao.deleteMessage(msgID)
                        .then(response => {
                            console.log("deleted message", msgID);
                            res.status(200).json({ msg: "Message Deleted." })
                        })
                        .catch(err => {
                            res.status(400).json({ msg: "Error deleting message." });
                            console.log("Error deleting msg", err);
                        })
                } else {
                    res.status(400).json({ msg: "Only the author can delete the message." })
                }
            })
            .catch(err => {
                res.status(400).json({ msg: "Error finding mesage." });
                console.log("Error finding message", err);
            })
    };

    /**
     * Adds a new comment to a message
     * @param {Object} req - The client request includes the message ID, message text, author user
     * @param {Object} res - The server response
     */
    const addGroupComment = function(req, res) {
        let msgID = req.params.MSGID;
        let text = req.body.text;
        let author = req.body.author;
        let commentID = uuid.v4();

        let comment = { msgID: commentID, text: text, author: author, date: new Date(), comments: new Array() };

        // Checks if comment is valid Message object
        try {
            Message.fromJSON(comment);
            dao.addComment(msgID, comment)
                .then(response => {
                    console.log("Added comment", comment);
                    res.status(200).json({ msg: "Comment Added.", id: `${commentID}` })
                })
                .catch(err => {
                    res.status(400).json({ msg: "Error adding comment." });
                    console.log("Error adding comment", err);
                })
        } catch (err) {
            console.log("Invalid comment:", err.message);
            res.status(400).json({ msg: err.message })
        }
    };

    /**
     * Deletes a comment from a message
     * @param {Object} req - The client request includes the message ID, commentID, and user requesting delete
     * @param {Object} res - The server response
     */
    const deleteGroupComment = function(req, res) {
        let msgID = req.params.MSGID;
        let commentID = req.body.commentID;
        let user = req.body.user;

        dao.getGroupByCommentID(commentID)
            .then(group => {
                if (group == null) {
                    res.status(400).json({ msg: "Comment does not exist." })
                    throw new Error("Comment does not exist");
                }
                let msgs = group.msgs;
                let index = msgs.findIndex(msg => msg.msgID === msgID);
                let comments = group.msgs[index].comments;
                let cIndex = comments.findIndex(cmt => cmt.msgID === commentID)

                // Checks that the user is the same as the author
                if (comments[cIndex].author === user) {
                    dao.deleteComment(commentID, msgID)
                        .then(response => {
                            console.log("deleted comment", commentID);
                            res.status(200).json({ msg: "Comment deleted." });
                        })
                        .catch(err => {
                            res.status(400).json({ msg: "Error deleting comment." });
                            console.log("Error deleting comment", err);
                        })
                } else {
                    res.status(400).json({ msg: "Only the author can delete the message." })
                }
            })
            .catch(err => {
                res.status(400).json({ msg: "Error finding comment." });
                console.log("Error finding comment", err);
            })
    };

    /*====================================== Media ======================================*/

    /**
     * Sets storage location for uploads and renames files
     */
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "content/uploads/");
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
        }
    });

    /**
     * Calls Multer to handle the file upload
     */
    const upload = multer({ storage: storage, fileFilter: media.fileFilter }).single("uploadedMedia");

    /**
     * Validates and handles errors of the upload
     * @param {Object} req - the client request includes the uploaded multipart/form-data
     * @param {Object} res - the server response
     * @param {Object} next - passes control to the next function
     */
    const validate = function(req, res, next) {
        upload(req, res, function(err) {
            if (req.fileValidationError) {
                return res.status(400).json({ msg: `${req.fileValidationError}` });
            } else if (!req.file) {
                return res.status(400).json({ msg: "Please select media to upload" });
            } else if (err instanceof multer.MulterError) {
                return res.status(400).json({ msg: `${err}` });
            } else if (err) {
                return res.status(400).json({ msg: `${err}` });
            }

            // If no errors, send file to next middleware
            next();
        })
    }

    /**
     * Adds new file information to group
     * @param {Object} req - the request includes the parsed form data and file
     * @param {Object} res - the server response
     */
    const saveFiles = function(req, res) {
        let group = req.params.GROUP;
        let title = req.body.title;
        let desc = req.body.description;
        let user = req.body.user;
        console.log("Received file from Multer:", req.file);

        // Formats the path to be saved in the database
        let path = req.file.path.replace(/\\/g, "/").substring(8);

        let media = { title: title, description: desc, user: user, path: path };

        // Checks that the information is a valid Media object
        try {
            Media.fromJSON(media);
            // Add file to the database
            dao.getByGroupName(group)
                .then(group => {
                    dao.addMedia(group.groupname, media)
                        .then(response => {
                            console.log("added file", media);
                            return res.status(200).json({ msg: "File Added.", id: `${path}` });
                        })
                })
                .catch(err => {
                    res.status(400).json({ msg: "Error adding file." });
                    console.log("Error adding file", err);
                })
        } catch (err) {
            console.log("Invalid media:", err.message);
            res.status(400).json({ msg: err.message });
        }
    };

    /*====================================== Events ======================================*/
    /**
     * Gets all events from the selected group
     * @param {Object} req - The client request
     * @param {Object} res - The server response 
     */
    const getAllEventsRoute = function(req, res) {
            dao.getAllEvents()
                .then(events => {
                    res.json(events)
                })
                .catch(err => {
                    res.status(400).json({ status: "error", msg: "Could not find events" });
                    console.log("Could not find events", err);
                })
        }
        /**
         * get event by eventId
         * @param {Object} req - The client request
         * @param {Object} res - The server response 
         */
    const getEventByIdRoute = function(req, res) {
            let eventId = req.params.eventId
            dao.getEventsById(eventId)
                .then(event => {
                    res.json(event)

                })
        }
        /**
         * get events by groupName
         * @param {Object} req - The client request
         * @param {Object} res - The server response 
         */
    const getEventByGroupRoute = function(req, res) {
            let groupName = req.params.groupName
            dao.getEventsByGroup(groupName)
                .then(events => {
                    res.json(events)
                })
                .catch(err => {
                    res.status(400).json({ status: "error", msg: "Could not find events" });
                    console.log("Could not find events", err);
                })
        }
        /**
         * Add a new event to the DB
         * @param {Object} req the client request include event info - eventName, location, date, comments, usersGoing, createdBy, groupName
         * @param {Object} res the server response
         */
    const addEventRoute = function(req, res) {
            let eventID = uuid.v4()
            let eventName = req.body.eventName
            let location = req.body.location
            let date = req.body.date
            let comments = req.body.comments
            let usersGoing = req.body.usersGoing
            let createdBy = req.body.createdBy
                // let groupName = req.params.groupName
            let groupName = req.body.groupName


            let event = {
                eventID: eventID,
                eventName: eventName,
                location: location,
                date: date,
                comments: comments,
                usersGoing: usersGoing,
                createdBy: createdBy,
                groupName: groupName
            }
            dao.addEvent(event)
                .then(id => res.json({ msg: "Event created", id: id }))
                .catch(err => {
                    let msg = "Could not create group."
                    res.status(400).json({ msg: msg, err: "Error" });
                    console.log(msg, err);
                })
        }
        /**
         * Attend an event
         * @param {Object} req the client request include event info - eventId, user
         * @param {Object} res the server response
         */
    const attendEventRoute = function(req, res) {
            let eventId = req.params.eventId
            let user = req.body.user

            dao.getEventsById(eventId)
                .then(event => {
                    event.addUser(user)
                        // console.log(event.usersGoing)
                        // res.json(event.usersGoing)
                    dao.addUserToEvent(event.toJSON())
                        .then(response => {
                            console.log("number modified:", response)
                            res.status(200).json({ msg: "Added event successsfully" })
                        })
                        .catch(err => res.status(400).json({ msg: "Could not update group" }))
                })
        }
        /**
         * Deletes an event from the database
         * @param {Object} req - The client request includes the eventId
         * @param {Object} res - The server response
         */
    const deleteEvent = function(req, res) {
        let eventId = req.body.eventId
        dao.getEventsById(eventId)
            .then(event => {
                dao.deleteEvent(event.toJSON())
                    .then(respose => {
                        res.status(200).json({ "msg": "Delete successfully" })
                    })
            })
    }

    // Set up all the routes

    // User routes
    app.get("/users", getUserRoute)
    app.get("/users/:username", getByUsernameRoute)
    app.post("/users", addUserRoute)
    app.post("/userAddInterests/:username", addInterestRoute)
    app.post("/userDeleteInterests/:username", deleteInterestRoute)
    app.get("/userDelete/:username", deleteUserRoute)
    app.post("/checkinghash/:username", hashingpassword)

    // Group routes
    app.get("/groups", getGroupRoute)
    app.get("/groups/:groupname", getByGroupnameRoute)
    app.get("/tags/:tag", getByTagRoute)
    app.get("/admin/:admin", getByAdminRoute)
    app.post("/groups", addGroupRoute)
    app.post("/groups/:groupname", updateGroupRoute)
    app.post("/deleteGroup/", deleteGroupRoute)
    app.post("/leaveGroup/", leaveGroupRoute)
    app.post("/joinGroup/", joinGroupRoute)

    // Messages and Media routes
    app.get("/messages/:GROUP", getGroupMessages);
    app.post(`/messages/:GROUP`, addGroupMessage);
    app.post(`/deleteMessage/:GROUP`, deleteGroupMessage);
    app.post(`/comments/:MSGID`, addGroupComment);
    app.post(`/deleteComment/:MSGID`, deleteGroupComment);
    app.post("/uploadMedia/:GROUP", validate, saveFiles);

    //Events
    app.get("/getAllEvents", getAllEventsRoute)
    app.get("/event/:eventId", getEventByIdRoute)
    app.get("/events/:groupName", getEventByGroupRoute)
    app.post("/addEvent", addEventRoute)
    app.post("/addUserToEv/:eventId", attendEventRoute)
    app.post("/deleteEvent/", deleteEvent)

    // ==========================================================================================================

    //set up & export a function to run the app
    function run() {
        // intitialise the database 
        return dao.init()
            //only start listening once the database initialisation has finished successfully
            .then(() => app.listen(API_PORT, () => console.log(`Listening on localhost: ${API_PORT}`)))
            .catch(err => console.log(`Could not start server`, err))
    }

    module.exports = { run: run };
})();
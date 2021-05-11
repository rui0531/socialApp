/**
 * Client side functions which call the api routes 
 * @author CS5003 Group 25
 * @version 1.0
 * @module content/client
 */


(function() {
    console.log("client-side.js")

    /**
     * Funtion retrives all users from DB and logs to the console
     */
    const getUsers = function() {
        fetch("/users")
            .then(res => res.json())
            .then(users => {
                console.log(users);
                //console.log(window.exports.User.fromJSON({username:"hi", password:["hi"]}))
            })
            .catch(err => {
                console.log("Could not fetch users", err);
            })
    }

    /**
     * Function retrives specific user from DB
     * @param {string} username 
     * @returns {Object} the user information from the DB
     */
    const getUserByUsername = async function(username) {
        let returnuser
        await fetch(`/users/${username}`)
            .then(res => res.json())
            .then(user => {
                returnuser = user
            })
            .catch(err => {
                console.log("Could not fetch users", err);
            })
        return returnuser
    }

    /**
     * add new user to DB
     * @param {string} username 
     * @param {string} password 
     * @param {Array} interests 
     * @param {Array} groupsJoined 
     */
    const addUser = async function(username, password, interests, groupsJoined) {
        let msg
        await fetch("/users", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, interests, groupsJoined })
            })
            .then(res => res.json())
            .then(dta => {
                console.log(dta);
                msg = dta.msg;
            })
            .catch(err => console.log(err))
        return msg
    }

    /**
     * add interests to existing user
     * @param {string} username 
     * @param {Array} interests 
     */
    const addInterests = function(username, interests) {
        //interests should be in an array
        fetch(`userAddInterests/${username}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interests })
            })
            .then(res => res.json())
            .then(dta => console.log(dta.msg, dta.username))
            .catch(err => console.log(err))
    }

    /**
     * Delete interests to existing user
     * @param {string} username 
     * @param {Array} interests 
     */
    const deleteInterests = function(username, interests) {
        //interests should be in an array
        fetch(`userDeleteInterests/${username}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interests })
            })
            .then(res => res.json())
            .then(dta => console.log(dta.msg, dta.username))
            .catch(err => console.log(err))
    }

    /**
     * add group joined to existing user
     * @param {string} username 
     * @param {string} groupId 
     */
    // const addGroupJoined = function(username, groupId) {
    //     //groupid should be in an string
    //     fetch(`userAddGroupJoined/${username}`, {
    //             method: "POST",
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ groupId })
    //         })
    //         .then(res => res.json())
    //         .then(dta => console.log(dta.msg, dta.username))
    //         .catch(err => console.log(err))
    // }

    /**
     *  delete group joined from existing user
     * @param {string} username 
     * @param {string} groupId 
     */
    // const deleteGroupJoined = function(username, groupId) {
    //     //groupid should be in an string
    //     fetch(`userDeleteGroupJoined/${username}`, {
    //             method: "POST",
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ groupId })
    //         })
    //         .then(res => res.json())
    //         .then(dta => console.log(dta.msg, dta.username))
    //         .catch(err => console.log(err))
    // }

    // delete user if password(string) input matches DB
    /**
     * 
     * @param {string} username 
     * @returns {Object} - success or failure to delete
     */
    const deleteUser = async function(username) {
        let dtaReturn
        await fetch(`userDelete/${username}`)
            .then(res => res.json())
            .then(dta => {
                console.log(dta.msg, dta.username)
                dtaReturn = dta
            })
            .catch(err => console.log(err))
        return dtaReturn
    }

    /**
     * For checking hashed password   
     * @param {string} username 
     * @param {string} password 
     * @returns {Object} - success or failure to hash
     */

    const hashingpassword = async function(username, password) {
        let dtaReturn
        await fetch(`checkinghash/${username}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            })
            .then(res => res.json())
            .then(dta => {
                console.log(dta.msg, )
                dtaReturn = dta.msg
            })
            .catch(err => console.log(err))
        return dtaReturn

    }

    /*====================================== Groups ======================================*/
    /**
     * Funtion retrives all groups from DB and logs to the console
     */
    const getGroups = async function() {
        let resGroups
        console.log("getgroups")
        await fetch("/groups")
            .then(res => res.json())
            .then(groups => {
                console.log(groups);
                resGroups = groups
            })
            .catch(err => { console.log("Could not fetch groups", err); })
        return resGroups
    }

    /**
     * Function retrives group by groupname from DB
     * @param {string} groupname 
     * @returns {Object} the group information from the DB
     */
    const getByGroupName = async function(groupname) {
        let group;
        await fetch(`/groups/${groupname}`)
            .then(res => res.json())
            .then(jsn => {
                console.log(jsn);
                group = jsn;
            })
            .catch(err => { console.log("Could not fetch group by name", err); })
        return group;
    }

    /**
     * Function retrives groups by tag from DB
     * @param {string} tag 
     * @returns {Object} the group information from the DB
     */
    const getTag = async function(tag) {
        let group
        await fetch(`/tags/${tag}`)
            .then(res => res.json())
            .then(jsn => {
                //console.log(jsn);
                group = jsn;
            })
            .catch(err => { console.log("Could not fetch tag", err); })
        return group
    }

    /**
     * Function retrives group by adminuser from DB
     * @param {string} admin 
     * @returns {Object} the group information from the DB
     */
    const getAdmin = async function(admin) {
        let resgroup;
        await fetch(`/admin/${admin}`)
            .then(res => res.json())
            .then(jsn => {
                console.log(jsn);
                resgroup = jsn;
            })
            .catch(err => { console.log("Could not fetch admin", err); })
        return resgroup
    }

    /**
     * add new Group to DB
     * Create new group. Must include name, description, 1+tags (array), 1 created by member (array)
     * Notice: when user create the group, the member equals to adminuser
     * @param {string} groupname 
     * @param {string} description
     * @param {Array} tag 
     * @param {Array} username
     */
    const addGroup = async function(groupname, description, tag, username) {
        let msg
        if (tag == " ") {
            return msg = "please add at least tag"
        }
        let tags = []
        tags = tag.split(",")
        let adminuser = new Array()
        adminuser[0] = username
        await fetch("/groups", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupname, description, tags, adminuser })
            })
            .then(res => res.json())
            .then(dta => {
                console.log(dta);
                msg = dta.msg;
            })
            .catch(err => console.log(err))
        return msg
    }

    /**
     * delete group
     * @param {string} groupname 
     * @param {string} username
     */
    const deleteGroup = async function(groupname, username) {
        let msg
        await fetch(`/deleteGroup`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupname, username })
            })
            .then(res => res.json())
            .then(dta => {
                console.log(dta);
                msg = dta.msg
            })
            .catch(err => console.log(err))
        return msg
    }

    /**
     * Leave group
     * @param {string} groupname 
     * @param {string} username
     */
    const leaveGroup = function(groupname, username) {
        fetch(`/leaveGroup`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupname, username })
            })
            .then(res => res.json())
            .then(dta => console.log(dta))
            .catch(err => console.log(err))
    }

    /**
     * Join group
     * @param {string} groupname 
     * @param {string} username
     */
    const joinGroup = function(groupname, username) {
        fetch(`/joinGroup`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ groupname, username })
            })
            .then(res => res.json())
            .then(dta => console.log(dta))
            .catch(err => console.log(err))
    }

    /*====================================== Messages ======================================*/

    /**
     * Gets the messages of a group from the server
     * @param {string} grp - The groupname
     * @returns {Object} - The messages of the group
     */
    const getMessages = async function(grp) {
        let messages;
        await fetch(`/messages/${grp}`)
            .then(res => res.json())
            .then(jsn => {
                messages = jsn;
                console.log("fetched messages", jsn)
            })
            .catch(err => console.log("Error fetching msgs", err))
        return messages;
    }

    /**
     * Posts a new group message to the server
     * @param {string} grp - The groupname
     * @param {string} text - The message text to be added
     * @param {string} author - The user who wrote the message
     * @returns {string} - Success/error message
     */
    const addMessage = async function(grp, text, author) {
        let msg;
        await fetch(`/messages/${grp}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, author })
            })
            .then(res => res.json())
            .then(jsn => {
                console.log(`Added message with ID: ${jsn.id}`);
                msg = jsn.msg;
            })
            .catch(err => console.log("Error adding msg", err))
        return msg;
    }

    /**
     * Posts a delete message request to the server
     * @param {string} grp - The groupname where the message is
     * @param {string} msgID - The ID of the message to be deleted
     * @param {string} user - The user who requested the deletetion
     * @returns {string} - Success/error message
     */
    const deleteMessage = async function(grp, msgID, user) {
        let msgDelete;
        await fetch(`/deleteMessage/${grp}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ msgID, user })
            })
            .then(res => res.json())
            .then(jsn => {
                msgDelete = jsn.msg;
                console.log(msgDelete);
            })
            .catch(err => console.log("Error deleting msg", err))
        return msgDelete;
    }

    /**
     * Posts a new comment to the server
     * @param {string} msgID - The message ID
     * @param {string} text - The comment text to be added
     * @param {string} author - The user who wrote the comment
     * @returns {string} - Success/error message
     */
    const addComment = async function(msgID, text, author) {
        let comment;
        await fetch(`/comments/${msgID}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, author })
            })
            .then(res => res.json())
            .then(jsn => {
                console.log(`Added comment with ID: ${jsn.id}`);
                comment = jsn.msg;
            })
            .catch(err => console.log("Error adding comment", err));
        return comment;
    }

    /**
     * Posts a delete comment request to the server
     * @param {string} msgID - The ID of the message from which to delete a comment
     * @param {string} commentID - The ID of the comment to be deleted
     * @param {string} user - The user qho requested the deletion
     * @returns {string} - Success/error message
     */
    const deleteComment = async function(msgID, commentID, user) {
        let cmntDelete;
        await fetch(`/deleteComment/${msgID}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commentID, user })
            })
            .then(res => res.json())
            .then(jsn => {
                cmntDelete = jsn.msg;
                console.log(cmntDelete);
            })
            .catch(err => console.log("Error deleting comment", err))
        return cmntDelete;
    }

    /*====================================== Media ======================================*/
    /**
     * Posts a new media object to the server
     * @param {string} group - The groupname to which to add the media
     * @param {Object} form - The Form Data Object containing form input values
     * @returns {string} - Success/error message
     */
    const submitForm = async function(group, form) {
        let submitted;
        await fetch(`/uploadMedia/${group}`, {
                method: "POST",
                body: form
            })
            .then(res => res.json())
            .then(jsn => {
                submitted = jsn.msg;
                console.log(submitted);
            })
            .catch(err => console.log("Error uploading file", err))
        return submitted;
    }

    /*====================================== Events ======================================*/
    /**
     * Function to get events by group name
     * @param {string} groupname 
     * @returns {Object} the events information from the DB
     */
    const getEventsByGroup = async function(groupname) {
        let events;
        await fetch(`/events/${groupname}`)
            .then(res => res.json())
            .then(jsn => {
                console.log(jsn);
                events = jsn;
            })
            .catch(err => { console.log("Could not fetch events by group name", err); })
        return events;
    }

    /**
     * Function to get an event by eventId
     * @param {string} eventId 
     * @returns {Object} the event information from the DB
     */
    let getEventById = async function(eventId) {
        let event;
        await fetch(`/event/${eventId}`)
            .then((response) => response.json())
            .then(data => {
                event = data
            })
            .catch((err) => console.log("err"));
        return event;
    }

    /**
     * add a user to the event
     * @param {string} eventId 
     * @param {string} user 
     */
    const addUserToEvent = function(eventId, user) {
        fetch(`/addUserToEv/${eventId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: user })
            })
            .then(res => res.json())
            .then(jsn => alert(jsn.msg))
            .catch(err => console.log("Error adding comment", err))
    }

    /**
     * delete the event
     * @param {string} eventId 
     */
    const deleteEvent = async function(eventId) {
        await fetch("/deleteEvent", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: eventId })
            })
            .then(res => res.json())
            .then(jsn => alert(jsn.msg))
            .catch(err => console.log("Error", err))
    }

    /**
     * add a new event to DB
     * @param {object} information of the event 
     */
    let addEvent = function(data) {
        fetch("/addEvent", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(dta => alert(dta.msg))
            .catch(err => console.log(err))
    }

    /**
     * Function to get coordinates from city name
     * @param {string} cityName
     * @returns {Array} the coordinates of the input city
     */
    let getCoor = async function(cityName) {
        let url = "https://api.opencagedata.com/geocode/v1/json?q=" +
            cityName +
            "&key=cf5967c8af6e4b909a4acf034dfee65d&language=en&pretty=1";
        let coor;
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // console.log(data['results'][0]['geometry']);
                coor = data['results'][0]['geometry']
            })
            .catch(err => { console.log("The city name is invalid") })
        return coor;
    }

    window.exports = {
        addUser: addUser,
        hashingpassword: hashingpassword,
        getGroups: getGroups,
        deleteUser: deleteUser,
        getUsers: getUsers,
        addInterests: addInterests,
        deleteInterests: deleteInterests,
        getUserByUsername: getUserByUsername,
        getByGroupName: getByGroupName,
        joinGroup: joinGroup,
        addGroup: addGroup,
        getAdmin: getAdmin,
        getTag: getTag,
        deleteGroup: deleteGroup,
        leaveGroup: leaveGroup,
        getMessages: getMessages,
        addMessage: addMessage,
        deleteMessage: deleteMessage,
        addComment: addComment,
        deleteComment: deleteComment,
        submitForm: submitForm,
        getEventsByGroup: getEventsByGroup,
        addUserToEvent: addUserToEvent,
        getEventById: getEventById,
        getCoor: getCoor,
        deleteEvent: deleteEvent,
        addEvent: addEvent
    }
})();
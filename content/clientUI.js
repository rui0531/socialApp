/**
 * Client side for the UI
 * @author CS5003 Group 25
 * @version 1.0
 * @module content/clientUI
 */

(function() {
    console.log("ClientUI.js")

    //initilise currentUser
    let currentUser;

    window.onload = function() {
        document.getElementById("login").onclick = () => login();
        document.getElementById("register").onclick = () => toRegisteringHomepage();
        document.getElementById("signup").onclick = () => getNewUserinfo();
        document.getElementById("logout").onclick = () => logout();

    }

    /*====================================== Login & out ======================================*/

    /**
     * Checking the user input information and hashed password for login
     */

    const login = async function() {
        // get the username and passwrod input value 
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        // check the hashpassword is equal or not

        let hashpassword = await window.exports.hashingpassword(username, password)
        if (hashpassword === "successful") {
            alert("Login Succsessful")
            currentUser = username
            toUserHomepage()
        } else {
            alert("Please check your username or password again")

        }
    }

    /**
     * Logout function: Clear the currentUser data and return to the mainpage to login again
     */
    const logout = function() {
        currentUser = ""
        window.location.href = "http://localhost:3000/";
    }

    /*====================================== Registering New User======================================*/

    /**
     * Register the new user and get the data about name, password and interests
     */

    const getNewUserinfo = async function() {
        let newUserName = document.getElementById('newusername').value
        let newPassword = document.getElementById('newpassword').value
            // set array form for multiple interest
        let newAllinterests = [];
        for (let option of document.getElementById('allInterests').options) {
            if (option.selected) {
                newAllinterests.push(option.value);
            }
        }
        let groups = new Array()

        // check the validation about new user's input, if it is successful then send to 'toUserHomepage'
        let confirmNewUser = await window.exports.addUser(newUserName, newPassword, newAllinterests, groups)
        if (confirmNewUser == "User added") {
            alert(confirmNewUser)
            currentUser = newUserName
            document.getElementById("loginpage").style.display = "none";
            document.getElementById("registerHomepage").style.display = "none";
            toUserHomepage()
        } else {
            alert(confirmNewUser)
        }
    }

    /**
     * Page for registering, get all of the interests from group tagas and sending this list to HTML
     */

    const toRegisteringHomepage = async function() {
        document.getElementById("loginpage").style.display = "none";
        document.getElementById("registerHomepage").style.display = "block"

        //send all of the intrestes list to dropdown list in HTML
        let drop = document.getElementById("allInterests")
        let a = []
        let allGroups = await window.exports.getGroups()
        for (let i of allGroups) {
            for (let j of i.tags) {
                a.push(j)
            }
        }
        let b = remove_duplicates(a)
        for (let t of b) {
            drop.add(new Option(t, t));
        }
    }

    /*====================================== User Homepage ======================================*/
    /**
     * function to set up user homepage - hide/show appropriate elements in html
     */
    const toUserHomepage = function() {
        document.getElementById("groupPage").style.display = "none"
        document.getElementById("newGroupPage").style.display = "none"
        document.getElementById("joinGroupPage").style.display = "none"
        document.getElementById("loginpage").style.display = "none"
        document.getElementById("userHomepage").style.display = "block"
        document.getElementById("editUser").style.display = "block"
        document.getElementById("deleteUserDiv").style.display = "none"
        document.getElementById("editInterestsDiv").style.display = "none"
        document.getElementById("suggestedGroups").style.display = "block"
        document.getElementById("deleteUser").onclick = () => deleteCurrentUser(currentUser);
        document.getElementById("editInterests").onclick = () => editUserInterests(currentUser);
        document.getElementById("editGroups").onclick = () => editUserGroups(currentUser);
        document.getElementById("userCreateNewGroup").onclick = () => createGroup(currentUser);
        displayGroupsJoined(currentUser);
        document.getElementById("currentUser").innerHTML = currentUser;
        suggestedGroups(currentUser)
            // check whether the map exists 
        var findMap = document.getElementById("map")
        if (findMap) {
            findMap.remove()
        }
    }

    /**
     * delete current user - asks for password and confirmation
     * @param {string} username 
     */
    const deleteCurrentUser = function(username) {
        document.getElementById("editUser").style.display = "none"
        document.getElementById("deleteUserDiv").style.display = "block"
        document.getElementById("suggestedGroups").style.display = "none"
        document.getElementById("cancelDeleteUser").onclick = toUserHomepage;
        document.getElementById("submitDeleteUser").onclick = async() => {
            let confirmDelete = confirm(`Are you sure you want to delete the account: ${username}`)
            if (confirmDelete) {
                // get password they have entered
                let passwordDeleteUser = document.getElementById("passwordDeleteUser").value
                let hashpassword = await window.exports.hashingpassword(username, passwordDeleteUser)
                if (hashpassword == "successful") {
                    let response = await window.exports.deleteUser(username)
                        // if has successfully deleted the user or not
                    if (response.success) {
                        alert("User: " + response.username + " deleted successfully")
                            //Back to login page
                        document.getElementById("deleteUserDiv").style.display = "none"
                        document.getElementById("loginpage").style.display = "block"
                        currentUser = ""
                    } else if (!response.success) {
                        alert("could not delete user" + response.username)
                    } else {
                        console.log(response.msg)
                    }
                } else {
                    alert("Incorrect password for " + username + " Please try again")
                }
            } else {
                //back to userhomepage
                toUserHomepage()
            }
        }
    }

    /**
     * Displays list of tags as checkboxes user is able to edit which interests they want to include
     * @param {string} username 
     */
    const editUserInterests = async function(username) {
        document.getElementById("editUser").style.display = "none"
        document.getElementById("editInterestsDiv").style.display = "block"
        document.getElementById("addInterestsList").innerHTML = ""
        document.getElementById("suggestedGroups").style.display = "none"
            //get current interests
        let currentInterests = []
        let userDetails = await window.exports.getUserByUsername(username)
        for (let interest of userDetails.interests) {
            currentInterests.push(interest)
        }

        //get all available interests from group tags    
        let groups = await window.exports.getGroups()
        let tags = []
        for (g of groups) {
            for (let t of g.tags) {
                if (tags.indexOf(t.toLowerCase()) == -1) {
                    tags.push(t.toLowerCase())
                }
            }
        }

        //for each tag display a checkbox which when clicked add or removes the interest from the user
        for (let t of tags) {
            let label = document.createElement("label")
            let input = document.createElement("input")
            input.setAttribute("type", "checkbox")
            if (currentInterests.indexOf(t) != -1) input.setAttribute("checked", "checked")
            label.innerHTML = t
            label.append(input)
            document.getElementById("addInterestsList").append(label)
            input.onclick = () => {
                if (input.getAttribute("checked") == "checked") {
                    input.setAttribute("checked", null)
                        //remove interest
                    window.exports.deleteInterests(currentUser, [t])
                } else {
                    input.setAttribute("checked", "checked")
                        //add interest
                    window.exports.addInterests(currentUser, [t])
                }
            }
        }
        document.getElementById("backInterests").onclick = toUserHomepage;
        //document.getElementById("selectBackInterests").onclick = toUserHomepage;

    }

    /**
     * Display list of groups joined - link to group pages
     * @param {string} username 
     */
    const displayGroupsJoined = async function(username) {
        document.getElementById("groupsJoinedList").innerHTML = ""
        let userDetails = await window.exports.getUserByUsername(username)
        for (let grp of userDetails.groupsJoined) {
            let item = document.createElement("li")
            item.innerText = grp
            item.onclick = () => toGroupPage(grp);
            document.getElementById("groupsJoinedList").append(item)
        }
    }

    /**
     * Algorithm for recomending groups to user based on interests
     * @param {string} username 
     */
    const suggestedGroups = async function(username) {
        document.getElementById("suggestedGroupsList").innerHTML = ""
            //get current interests
        let currentInterests = []
        let userDetails = await window.exports.getUserByUsername(username)
        for (let interest of userDetails.interests) {
            currentInterests.push(interest)
        }

        //get currently joined groups
        let currentGroups = []
        for (g of userDetails.groupsJoined) {
            currentGroups.push(g)
        }

        let suggestedGroups = {}
            //get groups with tags same as interests
        for (t of currentInterests) {
            groups = await window.exports.getTag(t)
            for (grp of groups) {
                if (currentGroups.indexOf(grp.groupname) == -1) {
                    Object.keys(suggestedGroups).indexOf(grp.groupname) == -1 ? suggestedGroups[grp.groupname] = 1 : suggestedGroups[grp.groupname]++
                }
            }
        }

        if (Object.keys(suggestedGroups) == 0) {
            document.getElementById("suggestedGroupsList").innerHTML = "No suggested groups to join add more interests to get suggestions!"
            document.getElementById("joinSuggestedGroup").style.display = "none"
        } else {
            let max = Object.keys(suggestedGroups).reduce((a, b) => suggestedGroups[a] > suggestedGroups[b] ? a : b)
            let suggGrp = await window.exports.getByGroupName(max)
            document.getElementById("suggestedGroupsList").innerHTML = `${suggGrp.groupname}: <br> ${suggGrp.description}`
            document.getElementById("joinSuggestedGroup").style.display = "block"
            document.getElementById("joinSuggestedGroup").onclick = () => {
                window.exports.joinGroup(suggGrp.groupname, username)
                alert(`You joined ${suggGrp.groupname}!`)
                toUserHomepage()
            }
        }
    }

    /*====================================== All Groups ======================================*/

    /**
     * create new group - hide/show appropriate elements in create group page
     * @param {string} username 
     */
    const createGroup = function(username) {
        document.getElementById("suggestedGroups").style.display = "none"
        document.getElementById("groupName").value = " "
        document.getElementById("description").value = " "
        document.getElementById("tags").value = " "
        document.getElementById("editUser").style.display = "none"
        document.getElementById("newGroupPage").style.display = "block"
        document.getElementById("createGroup").onclick = () => createGroupUI(username)
        document.getElementById("return").onclick = toUserHomepage
    }

    /**
     * create new group
     * @param {string} username 
     */
    const createGroupUI = async function(username) {
        let groupname = document.getElementById("groupName").value
        let description = document.getElementById("description").value
        let tags = document.getElementById("tags").value
        if (groupname == undefined) return; // does nothing if text is empty
        let confirm = await window.exports.addGroup(groupname, description, tags, username)
        alert(confirm)
        document.getElementById("groupName").value = " "
        document.getElementById("description").value = " "
        document.getElementById("tags").value = " "
    }

    /**
     * function to remove the duplicated tags
     * @param {string} a
     */
    function remove_duplicates(a) {
        let s = new Set(a);
        let it = s.values();
        return Array.from(it);
    }

    /**
     * function to create edit groups- hide/show appropriate elements in editgroup page
     * @param {string} username
     */
    const editUserGroups = async function(username) {
        document.getElementById("suggestedGroups").style.display = "none"
        document.getElementById("groupCreated").innerHTML = ""
        document.getElementById("groupsList").innerHTML = ""
        document.getElementById("groupsTag").innerHTML = ""
        document.getElementById("tagDrop").innerHTML = ""
        document.getElementById("editUser").style.display = "none"
        document.getElementById("joinGroupPage").style.display = "block"
            //make dropdown list options
        let drop = document.getElementById("tagDrop")
        let a = []
        let allGroups = await window.exports.getGroups()
        for (let i of allGroups) {
            for (let j of i.tags) {
                a.push(j)
            }
        }
        let b = remove_duplicates(a)
        for (let t of b) {
            drop.add(new Option(t, t));
        }
        document.getElementById("search").onclick = () => searchTag()

        //get user's created groups
        let createdGroups = []
        let createdDes = []
        let createdTag = []
        let adminDetails = await window.exports.getAdmin(username)

        for (let groups of adminDetails) {
            createdGroups.push(groups.groupname)
            createdDes.push(groups.description)
            createdTag.push(groups.tags)
        }
        //get user's joined groups
        let currentGroups = []
        let userDetails = await window.exports.getUserByUsername(username)
        for (let groupsJoined of userDetails.groupsJoined) {
            currentGroups.push(groupsJoined)
        }
        //get all available group names from db
        let groupsDetails = await window.exports.getGroups()
        let groupname = []
        let groupDesc = []
        for (group of groupsDetails) {
            groupname.push(group.groupname)
            groupDesc.push(group.description)
        }
        //make button for user to delete created groups
        //for (let i of createdGroups) {
        for (let i = 0; i < createdGroups.length; i++) {
            let label = document.createElement("label")
            let button = document.createElement("button")
            label.innerHTML = createdGroups[i]
            label.setAttribute("id", createdGroups[i])
            button.innerHTML = "Delete group"
            label.appendChild(button)
            document.getElementById("groupCreated").appendChild(label)
            addLi("Description: " + createdDes[i], createdGroups[i])
            addLi("Tags: " + createdTag[i], createdGroups[i])
            button.onclick = () => deleteUI(createdGroups[i], currentUser)
        }

        //make checkbox for groupnames
        for (let i = 0; i < groupsDetails.length; i++) {
            if (createdGroups.indexOf(groupname[i]) == -1) {
                let label = document.createElement("label")
                let input = document.createElement("input")
                let li = document.createElement("li")
                input.setAttribute("type", "checkbox")
                if (currentGroups.indexOf(groupname[i]) != -1) {
                    input.setAttribute("checked", "checked")
                }
                label.innerHTML = groupname[i]
                label.append(input)
                document.getElementById("groupsList").append(label)
                input.onclick = () => {
                    if (input.getAttribute("checked") == "checked") {
                        input.setAttribute("checked", null)
                            //leave group
                        window.exports.leaveGroup(groupname[i], currentUser)
                    } else {
                        input.setAttribute("checked", "checked")
                            //join group
                        window.exports.joinGroup(groupname[i], currentUser)
                    }
                }
                li.innerHTML = "Description: " + groupDesc[i]
                label.append(li)
            }
        }
        document.getElementById("backGroups").onclick = toUserHomepage;
    }

    /**
     * function to dynamically add li element
     * @param {string} text
     * @param {string} id
     */
    function addLi(text, id) {
        let li = document.createElement("li")
        li.innerHTML = text
        document.getElementById(id).appendChild(li)
    }

    /**
     * function to search groups by tags
     */
    const searchTag = async function() {
        document.getElementById("groupsTag").innerHTML = ""
        let drop = document.getElementById("tagDrop").value
        let tagSearch = await window.exports.getTag(drop)

        for (let i of tagSearch) {
            let li = document.createElement("li")
            let label = document.createElement("label")
            label.innerHTML = i.groupname
            document.getElementById("groupsTag").appendChild(label)
            li.innerHTML = "Description: " + i.description
            label.appendChild(li)
        }
    }

    /**
     * alert if user want to delete group
     * @param {string} i
     * @param {string} currentUser
     */
    const deleteUI = async function(i, currentUser) {
        let confirmDelete = confirm("Are you sure you want to delete this group?");
        if (confirmDelete) {
            let del = await window.exports.deleteGroup(i, currentUser)
            alert(del)
        }
    }


    /*====================================== Individual Group Page ======================================*/

    /**
     * Shows an individual group's page.
     * @param {string} groupname - The name of the group page to be displayed
     */
    const toGroupPage = async function(groupname) {
        // Hide all other sections
        document.getElementById("loginpage").style.display = "none";
        document.getElementById("registerHomepage").style.display = "none";
        document.getElementById("userHomepage").style.display = "none";
        document.getElementById("hideMembers").style.display = "none";
        document.getElementById("groupMembers").style.display = "none";
        document.getElementById("hideEvents").style.display = "none";
        document.getElementById("groupEvents").style.display = "none";
        document.getElementById("hideMessages").style.display = "none";
        document.getElementById("groupMessages").style.display = "none";
        document.getElementById("newEvent").style.display = "none";
        document.getElementById("eventPage").style.display = "none";

        // Show this section and buttons
        document.getElementById("groupPage").style.display = "block";
        document.getElementById("viewMembers").style.display = "inline";
        document.getElementById("viewEvents").style.display = "inline";
        document.getElementById("viewMessages").style.display = "inline";
        document.getElementById("uploadMedia").reset(); // Resets form input

        let title = document.getElementById("groupTitle");
        let desc = document.getElementById("groupDesc");
        let admin = document.getElementById("groupAdmin");
        title.innerText - "";
        desc.innerText - "";
        admin.innerText - "";

        // Fetch and display group info
        let group = await window.exports.getByGroupName(groupname);
        title.innerText = group.groupname;
        desc.innerText = group.description;
        admin.innerText = `Admin: ${group.adminuser}`

        // Add button event handlers
        document.getElementById("viewMembers").onclick = () => viewMembers(group);
        document.getElementById("viewEvents").onclick = () => viewEvents(groupname);
        document.getElementById("viewMessages").onclick = () => viewMessages(groupname);
        document.getElementById("addMessage").onclick = () => addNewMessage(groupname);
        document.getElementById("createNewEvent").onclick = () => createNewEvent(groupname);
        document.getElementById("toHomepage").onclick = toUserHomepage;
        document.getElementById("uploadMedia").addEventListener("submit", submitFormUI);

        // Sets the hidden form item with the group name
        document.getElementById("groupUpload").value = groupname;

        // Displays the gallery
        let gallery = document.getElementById("gallery");
        gallery.innerText = "";

        // Starts the lightbox instance and attaches events to items class: gallery
        const lightbox = GLightbox({
            selector: '.gallery',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true,
            skin: "clean",
            closeButton: true,
            descPosition: "left"
        });

        // Creates a thumbnail for each file and inserts gallery slide
        for (let file of group.media) {
            let link = document.createElement("a");
            link.href = file.path;
            link.className = "gallery";

            // Attribute attached to link for descrption of the slide
            link.setAttribute("data-glightbox", `title: ${file.title}; description: Uploaded by ${file.user}: ${file.description}`);

            // Checks whether image is MP4 video or image and shows thumbnail
            if (file.path.substring(file.path.length - 1, file.path.length) === "4") {
                link.innerHTML = `<img src="playvideo.png" width="200" alt="Play Video"/>`;
            } else {
                link.innerHTML = `<img src="${file.path}" width="200" alt="Image"/>`;
            }

            gallery.append(link);

            lightbox.insertSlide({ href: file.path });
        };

        // Reloads lightbox to include the new slides
        lightbox.reload();
    }

    /**
     * Displays the members section of the group
     * @param {Object} group - The group object being shown
     */
    const viewMembers = async function(group) {
        let members = document.getElementById("membersList");
        members.innerText = "";

        for (let member of group.members) {
            let li = document.createElement("li");
            li.innerText = member;
            members.append(li);
        }

        // Swap show/hide buttons
        document.getElementById("viewMembers").style.display = "none";
        let btn = document.getElementById("hideMembers");
        btn.style.display = "inline";
        btn.onclick = () => hideMembers(group);

        // Show members
        document.getElementById("groupMembers").style.display = "block";
    }

    /**
     * Hides the members section of the group and swaps the show/hide buttons
     * @param {Object} group - The group object being shown
     */
    const hideMembers = function(group) {
        document.getElementById("groupMembers").style.display = "none";

        document.getElementById("hideMembers").style.display = "none";
        let btn = document.getElementById("viewMembers");
        btn.style.display = "inline";
        btn.onclick = () => viewMembers(group);
    }

    // Function to show group messages: passed the groupname
    /**
     * Displays the messages section of the group page
     * @param {string} groupname - The groupname of which messages are to be fetched
     */
    const viewMessages = async function(groupname) {
        document.getElementById("newMessage").style.display = "none";
        document.getElementById("messages").style.display = "block";

        let messages = document.getElementById("messagesList");
        messages.innerText = "";

        // fetch and loop through messages and display them
        let msgs = await window.exports.getMessages(groupname);
        if (typeof msgs === "undefined") msgs = [];
        for (let [i, message] of msgs.entries()) {
            let li = document.createElement("li");
            li.innerText = `${message.text} - by ${message.author} on ${new Date(message.date).toLocaleString("en-GB")}`; // Shows time formatted for UK timezone

            let btn = document.createElement("button");
            btn.innerText = "Leave a Comment";
            btn.className = "msgsBtn";
            btn.onclick = () => addNewComment(groupname, message.msgID);
            li.appendChild(btn);

            btn = document.createElement("button");
            btn.innerText = "\uD83D\uDDD1"; // unicode for trashcan (Delete Message)
            btn.className = "msgsBtn";
            btn.onclick = () => deleteMessageUI(groupname, message.msgID);
            li.appendChild(btn);

            // Loop through comments
            let comments = document.createElement("ul");
            for (let [j, comment] of msgs[i].comments.entries()) {
                let li = document.createElement("li");
                li.innerText = `${comment.text} - by ${comment.author} on ${new Date(comment.date).toLocaleString("en-GB")}`;

                let btn = document.createElement("button");
                btn.innerText = "\uD83D\uDDD1"; // Delete Comment
                btn.className = "msgsBtn";
                btn.onclick = () => deleteCommentUI(groupname, msgs[i].msgID, msgs[i].comments[j].msgID);
                li.appendChild(btn);

                comments.append(li);
            }
            li.appendChild(comments);

            messages.append(li);
        }

        // Swap buttons
        document.getElementById("viewMessages").style.display = "none";
        let btn = document.getElementById("hideMessages");
        btn.style.display = "inline";
        btn.onclick = () => hideMessages(groupname);

        document.getElementById("groupMessages").style.display = "block";
    }

    /**
     * Hides the messages section of the group and swaps the show/hide buttons
     * @param {string} groupname - The name of the group being shown
     */
    const hideMessages = function(groupname) {
        document.getElementById("groupMessages").style.display = "none";

        document.getElementById("hideMessages").style.display = "none";
        let btn = document.getElementById("viewMessages");
        btn.style.display = "inline";
        btn.onclick = () => viewMessages(groupname);
    }

    /**
     * Displays the new message section of the group page
     * @param {string} groupname - The name of the group being shown
     */
    const addNewMessage = function(groupname) {
        document.getElementById("messages").style.display = "none";
        document.getElementById("newMessage").style.display = "block";
        document.getElementById("submitComment").style.display = "none";
        document.getElementById("msgtext").value = "";
        document.getElementById("submitMessage").style.display = "inline";
        document.getElementById("submitMessage").onclick = () => addMessageUI(groupname);
        document.getElementById("cancelMessage").onclick = () => viewMessages(groupname);
    }

    /**
     * Gets the message text from the new message input and sends info to server.
     * Refreshes group messages if successful
     * @param {string} groupname - The name of the group to which to add a message
     * @returns {null} if there is no text
     */
    const addMessageUI = async function(groupname) {
        let msgtext = document.getElementById("msgtext").value;
        if (msgtext === "") return; // does nothing if text is empty

        let submitted = await window.exports.addMessage(groupname, msgtext, currentUser);
        alert(submitted);
        document.getElementById("messages").style.display = "block";
        viewMessages(groupname);
    }

    /**
     * Confirms message deletion and refreshes page after deletion
     * @param {string} groupname - The name of the group being displayed
     * @param {string} msgID - The ID of the message to be deleted
     */
    const deleteMessageUI = async function(groupname, msgID) {
        let confirmDelete = confirm("Are you sure you want to delete this message? Only the author can delete the message.");
        if (confirmDelete) {
            let msgDelete = await window.exports.deleteMessage(groupname, msgID, currentUser);
            alert(msgDelete);
            viewMessages(groupname);
        }
    }

    /**
     * Displays the new comment section of the group page
     * @param {string} groupname - The name of the group being shown
     * @param {string} msgID - The ID of the message to which the comment should be added
     */
    const addNewComment = function(groupname, msgID) {
        document.getElementById("messages").style.display = "none";
        document.getElementById("newMessage").style.display = "block";
        document.getElementById("submitMessage").style.display = "none";
        document.getElementById("msgtext").value = "";
        document.getElementById("submitComment").style.display = "inline";
        document.getElementById("submitComment").onclick = () => addCommentUI(groupname, msgID);
        document.getElementById("cancelMessage").onclick = () => viewMessages(groupname);
    }

    /**
     * Gets the comment text from the new comment input and sends info to server.
     * Refreshes group messages if successful
     * @param {string} groupname - The name of the group being shown
     * @param {string} msgID - The ID of the message to which the comment should be added
     * @returns {null} if there is no text
     */
    const addCommentUI = async function(groupname, msgID) {
        let msgtext = document.getElementById("msgtext").value;
        if (msgtext === "") return; // does nothing if text is empty

        let submitted = await window.exports.addComment(msgID, msgtext, currentUser);
        alert(submitted);
        document.getElementById("messages").style.display = "block";
        viewMessages(groupname);
    }

    /**
     * Confirms comment deletion and refreshes page after deletion
     * @param {string} groupname - The name of the group being displayed
     * @param {string} msgID - The ID of the comment's message
     * @param {string} commentID - The ID of the comment to be deleted
     */
    const deleteCommentUI = async function(groupname, msgID, commentID) {
        let confirmDelete = confirm("Are you sure you want to delete this comment? Only the author can delete the comment.");
        if (confirmDelete) {
            let cmntDelete = await window.exports.deleteComment(msgID, commentID, currentUser);
            alert(cmntDelete);
            viewMessages(groupname);
        }
    }

    /*====================================== Media Handling ======================================*/
    /**
     * Gets the Upload Media form values and attaches them to a FormData object to send to server
     * Refreshes group page
     * @param {Event} event - The form submit event
     */
    const submitFormUI = async function(event) {
        event.preventDefault();
        const groupname = document.getElementById("groupUpload").value;
        const title = document.getElementById("title");
        const description = document.getElementById("desc");
        const file = document.getElementById("uploadedMedia");

        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("description", description.value);
        formData.append("user", currentUser);
        formData.append("uploadedMedia", file.files[0]);

        let submitted = await window.exports.submitForm(groupname, formData);
        alert(submitted);

        // Shows updated group page
        toGroupPage(groupname);
    }

    /*====================================== Events ======================================*/
    /**
     * Function to show events: passed the groupname
     * @param {string} groupname - The groupname of which events are to be fetched
     */
    const viewEvents = async function(groupname) {
        let ulEvent = document.getElementById("eventList");
        ulEvent.innerText = "";

        let events = await window.exports.getEventsByGroup(groupname);
        let cities = []
        let eventNameArray = []
        let eventCommentsArray = []
        for (let eventE of events) {
            let liEvent = document.createElement("li");
            liEvent.innerText = eventE.eventName
            liEvent.id = eventE.eventId
            liEvent.onclick = landingEvent;
            ulEvent.append(liEvent)
            cities.push(eventE.location)
            eventNameArray.push(eventE.eventName)
            eventCommentsArray.push(eventE.comments)
        }

        drawMap(groupname, cities, eventNameArray, eventCommentsArray)

        document.getElementById("groupEvents").style.display = "block";
    }

    /**
     * Function to draw the locations of all the events on a map 
     * @param {string} groupname - The name of the group being shown
     * @param {Array} cities - All the cities name of the events
     * @param {Array} eventNameArray - The corresponding event name
     * @param {Array} eventCommentsArray - The corresponding description of the event
     */
    let drawMap = async function(groupname, cities, eventNameArray, eventCommentsArray) {
        let total = []
        let prevlng = 0;
        let invalidNum = []
        for (let i = 0; i < cities.length; i++) {
            cities[i] = cities[i].toLowerCase();
            let testArray = [];
            let data;
            if (cities[i] != "online") {
                data = await window.exports.getCoor(cities[i])
            } else {
                data = undefined
            }

            if (data != undefined) {
                let lat = data['lat']
                let lng = data['lng']
                if (lng == prevlng) {
                    lng += 0.1
                }
                prevlng = lng;
                testArray.push(lat)
                testArray.push(lng)
            } else {
                invalidNum.push(i)
            }
            total.push(testArray)
        }
        var mapDiv = document.createElement("div")
        mapDiv.id = "map"
        document.getElementById("groupEvents").appendChild(mapDiv)
        document.getElementById("map").style.display = "block"
            // if no events in the group, the map will be invisible
        if (eventNameArray.length == 0) {
            document.getElementById("map").style.display = "none"
        }
        var map = L.map('map').setView([55.9531, -3.1889], 6);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="href://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        for (let i = 0; i < total.length; i++) {
            if (invalidNum.includes(i)) {
                continue;
            }
            var marker = L.marker(total[i]).addTo(map);
            let popUp = `<b>Welcome!</b><br>Event Name : ${eventNameArray[i]}<br>Event Description: ${eventCommentsArray[i]}`
            marker.bindPopup(popUp).openPopup();
        }

        document.getElementById("viewEvents").style.display = "none";
        let btn = document.getElementById("hideEvents");
        btn.style.display = "inline";
        btn.onclick = () => hideEvents(groupname);
    }

    /**
     * Hides the events section of the group and swaps the show/hide buttons
     * @param {string} groupname - The name of the group being shown
     */
    const hideEvents = function(groupname) {
        document.getElementById("map").remove();
        document.getElementById("groupEvents").style.display = "none";

        document.getElementById("hideEvents").style.display = "none";
        let btn = document.getElementById("viewEvents");
        btn.style.display = "inline";
        btn.onclick = () => viewEvents(groupname);
    }

    /**
     * Function to select the date after today
     * @returns {String} the reformatted today 
     */
    let constraintDate = function() {
        var today = new Date();
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();
        if (day < 10) {
            dd = '0' + dd
        }
        if (month < 10) {
            month = '0' + month
        }
        today = year + '-' + month + '-' + day;
        return today
    }

    /**
     * Displays the new section of creating an event
     * @param {string} groupname - The name of the group being shown
     */
    let createNewEvent = function(groupname) {
        document.getElementById("eventDate").setAttribute("min", constraintDate());
        document.getElementById("newEvent").style.display = "block";
        document.getElementById("groupPage").style.display = "none"

        document.getElementById("createEvent").onclick = function() {
            let eventInput = document.getElementById("eventInput").value
            let locationInput = document.getElementById("locationInput").value
            let dateInput = document.getElementById("eventDate").value
            let commentInput = document.getElementById("commentInput").value
            let data = { eventName: eventInput, location: locationInput, date: dateInput, comments: commentInput, usersGoing: [], createdBy: currentUser, groupName: groupname }
                // addNewEvent(data, groupname)
            if (data.eventName != "" && data.location != "" && data.date != "" && data.comments != "") {
                document.getElementById("map").remove();
                addNewEvent(data, groupname)
                document.getElementById("resetEvent").reset()
            } else {
                alert("You must fill in all the information to create the event")
            }
        };

        let returnGroup = document.getElementById("returnE")
        returnGroup.onclick = function() {
            groupPage.style.display = "block";
            document.getElementById("newEvent").style.display = "None";
            eventInput = " ";
            locationInput = " ";
            dateInput = " ";
            commentInput = " ";
        }
        document.getElementById("newEvent").appendChild(returnGroup)
    }

    /**
     * Function to create a new event
     * @param {Object} data - Containing the event information 
     * @param {string} groupname - The name of the group being shown
     */
    let addNewEvent = function(data, groupName) {
        window.exports.addEvent(data);
        viewEvents(groupName);
    }

    /**
     * Displays the new section of displaying the specific event information in detail
     */
    let landingEvent = async function() {
        let groupPage = document.getElementById("groupPage")
        let eventPage = document.getElementById("eventPage")
        groupPage.style.display = "None"
        eventPage.style.display = "block"
        let eventId = this.id;

        let data = await window.exports.getEventById(eventId);
        let ul = document.createElement("ul")
        let liName = document.createElement("li")
        liName.innerHTML = "Event Name: " + data.eventName;
        let liLocation = document.createElement("li")
        liLocation.innerHTML = "location: " + data.location;
        let liDate = document.createElement("li")
        liDate.innerHTML = "Event Date: " + data.date;
        let liAdmin = document.createElement("li")
        liAdmin.innerHTML = "Admin User: " + data.createdBy;
        let liUsersGoing = document.createElement("li")
        liUsersGoing.innerHTML = "Users going: " + data.usersGoing;
        liUsersGoing.id = "liUsersGoing"
        let liComments = document.createElement("li")
        liComments.innerHTML = "Event Description: " + data.comments;
        ul.appendChild(liName)
        ul.appendChild(liLocation)
        ul.appendChild(liDate)
        ul.appendChild(liAdmin)
        ul.appendChild(liUsersGoing)
        ul.appendChild(liComments)
        eventPage.appendChild(ul);
        let groupName = data.groupName;
        // return to the group page
        let returnGroup = document.createElement("button")
        returnGroup.innerHTML = "Return to the group page"
        returnGroup.onclick = function() {
                groupPage.style.display = "block";
                eventPage.innerHTML = null;
                eventPage.style.display = "None"
            }
            // attend the event
        let attendEvent = document.createElement("button")
        attendEvent.innerHTML = "Join the event";
        attendEvent.id = "eventAtt"
        if (data.usersGoing.indexOf(currentUser) > -1) {
            console.log("already in the user_going")
            attendEvent.style.display = "None"
            attendEvent.onclick = null;
        }
        attendEvent.onclick = () => joinEvent(eventId, currentUser);
        // delete the event 
        let deleteEvent = document.createElement("button")
        deleteEvent.innerHTML = "Delete the event";
        deleteEvent.id = "deleEvent";
        if (currentUser == data.createdBy) {
            deleteEvent.onclick = function() {
                document.getElementById("map").remove();
                delEvent(eventId, groupName);
            }
        } else {
            deleteEvent.onclick = () => { alert("You do not have the permission to delete the event ") }
        }

        eventPage.appendChild(attendEvent);
        eventPage.appendChild(returnGroup);
        eventPage.appendChild(deleteEvent);
    }

    /**
     * Function to join a new event
     * @param {string} eventId  - the Id of the selected event
     * @param {string} currentUser - the current user logged in 
     */
    let joinEvent = function(eventId, currentUser) {
        window.exports.addUserToEvent(eventId, currentUser)
        document.getElementById("eventAtt").style.display = "none"
        document.getElementById("liUsersGoing").innerHTML += ` ${currentUser}`;
    }

    /**
     * Confirms event deletion and refreshes page after deletion
     * @param {string} eventId - The Id of the event
     * @param {string} groupname - The name of the group being displayed
     */
    let delEvent = async function(eventId, groupName) {
        let confirmDelete = confirm("Are you sure you want to delete this event?");
        if (confirmDelete) {
            await window.exports.deleteEvent(eventId);
            document.getElementById("deleEvent").style.display = "none";
            viewEvents(groupName);
        }
    }


})();
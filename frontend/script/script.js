import io from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js'

const socket = io.connect('http://localhost:7000');

const mountNumberConnected = document.querySelector('.mount-number-connected');
const mountChatMessages = document.getElementById('mount-chat-messages');
const chatSendIcon = document.querySelector('.chat-send-icon');

// functs for creating and mounting DOM elements
const getTime = () => {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const time = `${hours}:${minutes} ${ampm}`;
    
    return time;
}

const displayUserSideConnect = (name) => {
    // creating DOM elements
    const div = document.createElement('div');
    const user_name = document.createElement('p');
    const connected_time = document.createElement('p');
    
    // mounting classes
    div.className = 'user-connected';
    user_name.className = 'user-name';
    connected_time.className = 'connected-time';

    const time = getTime();

    // assigning values
    user_name.textContent = name;
    connected_time.textContent = time;

    div.append(user_name, connected_time);

    mountNumberConnected.appendChild(div);

}

const displayMessage = (containerType, timeType, profileType, senRec, message) => {
    // creating DOM elements
    const positionContainer = document.createElement('div');
    const timeStamp = document.createElement('p');
    const profileMsgContainer = document.createElement('div');
    const profilePicContainer = document.createElement('div');
    const profilePicIcon = document.createElement('i');
    const messageContent = document.createElement('div');
    
    const time = getTime();

    // setting classes
    positionContainer.className = `sender--position-container ${containerType}`;
    timeStamp.className = `message-sent-time ${timeType}`;
    profileMsgContainer.className = 'profile-message';
    profilePicContainer.className = `user-sent-profile-pic ${profileType}`;
    profilePicIcon.className = 'fa fa-user';
    messageContent.className = `message ${senRec}`;

    // asigning values
    timeStamp.textContent = time;
    messageContent.textContent = message;

    // appending elements to parents
    profilePicContainer.appendChild(profilePicIcon);
    profileMsgContainer.append(profilePicContainer, messageContent);
    positionContainer.append(timeStamp, profileMsgContainer);

    mountChatMessages.appendChild(positionContainer);
}

// LOGICS
const userName = 'shanas';

socket.on('connect', () => {
    displayUserSideConnect(userName);
})

chatSendIcon.addEventListener('click', (e) => {
    e.preventDefault();
    const Usermessage = document.getElementById('message');
    socket.emit('client-msg', Usermessage.value);

    displayMessage('', '', '', 'sender', Usermessage.value);
    Usermessage.value = '';
})


socket.on('msg-from-server', (msg) => {
    displayMessage('receiver-container', 'receiver-time', 'receiver-profile', 'receiver-message', msg)
})

socket.on('new-member', (id) => {
    displayUserSideConnect(userName);
})
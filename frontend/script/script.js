import io from 'https://cdn.socket.io/4.7.5/socket.io.esm.min.js'

const socket = io.connect('http://localhost:7000');

const mountNumberConnected = document.querySelector('.mount-number-connected');
const mountChatMessages = document.getElementById('mount-chat-messages');
const chatSendIcon = document.querySelector('.chat-send-icon');
const numberConnected = document.querySelector('.number-connected');
const mountAlertNewUser = document.querySelector('.mount-alert-new-user');

const notificationSound = new Audio('./../audio/new-notification.mp3');
const NewUserConnectedSound = new Audio('./../audio/new-user-connected.mp3');

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
    mountChatMessages.scrollTo(0, mountChatMessages.scrollHeight)
    
    if (containerType === 'receiver-container') {
        notificationSound.play();
    }
}

// const connect_disconnect = (user, conndis) => {
//     const connect_disconnect = document.createElement('p');
//     connect_disconnect.textContent = conndis === 'connect' ? `${user} just connected` : `${user}`;
//     connect_disconnect.className = 'connectDisconnect'
//     mountChatMessages.appendChild(connect_disconnect);
// }
const alertNewUser = (user) => {
    const connect_disconnect = document.createElement('div');
    connect_disconnect.textContent = `${user} just got connected!`;
    connect_disconnect.className = 'signal-new-user';
    mountAlertNewUser.className = 'mount-alert-new-user';
    mountAlertNewUser.textContent = '';
    
    window.setTimeout(() => {
        mountAlertNewUser.textContent = '';
        mountAlertNewUser.classList.add('show-mount-alert-new-user');
        mountAlertNewUser.append(connect_disconnect);

        window.setTimeout(() => {
            mountAlertNewUser.classList.remove('show-mount-alert-new-user');
        }, 6000)
    }, 2000)
}

// LOGICS
const userName = sessionStorage.getItem('first-name');

socket.on('disconnect', () => {
    // connect_disconnect(sessionStorage.getItem('first-name'), 'disconnect');
    alertNewUser('user disconnect')
    mountAlertNewUser.textContent = '';
    window.location.reload(true)
})

socket.on('users-list', (users) => {
    console.log('connected users: ', users)
    console.log('nuber users: ', users.length)
    numberConnected.textContent = users.length;
})

// real word to use
socket.emit("login", sessionStorage.getItem('first-name'));

socket.on("online-users", users => {
    console.log(users);
    numberConnected.textContent = users.length;
    mountNumberConnected.textContent = '';
    
    users.forEach(user => {
        // connect_disconnect(user, 'connect')
        alertNewUser(user)
        displayUserSideConnect(user);
    });
});
socket.on('reload-page', () => {
    window.location.reload();
})
// socket.on('reminder', () => {
//     window.location.reload();
//     connect_disconnect('Please, refresh your page to know number of people present!', 'disconnect')
// })

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

// socket.on('new-member', (id) => {
//     displayUserSideConnect(userName);
// })
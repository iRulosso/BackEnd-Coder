const socket = io();

const chats = document.getElementById("chats");

socket.on("getChats", data=>
{
    let infoChats = '';
    data.forEach((c) => {
        infoChats += `${c.user}: ${c.message}</br>`;
    });
    chats.innerHTML = infoChats;
});
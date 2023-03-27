import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = {
    current:io('https://chat-back-socket.onrender.com')
}

export const Chat = () => {
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [user, setUser] = useState('');
    

    useEffect(() => {
        socket.current.on('changeOnline', (size) => {
            setOnlineUsers(size)
        })
    },[]
    )
    useEffect(() => {
       socket.current.on('alertMessage', (data) => {
            setMessageList([...messageList, data])
       });
        socket.current.on('changeOnline', (size) => {
            setOnlineUsers(size)
        });
    },[messageList])

    const handleSubmitName = (e) => {
        e.preventDefault();

        socket.current.emit('addUser', { name: user });
        socket.current.on('messageList', (data)=>{setMessageList(data)})
    }

    const handleSubmitMessage = (e) => {
        e.preventDefault();
        socket.current.emit('newMessage', { text: message, name: user });
        socket.current.on('alertMessage', (data) => {
            setMessageList([...messageList, data])
        });
    }

    return (<>
        <h1>Hallo in this chat!</h1>
        <p>online users: {onlineUsers}</p>
        <form>
            <label>
                Enter your name
                <input type='text' value={user} onChange={(e)=>{setUser(e.currentTarget.value)}} />
            </label>
            <button onClick={handleSubmitName}>Submit</button>
        </form>
        <form>
            <label>
                Enter your message:
                <input type='text' value={message} onChange={(e)=>{setMessage(e.currentTarget.value)}} />
            </label>
            <button onClick={handleSubmitMessage}>Submit</button>
        </form>
        <ul>
            {messageList.map((item) => (<li key={item._id}><span>{ item.name }</span>:<span>{item.text}</span> </li>))}
        </ul>
    </>);
}
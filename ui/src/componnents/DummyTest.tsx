import React, {useState} from 'react'
import axios from "axios";

const DummyTest = () => {
    const [isEnabled, setIsEnabled] = useState(true)
    const [message, setMessage] = useState('OK')

    const turnOn = () => {
        setIsEnabled(false);
        axios.get('test/on').then(() => setMessage('OK'))
            .catch(() => setMessage('dupa'))
            .finally(() => setIsEnabled(true))
    }
    const turnOff = () => {
        setIsEnabled(false);
        axios.get('test/off').then(() => setMessage('OK'))
            .catch(() => setMessage('dupa'))
            .finally(() => setIsEnabled(true))
    }

    return (
        <div>
            <div>{message}</div>
            <button disabled={!isEnabled} onClick={turnOn}>ON</button>
            <button disabled={!isEnabled} onClick={turnOff}>OFF</button>
        </div>
    )
}

export default DummyTest

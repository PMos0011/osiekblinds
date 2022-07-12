import React, {useEffect, useState} from 'react'
import axios from "axios";

const DummyTest = () => {
    const [message, setMessage] = useState('')

    useEffect(() => {
        axios.get("/dummy-test")
            .then(response => setMessage(response.data))
            .catch(() => setMessage('dupa'))
    }, [])
    return <div>{message}</div>
}

export default DummyTest

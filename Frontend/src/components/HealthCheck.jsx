import React, { useState, useEffect } from "react";

function HealthCheck() {

    const [data, setData] = useState();
    useEffect(() => {
    fetch('http://127.0.0.1:5000/health').then(
        response => response.json()).then(
        data => {
            setData(data)
            console.log(data)
        }
        )
       }, [])

    return (
        <div className="health-check">
            <p>Status: ok.</p>
        </div>
    )

}

export default HealthCheck
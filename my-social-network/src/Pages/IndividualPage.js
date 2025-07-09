import { useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
// import axios from 'axios';

const IndividualPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { person } = location.state || {};
    return(
        <div>
            <button onClick={() => navigate('/')}>Home</button>
            <h1>{person.properties?.name} ID:{person.properties?.id}</h1>
            <h1>{person.properties?.birthdate}</h1>
            
        </div>
        
    );


};

export default IndividualPage;
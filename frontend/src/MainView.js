
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProfileGrid from './ProfileGrid';

const MainView = ({ navigate }) => {

    const [profiles, setProfiles] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/v1/profiles`);
                const data = await response.json();

                setProfiles(data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    if (!profiles) {
        return <p></p>;
    }

    return (
        <Box>
            <h1>Featured Artists</h1>
            <ProfileGrid collection={profiles} />
        </Box>
    );
};

export default MainView;

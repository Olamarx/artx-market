
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import ImageGrid from './ImageGrid';

const CollectionView = ({ navigate }) => {
    const { userId, collId } = useParams();

    const [profile, setProfile] = useState(null);
    const [tab, setTab] = useState(null);
    const [collection, setCollection] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!userId) {
                    const response = await fetch(`/api/profile`);
                    const profileData = await response.json();

                    if (!profileData.id) {
                        navigate('/');
                    } else {
                        navigate(`/profile/${profileData.id}/${profileData.defaultCollection}`);
                    }
                } else if (!collId) {
                    const response = await fetch(`/api/profile/${userId}`);
                    const profileData = await response.json();
                    navigate(`/profile/${userId}/${profileData.defaultCollection}`);
                } else {
                    const response = await fetch(`/api/profile/${userId}`);
                    const profileData = await response.json();
                    setProfile(profileData);

                    const response2 = await fetch(`/api/collection/${userId}/${collId}`);
                    const collectionData = await response2.json();

                    setCollection(collectionData);
                    setTab(parseInt(collId, 10));
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, [navigate, userId, collId, refreshKey]);

    if (!profile) {
        return <p>Loading profile...</p>;
    }

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey after a successful upload
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const handleCollectionChange = (event, newIndex) => {
        setTab(newIndex);
        navigate(`/profile/${userId}/${newIndex}`);
    };

    return (
        <>
            <p style={{ textAlign: 'left' }}>Collections</p>
            <Tabs
                value={tab}
                onChange={handleCollectionChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                {profile.collections.map((collection, index) => (
                    <Tab key={index} label={collection.name} />
                ))}
            </Tabs>
            <ImageGrid collection={collection} />
            {tab === 0 && <input type="file" onChange={handleUpload} />}
        </>
    );
};

export default CollectionView;

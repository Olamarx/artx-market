
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import ImageGrid from './ImageGrid';

const CollectionView = ({ navigate }) => {
    const { xid } = useParams();
    const [collection, setCollection] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [credits, setCredits] = useState(0);
    const [disableUpload, setDisableUpload] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const collection = await axios.get(`/api/v1/collections/${xid}`);
                const collectionData = collection.data;

                if (!collectionData.error) {
                    setCollection(collectionData);
                }

                const profile = await axios.get('/api/v1/profile');
                const credits = profile.data.credits;

                setCredits(credits);
                setDisableUpload(credits < 1);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, [navigate, xid, refreshKey]);

    if (!collection) {
        return <p></p>;
    }

    const handleUpload = async (event) => {
        try {
            const files = event.target.files;
            const formData = new FormData();

            for (const file of files) {
                formData.append('images', file);
            }

            const response = await fetch(`/api/v1/collections/${collection.xid}/upload`, {
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

    const handleAddCredits = async () => {
        navigate('/profile/edit/credits');
    };

    return (
        <>
            <span>{collection.asset.title}</span>
            <span style={{ fontSize: '12px' }}>({collection.collection.assets.length} items)</span>
            {collection.isOwnedByUser &&
                <Box>
                    <span style={{ fontSize: '14px' }}>Upload:
                        <input type="file" name="images" accept="image/*" multiple onChange={handleUpload} disabled={disableUpload} />
                    </span>
                    <span style={{ fontSize: '14px' }}>Credits: { credits }</span>
                    <Button variant="contained" color="primary" onClick={handleAddCredits}>
                        Add Credits
                    </Button>
                </Box>
            }
            <ImageGrid collection={collection.collection.assets} />
        </>
    );
};

export default CollectionView;

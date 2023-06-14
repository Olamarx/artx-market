import React, { useEffect, useState } from 'react';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AssetEditor = ({ metadata, setTab }) => {
    const [title, setTitle] = useState(null);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const profileResponse = await fetch('/api/profile');
                const profileData = await profileResponse.json();

                setTitle(metadata.asset.title);
                setSelectedCollection(metadata.asset.collection || 0);
                setCollections(profileData.collections || []);

                if (profileData.xid !== metadata.asset.owner) {
                    console.log(`editor ${profileData.xid} owner ${metadata.asset.owner}`);
                    //navigate(`/image/${metadata.asset.xid}`);
                }
            } catch (error) {
                console.error('Error fetching image metadata:', error);
            }
        };

        fetchMetadata();
    }, [metadata]);

    if (!metadata) {
        return;
    }

    const handleSaveClick = async () => {
        try {
            metadata.asset.title = title;
            metadata.asset.collection = selectedCollection;

            const response = await fetch('/api/asset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata),
            });

            if (response.ok) {
                console.log('Metadata updated successfully');
                setTab(0);
            } else {
                const data = await response.json();
                console.error('Error updating metadata:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Error updating metadata:', error);
        }
    };

    return (
        <form>
            <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="collection-select-label">Collection</InputLabel>
                <Select
                    labelId="collection-select-label"
                    value={selectedCollection}
                    onChange={(e) => setSelectedCollection(e.target.value)}
                >
                    {collections.map((collection, index) => (
                        <MenuItem key={index} value={index}>
                            {collection.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleSaveClick}>
                Save
            </Button>
        </form>
    );
};

export default AssetEditor;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';

const MetadataView = ({ metadata }) => {

    const [owner, setOwner] = useState(0);
    const [collectionId, setCollectionId] = useState(0);
    const [collectionName, setCollectionName] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profResp = await fetch(`/api/profile/${metadata.asset.owner}`);
                const profileData = await profResp.json();
                setOwner(profileData.name);

                const collectionId = metadata.asset.collection || 0;
                const collection = profileData.collections[collectionId];

                setCollectionId(collectionId);
                setCollectionName(collection.name);
            } catch (error) {
                console.error('Error fetching asset owner:', error);
            }
        };

        fetchProfile();
    }, [metadata]);

    if (!metadata) {
        return;
    }

    return (
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Title:</TableCell>
                        <TableCell>{metadata.asset.title}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Owner:</TableCell>
                        <TableCell>
                            <Link to={`/profile/${metadata.asset.owner}`}>{owner}</Link>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Created:</TableCell>
                        <TableCell>{metadata.asset.created}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Updated:</TableCell>
                        <TableCell>{metadata.asset.updated}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>File size:</TableCell>
                        <TableCell>{metadata.file.size} bytes</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Image size:</TableCell>
                        <TableCell>{metadata.image.width} x {metadata.image.height}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Image format:</TableCell>
                        <TableCell>{metadata.image.format}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Collection:</TableCell>
                        <TableCell>
                            <Link to={`/profile/${metadata.asset.owner}/${collectionId}`}>
                                {collectionName}
                            </Link>
                        </TableCell>
                    </TableRow>
                    {/* Add any other metadata you want to display */}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MetadataView;

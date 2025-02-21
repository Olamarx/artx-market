import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import CollectionGrid from './CollectionGrid';
import ImageGrid from './ImageGrid';

const ProfileView = ({ navigate }) => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [tab, setTab] = useState("created");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/v1/profile/${userId}`);
                const profileData = await response.json();
                setProfile(profileData);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfile();
    }, [navigate, userId]);

    if (!profile) {
        return <p></p>;
    }

    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    return (
        <Box>
            <Tabs
                value={tab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab key="created" value="created" label={'Created'} />
                <Tab key="minted" value="minted" label={'Minted'} />
                <Tab key="collected" value="collected" label={'Collected'} />
                <Tab key="listed" value="listed" label={'Listed'} />
                <Tab key="unlisted" value="unlisted" label={'Unlisted'} />
                {profile.isUser && <Tab key="deleted" value="deleted" label={'Deleted'} />}
            </Tabs>
            {tab === 'created' &&
                <div>
                    <p>Collections</p>
                    <CollectionGrid userId={profile.xid} list={profile.collections} />
                </div>
            }
            {tab === 'minted' &&
                <div>
                    <p>Minted</p>
                    <ImageGrid collection={profile.minted} />
                </div>
            }
            {tab === 'collected' &&
                <div>
                    <p>Collected</p>
                    <ImageGrid collection={profile.collected} />
                </div>
            }
            {tab === 'listed' &&
                <div>
                    <p>Listed</p>
                    <ImageGrid collection={profile.listed} />
                </div>
            }
            {tab === 'unlisted' &&
                <div>
                    <p>Unlisted</p>
                    <ImageGrid collection={profile.unlisted} />
                </div>
            }
            {tab === 'deleted' &&
                <div>
                    <p>Deleted</p>
                    <ImageGrid collection={profile.deleted} />
                </div>
            }
        </Box>
    );
};

export default ProfileView;

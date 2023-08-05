import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableRow, TableCell, Tab, Tabs } from '@mui/material';

const AdminView = ({ navigate }) => {

    const [admin, setAdmin] = useState(null);
    const [disableSave, setDisableSave] = useState(false);
    const [disableVerify, setDisableVerify] = useState(false);
    const [tab, setTab] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/v1/admin`);

                if (response.status === 401) {
                    navigate('/');
                    return;
                }

                const admin = await response.json();
                setAdmin(admin);
                setTab('state');
            } catch (error) {
                console.error('Error fetching admin data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    if (!admin) {
        return <p>Loading...</p>;
    }

    const handleClaim = async () => {
        try {
            const response = await fetch('/api/v1/admin/claim');
            const admin = await response.json();
            setAdmin(admin);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const handleSave = async () => {
        setDisableSave(true);
        try {
            const response = await fetch('/api/v1/admin/save');
            const admin = await response.json();
            if (admin.xid) {
                setAdmin(admin);
            }
            else {
                alert("Save failed");
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
        setDisableSave(false);
    };

    const verifyAssets = async () => {
        setDisableVerify(true);
        setLogs([]);

        const response = await fetch('/api/v1/admin/assets');
        const assets = await response.json();
        const logs = [];

        for (const xid of assets) {
            const response = await fetch(`/api/v1/admin/verify/asset/${xid}`);
            const asset = await response.json();

            if (asset.verified) {
                logs.push(`Asset ${xid} ✔`);
            }
            else {
                logs.push(`Asset ${xid} ${asset.error}`);
            }

            setLogs([...logs]);
        }

        setDisableVerify(false);
    };

    const verifyAgents = async () => {
        setDisableVerify(true);
        setLogs([]);

        const response = await fetch('/api/v1/admin/agents');
        const assets = await response.json();
        const logs = [];

        for (const xid of assets) {
            const response = await fetch(`/api/v1/admin/verify/agent/${xid}`);
            const asset = await response.json();

            if (asset.verified) {
                logs.push(`Agent ${xid} ✔`);
            }
            else {
                logs.push(`Agent ${xid} ${asset.error}`);
            }

            setLogs([...logs]);
        }

        setDisableVerify(false);
    };

    if (!admin.owner) {
        return (
            <Button variant="contained" color="primary" onClick={handleClaim}>
                Claim Admin
            </Button>
        )
    }

    return (
        <Box>
            <h1>Admin</h1>
            <div>
                <Tabs
                    value={tab}
                    onChange={(event, newTab) => setTab(newTab)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab key="state" value="state" label={'State'} />
                    <Tab key="verify" value="verify" label={'Verify'} />
                </Tabs>
                {tab === 'state' &&
                    <Box>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>XID</TableCell>
                                    <TableCell>{admin.xid}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>{admin.owner}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Created</TableCell>
                                    <TableCell>{admin.created}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Updated</TableCell>
                                    <TableCell>{admin.updated}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Githash</TableCell>
                                    <TableCell>{admin.githash}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>CID</TableCell>
                                    <TableCell>{admin.cid}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <Button variant="contained" color="primary" onClick={handleSave} disabled={disableSave}>
                            Save All
                        </Button>
                    </Box>
                }
                {tab === 'verify' &&
                    <Box>
                        <textarea
                            value={logs.join('\n')}
                            readOnly
                            style={{ width: '400px', height: '300px', overflow: 'auto' }}
                        />
                        <br></br>
                        <Button variant="contained" color="primary" onClick={verifyAssets} disabled={disableVerify}>
                            Verify Assets
                        </Button>
                        <Button variant="contained" color="primary" onClick={verifyAgents} disabled={disableVerify}>
                            Verify Agents
                        </Button>
                    </Box>
                }
            </div>
        </Box>
    );
};

export default AdminView;

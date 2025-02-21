const dotenv = require('dotenv');

dotenv.config();

const config = {
    name: process.env.ARTX_NAME,
    host: process.env.ARTX_HOST || 'localhost',
    port: process.env.ARTX_PORT || 5000,
    link: process.env.ARTX_LINK || 'http://localhost:5000',
    ipfs: process.env.IPFS_HOST || 'localhost',
    archiver: process.env.ARCHIVER || 'http://localhost:5115',
    block_link: process.env.BLOCK_LINK || 'https://mempool.space/block',
    txn_link: process.env.TXN_LINK || 'https://mempool.space/tx',
    ipfs_link: process.env.IPFS_LINK || 'https://ipfs.io/ipfs',
    depositAddress: process.env.TXN_FEE_DEPOSIT,
    txnFeeRate: process.env.TXN_FEE_RATE || 0.025,
    storageRate: process.env.STORAGE_RATE || 0.001,
    editionRate: process.env.EDITION_RATE || 100,
    uploadRate: process.env.STORAGE_RATE || 0.0001,
    data: 'data',
    uploads: 'data/uploads',
    assets: 'data/assets',
    agents: 'data/agents',
    certs: 'data/certs',
    defaultPfp: 'data/defaultPfp.png',
    newUser: 'GuestUser',
    initialCredits: 10000,
};

module.exports = config;

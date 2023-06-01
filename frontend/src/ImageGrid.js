import React, { useEffect, useState } from 'react';

const ImageGrid = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            const response = await fetch('http://localhost:5000/api/assets');
            const assetFolders = await response.json();

            const imagePromises = assetFolders.map(async (folder) => {
                const metaResponse = await fetch(`http://localhost:5000/uploads/${folder}/meta.json`);
                const metadata = await metaResponse.json();
                return `http://localhost:5000/uploads/${folder}/${metadata.fileName}`;
            });

            const imageUrls = await Promise.all(imagePromises);
            setImages(imageUrls);
        };

        fetchAssets();
    }, []);

    return (
        <div
            className="image-grid"
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gridGap: '16px',
            }}
        >
            {images.map((imageUrl, index) => (
                <img
                    key={index}
                    src={imageUrl}
                    alt={`Image ${index}`}
                    style={{ width: '100%', height: 'auto' }} />
            ))}
        </div>
    );
};

export default ImageGrid;

import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function NewsMap({ articles }) {
  const validArticles = articles.filter(article => 
    article.latitude != null && article.longitude != null
  );

  if (validArticles.length === 0) {
    return null;
  }

  // Calculate center point based on articles
  const center = validArticles.reduce(
    (acc, article) => ({
      lat: acc.lat + article.latitude / validArticles.length,
      lng: acc.lng + article.longitude / validArticles.length,
    }),
    { lat: 0, lng: 0 }
  );

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm">
      <Heading size="md" mb={4}>News Map</Heading>
      <Box height="400px" width="100%">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {validArticles.map(article => (
            <Marker
              key={article.id}
              position={[article.latitude, article.longitude]}
            >
              <Popup>
                <div>
                  <strong>{article.title}</strong>
                  <br />
                  {article.location}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}

export default NewsMap;

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import redCarLogo from "../assets/redcarlogo.png";

const AnimatePanToOrigin = ({ originCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (originCoordinates && Array.isArray(originCoordinates)) {
      const [lat, lng] = originCoordinates;
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setView(originCoordinates, 11, { animate: true });
      } else {
        console.error("Invalid origin coordinates:", originCoordinates);
      }
    }
  }, [map, originCoordinates]);

  return null;
};

const RoutingControlWithAnimation = ({
  originCoordinates,
  destinationCoordinates,
  searchTriggered,
}) => {
  const map = useMap();

  useEffect(() => {
    if (
      searchTriggered &&
      originCoordinates &&
      destinationCoordinates &&
      Array.isArray(originCoordinates) &&
      Array.isArray(destinationCoordinates)
    ) {
      const [originLat, originLng] = originCoordinates;
      const [destLat, destLng] = destinationCoordinates;

      if (
        !isNaN(originLat) &&
        !isNaN(originLng) &&
        !isNaN(destLat) &&
        !isNaN(destLng)
      ) {

        const routingControl = L.Routing.control({
          waypoints: [
            L.latLng(originLat, originLng),
            L.latLng(destLat, destLng),
          ],
          routeWhileDragging: false,
          createMarker: () => null,
        }).addTo(map);

        routingControl.on("routesfound", (e) => {
          const route = e.routes[0];
          const coordinates = route.coordinates;

          const taxiIcon = L.icon({
            iconUrl: redCarLogo, 
            iconSize: [50, 50], 
            iconAnchor: [25, 50], 
          });

          const marker = L.marker([originLat, originLng], { icon: taxiIcon }).addTo(map);

          // Animate the marker along the route
          coordinates.forEach((coord, index) => {
            setTimeout(() => {
              marker.setLatLng([coord.lat, coord.lng]);
            }, 50 * index); // for speed
          });
        });

        // cleanup
        return () => map.removeControl(routingControl);
      } else {
        console.error("Invalid coordinates for routing.");
      }
    }
  }, [map, originCoordinates, destinationCoordinates, searchTriggered]);

  return null;
};

const Maps = ({ originCoordinates, destinationCoordinates, searchTriggered }) => {
  const defaultPosition = [28.613939, 77.209023];

  return (
    <div className="w-full h-full">
      <MapContainer
        center={defaultPosition}
        zoom={15}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          
        />
        {originCoordinates && (
          <Marker position={originCoordinates}>
            <Popup>Origin</Popup>
          </Marker>
        )}
        {destinationCoordinates && (
          <Marker position={destinationCoordinates}>
            <Popup>Destination</Popup>
          </Marker>
        )}
        <AnimatePanToOrigin originCoordinates={originCoordinates} />
        <RoutingControlWithAnimation
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          searchTriggered={searchTriggered}
        />
      </MapContainer>
    </div>
  );
};

export default Maps;

import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function FarmMap({ rover }) {

  return (
    <div style={{ height: "300px", marginTop: "10px" }}>

      <MapContainer
        center={[13.0827, 80.2707]} // Chennai default
        zoom={15}
        style={{ height: "100%", borderRadius: "10px" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[13.0827 + rover.y * 0.001, 80.2707 + rover.x * 0.001]} />

      </MapContainer>

    </div>
  );
}
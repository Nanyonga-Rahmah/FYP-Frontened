import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { FaWalking, FaStop, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "600px",
};


const FarmMap = () => {
  // State definitions
  const [method, setMethod] = useState<"walking" | "selecting" | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [positions, setPositions] = useState<google.maps.LatLngLiteral[]>([]);
  const [polygonPath, setPolygonPath] = useState<
    google.maps.LatLngLiteral[] | null
  >(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Get initial user location to center the map
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting initial position:", error);
        alert(
          "Unable to get your location. Please enable location permissions."
        );
      }
    );
  }, []);

  // Handle walking method with continuous GPS tracking
  useEffect(() => {
    if (!isCollecting || method !== "walking" || !isLoaded) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = { lat: latitude, lng: longitude };
        setPositions((prev) => [...prev, newPoint]);
        setMapCenter(newPoint); // Follow user's position
      },
      (error) => {
        console.error("Geolocation Error:", error);
        alert("Please enable location permissions");
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isCollecting, method, isLoaded]);

  // Function to add a point manually for the selecting method
  const addPoint = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = { lat: latitude, lng: longitude };
        setPositions((prev) => [...prev, newPoint]);
        setMapCenter(newPoint); // Center map on the new point
      },
      (error) => {
        console.error("Error getting position:", error);
        alert("Unable to get your location.");
      }
    );
  };

  // Function to finish collecting points and create polygon
  const finishCollecting = () => {
    if (positions.length < 3) {
      alert("At least 3 points are needed to form a polygon.");
      return;
    }
    setPolygonPath(positions);
    setIsCollecting(false);
  };

  // Start collecting points (for walking method)
  const startCollecting = () => {
    setPositions([]); // Clear previous points
    setIsCollecting(true);
  };

  // Choose a method and reset states
  const chooseMethod = (newMethod: "walking" | "selecting") => {
    setMethod(newMethod);
    setPositions([]);
    setPolygonPath(null);
    setIsCollecting(newMethod === "selecting"); // Start collecting immediately for selecting method
  };

  // Clear all data and reset to initial state
  const clear = () => {
    setMethod(null);
    setIsCollecting(false);
    setPositions([]);
    setPolygonPath(null);
  };

  // Loading and error states
  if (!isLoaded)
    return <div className="text-center text-lg font-bold">Loading map...</div>;
  if (loadError)
    return <div className="text-center text-red-600">Error loading map</div>;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={18}
        mapTypeId={google.maps.MapTypeId.SATELLITE}
      >
        {/* Show markers for each collected point */}
        {positions.map((pos, index) => (
          <Marker
            key={index}
            position={pos}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#00ff00",
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: "#fff",
            }}
          />
        ))}

        {/* Show polyline while collecting points */}
        {isCollecting && positions.length > 1 && (
          <Polyline
            path={positions}
            options={{
              strokeColor: "#ff0000",
              strokeOpacity: 1.0,
              strokeWeight: 4,
              geodesic: true,
            }}
          />
        )}

        {/* Show final polygon outline */}
        {polygonPath && (
          <Polygon
            path={polygonPath}
            options={{
              strokeColor: "#0000ff",
              strokeOpacity: 1.0,
              strokeWeight: 4,
              fillOpacity: 0, // Transparent fill to show only outline
            }}
          />
        )}
      </GoogleMap>

      {/* Dynamic Controls */}
      {polygonPath ? (
        <button
          onClick={clear}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
        >
          <FaTimes className="text-lg" />
          Clear
        </button>
      ) : method === null ? (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={() => chooseMethod("walking")}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FaWalking className="text-lg" />
            Walk Around
          </button>
          <button
            onClick={() => chooseMethod("selecting")}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            <FaMapMarkerAlt className="text-lg" />
            Select Points
          </button>
        </div>
      ) : method === "walking" ? (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          {isCollecting ? (
            <button
              onClick={() => {
                setIsCollecting(false);
                finishCollecting();
              }}
              className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
            >
              <FaStop className="text-lg" />
              Stop Walking
            </button>
          ) : (
            <button
              onClick={startCollecting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              <FaWalking className="text-lg" />
              Start Walking
            </button>
          )}
        </div>
      ) : method === "selecting" ? (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={addPoint}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
          >
            <FaMapMarkerAlt className="text-lg" />
            Add Point
          </button>
          {positions.length >= 3 && (
            <button
              onClick={finishCollecting}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
            >
              Finish
            </button>
          )}
          <p className="text-white bg-gray-800 px-4 py-2 rounded-full">
            Points: {positions.length}
          </p>
        </div>
      ) : null}

      {/* Debug Info */}
      <div className="absolute top-5 right-5 bg-white p-4 shadow-md rounded-xl w-60 text-gray-700">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" /> GPS Info
        </h3>
        <p className="text-sm">
          📍 <b>Points Tracked:</b> {positions.length}
        </p>
        <p className="text-sm">
          🌍 <b>Current Center:</b> {mapCenter.lat.toFixed(6)},{" "}
          {mapCenter.lng.toFixed(6)}
        </p>
        <p
          className={`text-sm mt-2 p-1 rounded text-center ${
            isCollecting
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {isCollecting ? "Tracking in Progress..." : "Tracking Stopped"}
        </p>
      </div>
    </div>
  );
};

export default FarmMap;

import { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import {
  FaWalking,
  FaStop,
  FaMapMarkerAlt,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

const containerStyle = {
  width: "100%",
  height: "90vh",
  "@media (maxwidth: 1200px)": {
    height: "700px",
  },
  "@media (maxWidth: 768px)": {
    height: "100%",
  },
  "@media (maxWidth: 480px)": {
    height: "100%",
  },
};

interface MapProps {
  currentStep: number;
  handleNext: (farmData: {
    polygon: any;
    location: string;
    area: number;
    perimeter: number;
    coordinates: number[][];
    center: { lat: number; lng: number };
  }) => void;
}

const FarmMap = ({ currentStep, handleNext }: MapProps) => {
  const [method, setMethod] = useState<"walking" | "selecting" | null>(null);
  const [locationName, setLocationName] = useState<string>("");

  const [isCollecting, setIsCollecting] = useState(false);
  const [positions, setPositions] = useState<google.maps.LatLngLiteral[]>([]);
  const [polygonPath, setPolygonPath] = useState<
    google.maps.LatLngLiteral[] | null
  >(null);

  const [polygonData, setPolygonData] = useState<
    google.maps.LatLngLiteral[] | null
  >(null);

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const [area, setArea] = useState<number | null>(null);
  const [perimeter, setPerimeter] = useState<number | null>(null);
  const [areaUnit, setAreaUnit] = useState<"sqm" | "ha" | "ac">("sqm");
  const [showMarkers, setShowMarkers] = useState(true);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });

        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(latitude, longitude);

        geocoder.geocode({ location: latLng }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            setLocationName(results[0].formatted_address); // Set the location name
          } else {
            console.error("Geocode failed: " + status);
          }
        });
      },
      (error) => {
        console.error("Error getting initial position:", error);
        alert("Please enable location permissions to continue.");
      }
    );
  }, []);

  useEffect(() => {
    if (!isCollecting || method !== "walking" || !isLoaded) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPoint = { lat: latitude, lng: longitude };
        if (google?.maps?.geometry?.spherical && positions.length > 0) {
          const lastPoint = positions[positions.length - 1];
          const distance =
            google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(lastPoint.lat, lastPoint.lng),
              new google.maps.LatLng(newPoint.lat, newPoint.lng)
            );
          if (distance < 2) return; // Ignore if less than 2 meters
        }

        // if (positions.length > 0) {
        //   const lastPoint = positions[positions.length - 1];
        //   const distance =
        //     google.maps.geometry?.spherical?.computeDistanceBetween(
        //       new google.maps.LatLng(lastPoint.lat, lastPoint.lng),
        //       new google.maps.LatLng(newPoint.lat, newPoint.lng)
        //     );
        //   if (distance < 2) return; // Ignore if less than 2 meters
        // }

        setPositions((prev) => [...prev, newPoint]);
        setMapCenter(newPoint);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to track position. Please check location settings.");
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isCollecting, method, isLoaded, positions]);

  useEffect(() => {
    if (polygonPath && polygonPath.length >= 3) {
      const closedPath = [...polygonPath, polygonPath[0]];

      if (google?.maps?.geometry?.spherical) {
        const areaSqm = google.maps.geometry.spherical.computeArea(closedPath);
        const perimeterM =
          google.maps.geometry.spherical.computeLength(closedPath);
        setArea(areaSqm);
        setPerimeter(perimeterM);
      } else {
        setArea(null);
        setPerimeter(null);
      }
    }
    //   const areaSqm = google.maps.geometry?.spherical?.computeArea(closedPath);
    //   const perimeterM =
    //     google.maps.geometry?.spherical?.computeLength(closedPath);
    //   setArea(areaSqm);
    //   setPerimeter(perimeterM);
    // } else {
    //   setArea(null);
    //   setPerimeter(null);
    // }
  }, [polygonPath]);

  const getAreaDisplay = (areaSqm: number, unit: "sqm" | "ha" | "ac") => {
    switch (unit) {
      case "ha":
        return { value: (areaSqm / 10000).toFixed(3), label: "ha" };
      case "ac":
        return { value: (areaSqm / 4046.856).toFixed(3), label: "ac" };
      default:
        return { value: areaSqm.toFixed(2), label: "sqm" };
    }
  };

  const finalizePolygon = () => {
    if (positions.length < 3) {
      alert("Minimum 3 points required to create a polygon");
      return;
    }
    const closedPolygon = [...positions, positions[0]];
    setPolygonData(closedPolygon);

    console.log("Closed Polygon:", closedPolygon);
    console.log("Positions:", positions);
    console.log("Location Name:", locationName);
    console.log("Map Center:", mapCenter);
    console.log("Area:", area);
    console.log("Perimeter:", perimeter);

    localStorage.setItem("savedPolygon", JSON.stringify(closedPolygon));

    setPolygonPath(closedPolygon);
    setIsCollecting(false);
  };

  useEffect(() => {
    const savedPolygon = localStorage.getItem("savedPolygon");
    if (savedPolygon) {
      setPolygonPath(JSON.parse(savedPolygon));
    }
  }, []);

  const resetMeasurement = () => {
    setMethod(null);
    setIsCollecting(false);
    setPositions([]);
    setPolygonPath(null);
    setArea(null);
    setPerimeter(null);
    localStorage.removeItem("savedPolygon");

  };

  const clearPoints = () => {
    setPositions([]);
    setPolygonPath(null);
    localStorage.removeItem("savedPolygon");
  };

  const startCollection = (method: "walking" | "selecting") => {
    setMethod(method);
    setPositions([]);
    setPolygonPath(null);
    setIsCollecting(method === "walking");
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (method === "selecting" && e.latLng) {
      const newPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setPositions((prev) => [...prev, newPoint]);
    }
  };

  useEffect(() => {
    // Retrieve the saved polygon data when the component loads
    const savedPolygon = localStorage.getItem("savedPolygon");
    if (savedPolygon) {
      setPolygonPath(JSON.parse(savedPolygon));
    }
  }, []);

  if (!isLoaded)
    return (
      <div className="text-center p-4 text-lg font-bold">Loading map...</div>
    );
  if (loadError)
    return (
      <div className="text-center p-4 text-red-600">Map loading failed</div>
    );

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={18}
        mapTypeId={google.maps.MapTypeId.SATELLITE}
        onClick={handleMapClick}
      >
        <Marker
          position={mapCenter}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#FF0000",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
          }}
        />
        {showMarkers &&
          positions.map((pos, i) => (
            <Marker
              key={i}
              position={pos}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: "#00FF00",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 2,
              }}
            />
          ))}
        {isCollecting && positions.length > 1 && (
          <Polyline
            path={positions}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 1,
              strokeWeight: 4,
              geodesic: true,
            }}
          />
        )}
        {polygonPath && (
          <Polygon
            paths={polygonPath}
            options={{
              strokeColor: "#0000FF",
              strokeOpacity: 1,
              strokeWeight: 4,
              fillOpacity: 0,
            }}
          />
        )}
      </GoogleMap>

      {/* Measurement Panel */}
      {polygonPath && (
        <div className="absolute top-40 left-5 bg-white text-black/80 p-4 rounded-xl shadow-lg w-64">
          <h3 className="text-lg font-bold mb-3">Farm Measurements</h3>
          <div className="space-y-2 mb-4">
            <p className="text-sm">
              <span className="font-semibold">Perimeter:</span>{" "}
              {perimeter?.toFixed(2)} meters
            </p>
            <p className="text-sm">
              <span className="font-semibold">Area:</span>{" "}
              {area && getAreaDisplay(area, areaUnit).value}{" "}
              {area && getAreaDisplay(area, areaUnit).label}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value as any)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="sqm">Square Meters</option>
              <option value="ha">Hectares</option>
              <option value="ac">Acres</option>
            </select>
          </div>
          <div className="mb-4">
            <input
              type="checkbox"
              checked={showMarkers}
              onChange={(e) => setShowMarkers(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Show Markers</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={resetMeasurement}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 flex items-center justify-center"
            >
              <FaTimes className="mr-2" /> Clear
            </button>
            <button
              onClick={() => {
                if (!polygonPath) return;

                const coordinates =
                  polygonData?.map((point) => [point.lng, point.lat]) || [];
                const center = mapCenter;

                console.log("Polygon Path:", polygonPath);
                console.log("Polygon Data:", polygonData);
                console.log("Coordinates:", coordinates);
                console.log("Location Name:", locationName);
                console.log("Center:", center);
                console.log("Area:", area);
                console.log("Perimeter:", perimeter);

                handleNext({
                  polygon: {
                    type: "Polygon",
                    coordinates: [coordinates],
                  },
                  location: locationName,
                  area: area || 0,
                  perimeter: perimeter || 0,
                  coordinates: coordinates,
                  center,
                });
              }}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex items-center justify-center"
            >
              Continue <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="absolute top-5 right-5 bg-white p-4 rounded-md w-60 text-gray-700">
        {currentStep === 2 && (
          <div className="">
            <h3 className="text-center text-[#222222] font-bold text-sm">
              Register Your Farm
            </h3>
            <p className="text-center text-[#838383] text-xs">
              Step 2/3 - Mark Location
            </p>
            <div className="flex justify-center gap-2 mt-3 w-full">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 flex-1 rounded-full ${
                    currentStep >= step ? "bg-[#112D3E]" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instruction Panel */}
      <div className="absolute top-32 right-5 bg-white p-4 rounded-md w-60 text-gray-700">
        {currentStep === 2 && (
          <div className="">
            <h3 className="text-center text-[#222222] font-bold text-sm">
              Instructions
            </h3>
            <p className="text-center text-[#838383] text-xs">
              {method === "walking"
                ? "Walk around your farm. Your path is being recorded."
                : "Click on the map to select boundary points for your farm."}
            </p>
          </div>
        )}
      </div>

      {/* GPS Info Section */}
      <div className="absolute top-[230px] right-5 bg-white p-4 shadow-md rounded-xl w-60 text-gray-700">
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

      {/* Control Buttons */}
      {!polygonPath && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          {method === null ? (
            <div className="flex gap-4">
              <button
                onClick={() => startCollection("walking")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center"
              >
                <FaWalking className="mr-2" /> Walk Boundary
              </button>
              <button
                onClick={() => startCollection("selecting")}
                className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 flex items-center"
              >
                <FaMapMarkerAlt className="mr-2" /> Mark Points
              </button>
            </div>
          ) : method === "walking" ? (
            <button
              onClick={finalizePolygon}
              className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 flex items-center"
            >
              <FaStop className="mr-2" /> Stop Tracking
            </button>
          ) : (
            <div className="flex gap-4 items-center">
              <span className="bg-gray-800 text-white px-4 py-2 rounded-full">
                Points: {positions.length}
              </span>
              <button
                onClick={clearPoints}
                className="bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700"
              >
                Clear Points
              </button>
              {positions.length >= 3 && (
                <button
                  onClick={finalizePolygon}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700"
                >
                  Finish
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmMap;

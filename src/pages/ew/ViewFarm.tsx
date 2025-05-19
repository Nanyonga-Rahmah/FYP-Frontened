import {
  GoogleMap,
  useJsApiLoader,
 
  Polygon,
} from "@react-google-maps/api";


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
  farmData: {
    polygon: any;
    location: string;
    area: number;
    perimeter: number;
    coordinates: number[][];
    center: { lat: number; lng: number };
  };
}

const FarmMap = ({ farmData }: MapProps) => {
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry"],
  });

  

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
        zoom={18}
        mapTypeId={google.maps.MapTypeId.SATELLITE}
      >
        {/* Marker for farm center */}
       
        {/* Render polygon if farmData.polygon is present */}
        {farmData && farmData.polygon && (
          <Polygon
            paths={farmData.polygon.coordinates} // Use the passed polygon data
            options={{
              strokeColor: "#0000FF",
              strokeOpacity: 1,
              strokeWeight: 4,
              fillOpacity: 0,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default FarmMap;

import Searchbox from "./components/Searchbox";
import Maps from "./components/Maps";
import { useState } from "react";

function App() {
  const [originCoordinates, setOriginCoordinates] = useState(null);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [searchTriggered, setSearchTriggered] = useState(false); 

  return (
    <div className="flex h-screen">
      <div className="w-96 bg-gray-100">
        <Searchbox
          setOriginCoordinates={setOriginCoordinates}
          setDestinationCoordinates={setDestinationCoordinates}
          setSearchTriggered={setSearchTriggered} 
        />
      </div>
      <div className="flex-grow">
        <Maps
          originCoordinates={originCoordinates}
          destinationCoordinates={destinationCoordinates}
          searchTriggered={searchTriggered} 
        />
      </div>
    </div>
  );
}

export default App;


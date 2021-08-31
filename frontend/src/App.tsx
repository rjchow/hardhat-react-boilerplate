import React from "react";
import "./App.css";
import { Symfoni } from "./hardhat/SymfoniContext";
import { Swap } from "./components/Swap";

function App() {
  return (
    <div className="App">
      <Symfoni autoInit={true}>
        <div className="min-h-screen bg-gray-800">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
            <div className="text-gray-100 text-6xl pt-28 pb-10">
              Swappity Swap
            </div>
            <Swap
              tokenA="0x4C5EB1291EE7982F5562aBA87Dc459f5e76EfdED"
              tokenB="0x00D3B14F6FE51DCb05b0382D0a5E75e17e1D8EAd"
            ></Swap>
          </div>
        </div>
      </Symfoni>
    </div>
  );
}

export default App;

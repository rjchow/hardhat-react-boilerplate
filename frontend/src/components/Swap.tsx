import React, { useContext, useEffect, useState } from "react";
import { ERC20Context } from "../hardhat/SymfoniContext";
import { ERC20 } from "../hardhat/typechain/ERC20";
import ethers from "ethers";
interface Props {
  tokenA: string;
  tokenB: string;
}

export const Swap: React.FC<Props> = ({ tokenA, tokenB }) => {
  const ERC20Factory = useContext(ERC20Context);

  const [tokenAInstance, setTokenAInstance] = useState<ERC20>();
  const [tokenBInstance, setTokenBInstance] = useState<ERC20>();

  const [tokenASymbol, setTokenASymbol] = useState<string>();
  const [tokenBSymbol, setTokenBSymbol] = useState<string>();


  useEffect(() => {
    if (ERC20Factory.instance) {
      setTokenAInstance(ERC20Factory.instance!.attach(tokenA));
      setTokenBInstance(ERC20Factory.instance!.attach(tokenB));
    }

    const fetchTokenSymbols = async () => {
      if (!tokenAInstance || !tokenBInstance) return;

      setTokenASymbol(await tokenAInstance.symbol());
      setTokenBSymbol(await tokenBInstance.symbol());
    };
    fetchTokenSymbols();
  }, [ERC20Factory.instance, tokenA, tokenB]);

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-gray-800 text-4xl">{tokenASymbol}</div>
          <div className="text-gray-800 text-3xl"> to </div>
          <div className="text-gray-800 text-4xl">{tokenBSymbol}</div>
          <div className="flex justify-center">
            <span className="flex-item text-gray-800 text-2xl">Amount:</span>
            <input
              type="text"
              name="Amount"
              id="amount"
              className="mx-2 flex-item shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block  border-gray-300 rounded-md text-gray-800 text-2xl w-1/6 text-center"
              placeholder="20"
            />
          </div>
          <div></div>
          <div className="flex justify-center">
            <span className="flex-item text-gray-800 text-2xl">Receive:</span>
            <input
              type="text"
              name="Receive"
              id="receive"
              disabled
              className="mx-2 flex-item shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block  border-gray-300 rounded-md text-gray-800 text-2xl w-1/6 text-center"
              placeholder="20"
            />
          </div>
          <div></div>
          <div></div>
          <button
            type="submit"
            className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-gray-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Swap!
          </button>
        </div>
      </div>
    </div>
  );
};

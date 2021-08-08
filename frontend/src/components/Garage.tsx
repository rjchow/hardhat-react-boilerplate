import React, { useContext, useEffect, useState } from "react";
import { RobotsContext } from "./../hardhat/SymfoniContext";
import { utils } from "ethers";
import axios from "axios";

const formatIpfsUrl = (url: string) => {
  return url.replace(/ipfs:\/\//g, "https://cloudflare-ipfs.com/");
};

/** Note about Typescript annotations that were added
 
 *  interface NftMetadata was added to provide the shape of the 
 *  data that is used to populate the individual Robot cards
 
 *  two new enums for the statuses were introduced to specify the
 *  all the possible statuses that are used in this component
 * 
 *  the <> after useState tells the compiler what the shape of
 *  the state variables look like
*/
interface NftMetadata {
  id: number;
  name: string;
  image: string;
  description: string;
  owner: string;
}

enum MintedNftStatus {
  UNINITIALIZED = "UNINITIALIZED",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  PENDING = "PENDING",
}

enum PurchaseTransactionStatus {
  UNINITIALIZED = "UNINITIALIZED",
  PENDING_METAMASK = "PENDING_METAMASK",
  PENDING_WALLET = "PENDING_WALLET",
  PENDING_IPFS = "PENDING_IPFS",
  PENDING_SIGNER = "PENDING_SIGNER",
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  SUCCESS = "SUCCESS",
}

export const Garage = () => {
  const [mintedNftState, setMintedNftState] = useState<{
    state: MintedNftStatus;
    data?: NftMetadata[];
  }>({
    state: MintedNftStatus.UNINITIALIZED,
  });
  const [purchaseState, setPurchaseState] = useState<{
    state: PurchaseTransactionStatus;
    transaction?: any;
  }>({
    state: PurchaseTransactionStatus.UNINITIALIZED,
  });

  const modalVisible =
    purchaseState.state === PurchaseTransactionStatus.PENDING_METAMASK ||
    purchaseState.state === PurchaseTransactionStatus.PENDING_SIGNER ||
    purchaseState.state === PurchaseTransactionStatus.PENDING_CONFIRMATION;

  const robots = useContext(RobotsContext);

  const loadRobotsData = async () => {
    setMintedNftState({
      state: MintedNftStatus.PENDING,
    });
    if (!robots.instance) setMintedNftState({ state: MintedNftStatus.ERROR });
    else {
      const totalSupply = Number(await robots.instance.totalSupply());
      
      // generate array with ids of all robots
      // e.g result [0, 1, 2, 3]
      let ids: number[] = [];
      for (let i: number = 0; i < totalSupply; i++) {
        ids.push(i);
      }

      // creates an array of promises that resolve to the token metadata
      const deferredData = ids.map(async (id) => {
        const ipfsUri = await robots.instance!.tokenURI(id);
        const owner = await robots.instance!.ownerOf(id);
        const formattedUri = formatIpfsUrl(ipfsUri);
        const metadata = (await axios.get(formattedUri)).data;
        const formattedImage = formatIpfsUrl(metadata.image);
        return {
          id,
          name: metadata.name,
          image: formattedImage,
          description: metadata.description,
          owner,
        };
      });

      // wait for all promises to resolve
      const data = await Promise.all(deferredData);

      // update the state with the token metadata
      setMintedNftState({
        state: MintedNftStatus.SUCCESS,
        data,
      });
    }
  };
  useEffect(() => {
    console.log("doing useeffect");
    loadRobotsData();
  }, [robots]);

  const handlePurchase = async () => {
    setPurchaseState({ state: PurchaseTransactionStatus.PENDING_SIGNER });
    // Call the purchase method
    const receipt = await robots.instance!.purchase({
      value: utils.parseEther("0.01"),
    });
    setPurchaseState({ state: PurchaseTransactionStatus.PENDING_CONFIRMATION });
    const transaction = await receipt.wait();
    setPurchaseState({ state: PurchaseTransactionStatus.SUCCESS, transaction });

    // Reload the Robots
    await loadRobotsData();
  };
  return (
    <div className="min-h-screen bg-gray-800">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
        <div className="text-gray-100 text-6xl pt-28 pb-10">ROBOTS</div>
        {mintedNftState.state === MintedNftStatus.PENDING && (
          <div className="text-xl text-white">LOADING...</div>
        )}
        {mintedNftState.state === MintedNftStatus.SUCCESS && (
          <div className="grid grid-cols-3 gap-4">
            {mintedNftState.data?.map(
              ({ id, image, name, description, owner }) => {
                return (
                  <div key={id} className="bg-white rounded p-2">
                    <img src={image} className="mx-auto p-4" alt={name} />
                    <div className="text-xl text-black">{name}</div>
                    <div className="text-black">{description}</div>
                    <hr className="my-4" />
                    <div className="text-left text-black text-sm">
                      Owned By:
                    </div>
                    <div className="text-left text-black text-xs">{owner}</div>
                  </div>
                );
              }
            )}
          </div>
        )}
        <div className="mt-12">
          <button
            onClick={handlePurchase}
            type="button"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Buy My Robot
          </button>
        </div>
      </div>
      {modalVisible && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            />
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              ​
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    {purchaseState.state ===
                      PurchaseTransactionStatus.PENDING_METAMASK &&
                      "Connecting Metamask..."}
                    {purchaseState.state ===
                      PurchaseTransactionStatus.PENDING_SIGNER &&
                      "Waiting for Signed Transaction"}
                    {purchaseState.state ===
                      PurchaseTransactionStatus.PENDING_CONFIRMATION &&
                      "Waiting for Block Confirmation"}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {purchaseState.state ===
                        PurchaseTransactionStatus.PENDING_METAMASK &&
                        "Allow Metamask to connect to this application in the extension."}
                      {purchaseState.state ===
                        PurchaseTransactionStatus.PENDING_SIGNER &&
                        "Approve the purchase transaction within the Metamask extension"}
                      {purchaseState.state ===
                        PurchaseTransactionStatus.PENDING_CONFIRMATION &&
                        "Transaction has been sent to the blockchain. Please wait while the transaction is being confirmed."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import { useState, useRef, useEffect } from "react";
import { useGreeting } from "../hooks/useGreeting";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";

const Greeting = () => {
  const [newGreeting, setNewGreeting] = useState<string>("");
  const newGreetingInputRef = useRef<HTMLInputElement>(null);

  const onSetGreetingSuccess = () => {
    toast.success(`Successfully Staked Your Pepe. Go Partyyyy!!!!!`, {
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "light",
      className: "text-sm",
    });
    setNewGreeting("");
    newGreetingInputRef.current?.blur();
  };

  const {
    address,
    greeting,
    getGreetingLoading,
    getGreetingError,
    setGreeting,
    setGreetingLoading,
    prepareSetGreetingError,
    setGreetingError,
  } = useGreeting({ newGreeting, onSetGreetingSuccess });

  useEffect(() => {
    if (!address) {
      setNewGreeting("");
    }
  }, [address]);

  const { openConnectModal } = useConnectModal();

  return (
    <div className="space-y-2">
      {/* <div className="flex flex-col space-y-2">
        <p className="text-sm text-gray-500 text-center font-minecraft tracking-widest">
          Players Online
        </p>
        {getGreetingLoading ? (
          <p className="text-lg text-center text-gray-500 italic font-minecraft tracking-widest">Loading...</p>
        ) : (
          <p
            className={
              !getGreetingError
                ? `text-lg text-center font-minecraft tracking-widest`
                : `text-lg text-center text-red-500 font-minecraft tracking-widest`
            }
          >

            {!getGreetingError
              ? greeting
              : `There was an error getting the data!!!!`}
          </p>
        )}
      </div> */}
      <div className="space-y-8 mb-4">
        <div className="flex flex-col space-y-4">
          {/* <input
            className="border p-4 text-center"
            onChange={(e) => setNewGreeting(e.target.value)}
            placeholder="Write a new greeting"
            ref={newGreetingInputRef}
            disabled={!address}
            value={newGreeting}
          /> */}
          <button
            style={{ backgroundColor: '#22c55e', color: 'white' }}
            className="bg-green-600 mx-auto mb-10 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-8 rounded-md font-minecraft tracking-widest"
            onClick={setGreeting}
            disabled={
              !address ||
              setGreetingLoading ||
              prepareSetGreetingError
            }
          >
            {!setGreetingLoading
              ? `Stake For Pepe`
              : `Staking for your Pepe`}
          </button>
          {!address && (
            <button
              className="text-sm text-gray-500 text-center underline hover:opacity-80 font-minecraft tracking-widest"
              onClick={openConnectModal}
            >
              Connect your wallet to begin
            </button>
          )}
          {/* {address && !newGreeting && (
            <p className="text-sm text-gray-500 text-center font-minecraft tracking-widest">
              Type something to set a new greeting
            </p>
          )} */}
          {setGreetingError && (
            <p className="text-sm text-red-500 text-center font-minecraft tracking-widest">
              There was an error Staking your Pepe
            </p>
          )}
          {newGreeting && prepareSetGreetingError && (
            <p className="text-sm text-red-500 text-center font-minecraft tracking-widest">
              Sorry, only the contract owner can meme
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export { Greeting };

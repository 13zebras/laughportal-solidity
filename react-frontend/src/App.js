import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/laughPortal.json";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allLaughs, setAllLaughs] = useState([]);

  const [inputValue, setInputValue] = useState("");
  // const [laughCount, setLaughCount] = useState("");

  const contractAddress = "0x7E9661d03C6F9A83aD71058590A77c989f4D8B75";

  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account: ", account);
        setCurrentAccount(account);
        getAllLaughs();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllLaughs = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const laughPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const laughs = await laughPortalContract.getAllLaughs();

        const laughsCleaned = laughs.map((laugh) => {
          return {
            address: laugh.laugher,
            message: laugh.message,
            timestamp: new Date(laugh.timestamp * 1000),
            prize: laugh.prize,
          };
        });

        setAllLaughs(laughsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // the following is used with the above getAllLaughs()
  useEffect(() => {
    let laughPortalContract;

    const onNewLaugh = (from, message, timestamp, prize) => {
      console.log("NewLaugh", from, message, timestamp, prize);
      setAllLaughs((prevState) => [
        ...prevState,
        {
          address: from,
          message: message,
          timestamp: new Date(timestamp * 1000),
          prize: prize,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      laughPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      laughPortalContract.on("NewLaugh", onNewLaugh);
    }

    return () => {
      if (laughPortalContract) {
        laughPortalContract.off("NewLaugh", onNewLaugh);
      }
    };
  }, []);

  const laugh = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const laughPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let countBefore = await laughPortalContract.getTotalLaughs();
        console.log("Retrieved total laugh count...", countBefore.toNumber());

        const laughTxn = await laughPortalContract.laugh(inputValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", laughTxn.hash);

        await laughTxn.wait();
        console.log("Mined -- ", laughTxn.hash);

        let countAfter = await laughPortalContract.getTotalLaughs();
        // setLaughCount(countAfter.toNumber());
        console.log("Retrieved total laugh count...", countAfter.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
    console.log(inputValue);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">Our World Needs More Laughter! 🤣</div>

        <div className="bio">
          <p>
            Greetings and Salutations! I'm Tom, and I'm learning to code
            blockchain goodies like smart contracts, dapps, etc.
          </p>
          <p>Please do the following:</p>
        </div>
        <ol className="do">
          <li>Connect your Ethereum wallet.</li>
          <li>
            In the textbox, share a joke, emoji, link to a funny video, or a
            simple 'LOL'.
          </li>
          <li>Click on "Share a Laugh!"</li>
          <li>
            Everyone who shares a laugh has a 25% chance of winning a little bit
            of ETH via the Rinkeby Testnet! Enjoy!
          </li>
        </ol>
        <form>
          <input
            type="text"
            id="laugh-input"
            name="laugh-input"
            placeholder="joke, emoji, video, LOL..."
            onChange={onChangeHandler}
            value={inputValue}
          />
          <label htmlFor="laugh-input">
            Racist, homophobic, bigotted, or offensive material will not be
            tolerated.
          </label>
        </form>
        <button className="laughButton" onClick={laugh}>
          Share a Laugh!
        </button>
        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="connectButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {/*
            <div className="laughs">
               Total Laughs Shared: {laughCount}
            </div>
            */}
        <h3>All Laughs Shared:</h3>
        {allLaughs.map((laugh, index) => {
          return (
            <div key={index} className="allLaughs">
              <div>Address: {laugh.address}</div>
              <div>Time: {laugh.timestamp.toString()}</div>
              <div className="prize">{laugh.prize}</div>
              <div className="message-header">Message:</div>
              <div className="message">{laugh.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;

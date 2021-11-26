import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";

// this is the place to define global variables
function MoralisDappProvider({ children }) {
  // manage the global state of our dapp
  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();

  // these two values must be replaced with the ABI and ContractAddress, respectively.
  const [contractABI, setContractABI] = useState(
    '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"categoryId","type":"bytes32"},{"indexed":false,"internalType":"string","name":"category","type":"string"}],"name":"CategoryCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"contentId","type":"bytes32"},{"indexed":false,"internalType":"string","name":"contentUri","type":"string"}],"name":"ContentAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"postId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"postOwner","type":"address"},{"indexed":true,"internalType":"bytes32","name":"parentId","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"contentId","type":"bytes32"},{"indexed":false,"internalType":"bytes32","name":"categoryId","type":"bytes32"}],"name":"PostCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"postId","type":"bytes32"},{"indexed":true,"internalType":"address","name":"postOwner","type":"address"},{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"uint80","name":"reputationPostOwner","type":"uint80"},{"indexed":false,"internalType":"uint80","name":"reputationVoter","type":"uint80"},{"indexed":false,"internalType":"int40","name":"postVotes","type":"int40"},{"indexed":false,"internalType":"bool","name":"up","type":"bool"},{"indexed":false,"internalType":"uint8","name":"reputationAmount","type":"uint8"}],"name":"Voted","type":"event"},{"inputs":[{"internalType":"string","name":"_category","type":"string"}],"name":"addCategory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_parentId","type":"bytes32"},{"internalType":"string","name":"_contentUri","type":"string"},{"internalType":"bytes32","name":"_categoryId","type":"bytes32"}],"name":"createPost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_categoryId","type":"bytes32"}],"name":"getCategory","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_contentId","type":"bytes32"}],"name":"getContent","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_postId","type":"bytes32"}],"name":"getPost","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"int72","name":"","type":"int72"},{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bytes32","name":"_categoryID","type":"bytes32"}],"name":"getReputation","outputs":[{"internalType":"uint80","name":"","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_postId","type":"bytes32"},{"internalType":"uint8","name":"_reputationTaken","type":"uint8"}],"name":"voteDown","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"_postId","type":"bytes32"},{"internalType":"uint8","name":"_reputationAdded","type":"uint8"}],"name":"voteUp","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
  );
  const [contractAddress, setContractAddress] = useState(
    "0x01973DB1524E7721f30125A8BC77c6e4A5281fc4"
  ); // "0x01973DB1524E7721f30125A8BC77c6e4A5281fc4"

  // capture the current category that the user is in
  // (selected and change no matter the component)
  // in our final dapp, these categories will be different things
  // for example: day0 selected reveals all the posts in that day
  // other example: team0 selected
  const [selectedCategory, setSelectedCategory] = useState({
    categoryId: "0x91", // this is shorthand for the default
    category: "default",
  });

  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(
    () =>
      setWalletAddress(
        web3.givenProvider?.selectedAddress || user?.get("ethAddress")
      ),
    [web3, user]
  );

  return (
    <MoralisDappContext.Provider
      value={{
        walletAddress,
        chainId,
        selectedCategory,
        setSelectedCategory,
        contractABI,
        setContractABI,
        contractAddress,
        setContractAddress,
      }}
    >
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };

import { useState, useEffect } from "react";
// for smart contract interactions (address & abi)
import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useMoralis, useMoralisQuery } from "react-moralis";

const Votes = ({ postId }) => {
  const { Moralis } = useMoralis();
  const [postVotes, setPostVotes] = useState("0");
  // standard functionality from global state (we do every time)
  const { contractABI, contractAddress } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);

  // this data is the hook for new votes
  const { data } = useMoralisQuery(
    "Votes",
    (query) => query.equalTo("postId", postId),
    [],
    { live: true }
  );
  const options = {
    contractAddress: contractAddress,
    functionName: "getPost",
    abi: contractABIJson,
    params: {
      _postId: postId,
    },
  };

  // we want to update when there's more votes
  // the data hook is from useMoralis Query
  useEffect(() => {
    async function getPostVotes() {
      await Moralis.enableWeb3;
      const result = await Moralis.executeFunction(options);
      setPostVotes(result[3]);
    }
    getPostVotes();
  }, [data]);

  return <>{postVotes}</>;
};

export default Votes;

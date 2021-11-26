import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
// fetch the content from ipfs
import { useMoralisQuery, useWeb3ExecuteFunction } from "react-moralis";
import { useEffect, useState, createElement } from "react";
import { Comment, Tooltip, Avatar, message, Divider } from "antd";
import {
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import Blockie from "components/Blockie";
import glStyles from "components/gstyles";
import Votes from "./Votes";

const Post = ({ post }) => {
  const { contentId, postId, postOwner } = post;
  // defining some constants post by post
  const [postContent, setPostContent] = useState({
    title: "default",
    content: "default",
  });
  // data is where the Uri lives
  const { data } = useMoralisQuery("Contents", (query) =>
    query.equalTo("contentId", contentId)
  );
  const [voteStatus, setVoteStatus] = useState();

  // checking for votes thats equal to the current user
  const { data: votes } = useMoralisQuery(
    "Votes",
    (query) => query.equalTo("postId", postId),
    [],
    {
      live: true,
    }
  );

  // contract execution constants
  const { walletAddress, contractABI, contractAddress } = useMoralisDapp();
  const contractABIJson = JSON.parse(contractABI);
  const contractProcessor = useWeb3ExecuteFunction();

  // bringing in ipfs may take a while, so we want a hook
  // so that we rerender when we get new data? https://youtu.be/52BvLrj-KrE?t=4882
  useEffect(() => {
    // ExtractTheUri()
    function extractUri(data) {
      const fetchedContent = JSON.parse(JSON.stringify(data, ["contentUri"]));
      const contentUri = fetchedContent[0]["contentUri"];
      return contentUri;
    }

    // then we get from ipfs (fetches as json)
    async function fetchIPFSDoc(ipfsHash) {
      console.log(ipfsHash);
      const url = ipfsHash;
      const response = await fetch(url);
      return await response.json();
    }

    // await the fetchIPFSdata() and ExtractTheUri()
    async function processContent() {
      const content = await fetchIPFSDoc(extractUri(data));
      setPostContent(content);
    }
    if (data.length > 0) {
      processContent();
    }
  }, [data]);

  useEffect(() => {
    // any votes for this post?
    if (!votes?.length) return null;

    async function getPostVoteStatus() {
      const fetchedVotes = JSON.parse(JSON.stringify(votes));
      fetchedVotes.forEach(({ voter, up }) => {
        if (voter === walletAddress) setVoteStatus(up ? "liked" : "disliked");
      });
      return;
    }

    getPostVoteStatus();
  }, [votes, walletAddress]);

  async function vote(direction) {
    if (walletAddress.toLowerCase() === postOwner.toLowerCase())
      return message.error("You cannot vote on your posts");
    if (voteStatus) return message.error("Already voted, yo");
    const options = {
      contractAddress: contractAddress,
      functionName: direction,
      abi: contractABIJson,
      params: {
        _postId: post["postId"],
        [direction === "voteDown" ? "_reputationTaken" : "_reputationAdded"]: 1,
      },
    };
    await contractProcessor.fetch({
      params: options,
      onSuccess: () => console.log("success"),
      onError: (error) => console.error(error),
    });
  }

  // actions like vote up or vote down
  const actions = [
    <Tooltip key="comment-basic-like" title="Vote Up">
      <span
        style={{
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          marginRight: "16px",
        }}
        onClick={() => vote("voteUp")}
      >
        {createElement(voteStatus === "liked" ? LikeFilled : LikeOutlined)} Vote
        Up
      </span>
    </Tooltip>,
    <span style={{ fontSize: "15px" }}>
      <Votes postId={postId} />
    </span>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span
        style={{
          fontSize: "15px",
          display: "flex",
          alignItems: "center",
          marginLeft: "8px",
        }}
        onClick={() => vote("voteDown")}
      >
        {createElement(
          voteStatus === "disliked" ? DislikeFilled : DislikeOutlined
        )}{" "}
        Vote Down
      </span>
    </Tooltip>,
  ];

  const loading = "";

  const result = (
    // this is a post, not a comment...
    <Comment
      style={{ ...glStyles.card, padding: "0px 15px", marginBottom: "10px" }}
      actions={actions}
      author={<Text strong>{post["postOwner"]}</Text>}
      avatar={
        <Avatar
          src={<Blockie address={post["postOwner"]} scale="4" />}
        ></Avatar>
      }
      content={
        <>
          <Text strong style={{ fontSize: "20px", color: "#333" }}>
            {postContent["title"]}
          </Text>

          {/* this part here is the styling of the post itself, 
          which currently isn't wrapping... 1 minute later it works */}

          <p style={{ fontSize: "15px", color: "#111" }}>
            {postContent["content"]}
          </p>
          <Divider style={{ margin: "15px 0" }} />
        </>
      }
    />
  );
  return postContent["title"] === "default" ? loading : result;
};

export default Post;

import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
import { useState } from "react";
import Posts from "./components/Posts";

import { Avatar, Button } from "antd";
import glStyles from "components/gstyles";
import Blockie from "components/Blockie";
import AddPost from "./components/AddPost";
import Reputation from "components/Reputation";

const Feed = () => {
  const { selectedCategory } = useMoralisDapp();
  const [showAddPost, setShowAddPost] = useState(false);
  let result = null;

  function toggleShowAddPost() {
    setShowAddPost(!showAddPost);
  }

  if (selectedCategory["category"] === "default") {
    result = (
      <div className="col-lg-9">
        <h3> choose a category</h3>
        <div
          style={{
            ...glStyles.card,
            padding: "10px 13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>feed this feed</p>
        </div>
      </div>
    );
  } else {
    result = (
      <div className="col-lg-9">
        <div
          style={{
            ...glStyles.card,
            padding: "10px 13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Avatar src={<Blockie currentWallet />} />
          <h4>
            {" "}
            Your Reputation in {selectedCategory["category"]} is <Reputation />{" "}
          </h4>
          <Button shape="round" onClick={toggleShowAddPost}>
            Post
          </Button>
        </div>
        {/* if its true show it, otherwise show nothing */}
        {showAddPost ? <AddPost /> : ""}
        <Posts />
      </div>
    );
  }

  return result;
};

export default Feed;

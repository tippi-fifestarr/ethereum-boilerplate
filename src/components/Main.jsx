import { useMoralisQuery } from "react-moralis";
import Categories from "./Categories";
import Feed from "./Feed";

// es7 snippets "rafce"
// react-arrow-function-component-element
const Main = () => {
  const queryCategories = useMoralisQuery("Categories");

  // first stringify the data we fetch from the Query,
  // then parse it into json?
  const fetchedCategories = JSON.parse(
    JSON.stringify(queryCategories.data, ["categoryId", "category"])
  );

  console.log(fetchedCategories);
  return (
    <div className="container">
      <h3>User Mission Page (connect to Rinkeby Testnet) </h3>
      <div
        style={{
          display: "flex",
          fontFamily: "Roboto, sans-serif",
          color: "#041836",
          padding: "10px 30px",
          maxWidth: "1200px",
          width: "100%",
          gap: "20px",
        }}
      >
        <Categories categories={fetchedCategories} />
        <Feed />
      </div>
    </div>
  );
};

export default Main;

import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  NavLink,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import ERC20Transfers from "components/ERC20Transfers";

import { Menu, Layout } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Main from "components/Main";
import Contract from "components/Contract/Contract";

const { Header, Footer } = Layout;

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
    marginTop: "130px",
    padding: "10px",
  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = ({ isServerInfo }) => {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis();

  useEffect(() => {
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  return (
    <Layout style={{ height: "100vh", overflow: "auto" }}>
      <Router>
        <Header style={styles.header}>
          <Logo />
          <Menu
            theme="light"
            mode="horizontal"
            style={{
              display: "flex",
              fontSize: "17px",
              fontWeight: "500",
              width: "100%",
              justifyContent: "center",
            }}
            defaultSelectedKeys={["contract"]}
          >
            <Menu.Item key="transfers">
              <NavLink to="/erc20transfers">💸 Transfers</NavLink>
            </Menu.Item>
            <Menu.Item key="contract">
              <NavLink to="/contract">📄 Contract</NavLink>
            </Menu.Item>
          </Menu>

          <div style={styles.headerRight}>
            <Chains />
            <Account />
          </div>
        </Header>
        <div style={styles.content}>
          <Switch>
            <Route path="/erc20transfers">
              <ERC20Transfers />
            </Route>
            <Route path="/contract">
              <Contract />
            </Route>
            <Route path="/main">
              <Main />
            </Route>
            <Route path="/nonauthenticated">
              <h3>Please login using the "Authenticate" button</h3>
            </Route>
          </Switch>
          {isAuthenticated ? (
            <Redirect to="/main" />
          ) : (
            <Redirect to="/nonauthenticated" />
          )}
        </div>
      </Router>
      <Footer style={{ textAlign: "center" }}>
        <new style={{ display: "block" }}>
          ⭐️ Please star this{" "}
          <a
            href="https://github.com/tippi-fifestarr/tiled-hexagons/"
            target="_blank"
            rel="noopener noreferrer"
          >
            boilerplate
          </a>
          , every star makes the Tippi very happy!
        </new>

        <new style={{ display: "block" }}>
          🙋 You have questions? Ask them on the {""}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://forum.moralis.io/t/ethereum-boilerplate-questions/3951/29"
          >
            Moralis forum
          </a>
        </new>

        <new style={{ display: "block" }}>
          📖 Read the SHA-365 documentation{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/tippi-fifestarr/ChainlinkTeamFun/tree/master"
          >
            about Dash-Bored and Tippi Fifestarr
          </a>
        </new>
      </Footer>
    </Layout>
  );
};

export const Logo = () => (
  <h4>
    {" "}
    <a class="link-dark" href="./main">
      {" "}
      SHA-365 (Admin)
    </a>
  </h4>
);
export default App;

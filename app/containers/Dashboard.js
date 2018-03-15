import React, { Component } from "react";
import { connect } from "react-redux";
import SplitPane from "react-split-pane";
import { Link } from "react-router";
import QRCode from "qrcode";
import axios from "axios";
import numeral from "numeral";
import { resetKey } from "../modules/generateWallet";
import FaArrowUpward from "react-icons/lib/fa/arrow-circle-up";
import { NetworkSwitch } from "../components/NetworkSwitch";
import WalletInfo from "../components/WalletInfo";
import TransactionHistory from "../components/TransactionHistory";
import SelectExchange from "../components/SelectExchange";
import Support from "../components/Support";
import Tokens from "../components/Tokens";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { togglePane } from "../modules/dashboard";
import { version } from "../../package.json";
import { log } from "../util/Logs";

import Logout from "../components/Logout";
import Send from "../components/Send";
import SendRPX from "../components/NepTokens/SendRPX";
import SendDBC from "../components/NepTokens/SendDBC";
import SendQLC from "../components/NepTokens/SendQLC";
import SendHP from "../components/NepTokens/SendHP";
import SendBTC from "../components/SendBTC";
import SendLTC from "../components/SendLTC";
import AssetPortfolio from "../components/AssetPortfolio";
import Dashlogo from "../components/Brand/Dashlogo";
import ReactTooltip from "react-tooltip";
import CountUp, { startAnimation } from "react-countup";
import TopBar from "../components/TopBar";
import NewBitcoin from "../components/NewBitcoin";
import ReceiveBitcoin from "../components/ReceiveBitcoin";
import NewLitecoin from "../components/NewLitecoin";
import ReceiveLitecoin from "../components/ReceiveLitecoin";

const refreshBalance = (dispatch, net, address ,btc ,ltc ,eth) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address ,btc ,ltc ,eth).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

const resetGeneratedKey = dispatch => {
  dispatch(resetKey());
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      combinedPrice: 0
    };
  }



  render = () => {
    let sendPaneClosed;
    if (this.props.sendPane == true) {
      sendPaneClosed = "0%";
    } else {
      if (this.props.confirmPane == false) {
        sendPaneClosed = "21%";
      } else {
        sendPaneClosed = "15%";
      }
    }

    let dash = (
      <div className="">
        <WalletInfo />
      </div>
    );

    if (this.props.location.pathname !== "/dashboard") {
      dash = <div />;
    }

    return (
      <div>
        <div id="mainNav" className="main-nav">
          <div className="navbar navbar-inverse">
            <div className="navbar-header">
              <div
                className="logoContainer fadeInDown"
                onClick={() =>
                  refreshBalance(
                    this.props.dispatch,
                    this.props.net,
                    this.props.address,
                    this.props.btc,
                    this.props.ltc,
                    this.props.eth
                  )
                }
              >
                <Dashlogo width={85} />
              </div>

              <div
                id="balance"
                onClick={(event) => {
                  startAnimation(
                  this.totalCountUp
                )
              }}
              >

                <CountUp
                  className="account-balance"
                  end={this.props.combined}
                  duration={2}
                  useEasing={true}
                  useGrouping={true}
                  separator=","
                  decimals={2}
                  decimal="."
                  prefix="$"
                  ref={(countUp) => {
                    this.totalCountUp = countUp;
                  }}
                />

                <span className="bal-usd">USD</span>
                <span className="comb-bal">Available Balance</span>
              </div>

            </div>
            <div className="clearfix" />
            <hr className="dash-hr" />
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link to={"/dashboard"} activeClassName="active">
                    <div className="glyphicon glyphicon-stats" /> Dashboard
                  </Link>
                </li>

                <li>
                  <Link to={"/assetPortfolio"} activeClassName="active">
                    <div className="glyphicon glyphicon-dashboard" /> Portfolio
                  </Link>
                </li>

                <li>
                  <Link to={"/send"} activeClassName="active">
                    <span className="glyphicon glyphicon-send" /> Send
                  </Link>
                </li>

                <li>
                  <Link to={"/receive"} activeClassName="active">
                    <span className="glyphicon glyphicon-qrcode" /> Receive
                  </Link>
                </li>

                <li>
                  <Link to={"/transactionHistory"} activeClassName="active">
                    <span className="glyphicon glyphicon-list-alt" /> Transactions
                  </Link>
                </li>
                <li>
                  <Link to={"/tokenSale"} activeClassName="active">
                    <span className="glyphicon glyphicon-heart" /> Token Sale
                  </Link>
                </li>
                <li>
                  <Link to={"/ledger"} activeClassName="active">
                    <span className="glyphicon glyphicon-th-large" /> Ledger
                  </Link>
                </li>
                <li>
                  <Link to={"/selectExchange"} activeClassName="active">
                    <span className="glyphicon glyphicon-refresh" /> Exchange
                  </Link>
                </li>
                <li>
                  <Link to={"/settings"} activeClassName="active">
                    <span className="glyphicon glyphicon-lock" /> Settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <span className="dashnetwork center">Network: {this.props.net}<br />
          Neo Block: {this.props.blockHeight}
          </span>
          <div className="copyright">&copy; Copyright 2018 Morpheus</div>
        </div>
        <div className="main-container">
        <TopBar />
          {this.props.children}
          {dash}
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  sendPane: state.dashboard.sendPane,
  confirmPane: state.dashboard.confirmPane,
  blockHeight: state.metadata.blockHeight,
  net: state.metadata.network,
  address: state.account.address,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  btc: state.wallet.Btc,
  btcLoggedIn: state.account.btcLoggedIn,
  btcPrivKey: state.account.btcPrivKey,
  btcPubAddr: state.account.btcPubAddr,
  btcLoginRedirect: state.account.btcLoginRedirect,
  ltcPubAddr: state.account.ltcPubAddr,
  ethPubAddr: state.account.ethPubAddr,
  price: state.wallet.price,
  combined: state.wallet.combined,
  btc: state.wallet.Btc,
  ltc: state.wallet.Ltc,
  eth: state.wallet.Eth
});

Dashboard = connect(mapStateToProps)(Dashboard);

export default Dashboard;

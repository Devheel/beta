import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";
import { shell, clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import Delete from "react-icons/lib/md/delete";
import _ from "lodash";
import fs from "fs";
import storage from "electron-json-storage";
import ReactTooltip from "react-tooltip";
import Assets from "./../Assets";
import neoLogo from "../../img/neo.png";
import QRCode from "qrcode.react";
import axios from "axios";

import { setBlockExplorer } from "../../modules/metadata";
import { setKeys } from "../../modules/account";
import { NetworkSwitch } from "../../components/NetworkSwitch";
import { syncTransactionHistory } from "../../components/NetworkSwitch";

import Logo from "./../Brand/LogoBlank";
import NeoLogo from "./../Brand/Neo";
import gitsmLogo from "../../img/gitsm.png";
import twitsmLogo from "../../img/twitsm.png";

let explorer_select;

const { dialog } = require("electron").remote;
const saveKeyRecovery = keys => {
  const content = JSON.stringify(keys);
  dialog.showSaveDialog(
    {
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    },
    fileName => {
      if (fileName === undefined) {
        console.log("File failed to save...");
        return;
      }
      // fileName is a string that contains the path and filename created in the save file dialog.
      fs.writeFile(fileName, content, err => {
        if (err) {
          alert("An error ocurred creating the file " + err.message);
        }
        alert("The file has been succesfully saved");
      });
    }
  );
};

const loadKeyRecovery = dispatch => {
  dialog.showOpenDialog(fileNames => {
    // fileNames is an array that contains all the selected
    if (fileNames === undefined) {
      console.log("No file selected");
      return;
    }
    const filepath = fileNames[0];
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        alert("An error ocurred reading the file :" + err.message);
        return;
      }
      const keys = JSON.parse(data);
      storage.get("keys", (error, data) => {
        _.each(keys, (value, key) => {
          data[key] = value;
        });
        dispatch(setKeys(data));
        storage.set("keys", data);
      });
    });
  });
};

const saveSettings = settings => {
  storage.set("settings", settings);
};

const loadSettings = dispatch => {
  storage.get("settings", (error, settings) => {
    if (
      settings.blockExplorer !== null &&
      settings.blockExplorer !== undefined
    ) {
      dispatch(setBlockExplorer(settings.blockExplorer));
    }
  });
};

const updateSettings = dispatch => {
  saveSettings({ blockExplorer: explorer_select.value });
  dispatch(setBlockExplorer(explorer_select.value));
};

const deleteWallet = (dispatch, key) => {
  storage.get("keys", (error, data) => {
    delete data[key];
    storage.set("keys", data);
    dispatch(setKeys(data));
  });
};

const getLink = (net, address) => {
  let base;
  if (net === "MainNet") {
    base = "https://neotracker.io/address/";
  } else {
    base = "https://testnet.neotracker.io/address/";
  }
  return base + address;
};

const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class Receive extends Component {
  componentDidMount = () => {
    storage.get("keys", (error, data) => {
      this.props.dispatch(setKeys(data));
    });
		syncTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.address
    );
    loadSettings(this.props.dispatch);
  };
	render() {
		console.log(this.props.net);
		return (
			<div>
						<div className="col-xs-8 col-xs-offset-2">
							<div
								className="addressBox-send center animated fadeInDown pointer"
								data-tip
								data-for="qraddTip"
								onClick={() => clipboard.writeText(this.props.address)}
							>
								<QRCode size={150} className="neo-qr" value={this.props.address} />
								<ReactTooltip
									className="solidTip"
									id="qraddTip"
									place="top"
									type="dark"
									effect="solid"
								>
									<span>Click to copy your NEO/NEP5 Address <br />
                  {this.props.address}
                  </span>
								</ReactTooltip>
							</div>
						</div>
						<div className="col-xs-12">
            <input
              className="font-12 ledger-address top-20"
              onClick={() => clipboard.writeText(this.props.address)}
              id="center"
              placeholder={this.props.address}
              value={this.props.address}
            />
					<div className="clearboth" />

          <div className="dash-bar top-10">
            <div
              className="dash-icon-bar"
              onClick={() => clipboard.writeText(this.props.address)}
            >
              <div className="icon-border">
                <span className="glyphicon glyphicon-duplicate" />
              </div>
            Copy Public Address
            </div>

            <div
              className="dash-icon-bar"
              onClick={() =>
                openExplorer(getLink(this.props.net, this.props.address))
              }
            >
              <div className="icon-border">
                <span className="glyphicon glyphicon-link" />
              </div>
            View On Blockchain
            </div>

            <div
              className="dash-icon-bar"
              onClick={() => saveKeyRecovery(this.props.wallets)}
            >
              <div className="icon-border">
                <span className="glyphicon glyphicon-save" />
              </div>
              Export Encrypted Keys
            </div>


          </div>



				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	explorer: state.metadata.blockExplorer,
  wallets: state.account.accountKeys,
  blockHeight: state.metadata.blockHeight,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions
});

Receive = connect(mapStateToProps)(Receive);
export default Receive;

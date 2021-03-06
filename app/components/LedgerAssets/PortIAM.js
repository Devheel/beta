import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import iamLogo from "../../img/bridge.png";

class PortIAM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			iamPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={iamLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
							</div>
							
							<div className="port-price-col">
								<span className="market-price">Bridge $0.00</span>
								<h3>{numeral(
									Math.floor(this.props.iam * 100000) / 100000
								).format("0,0.0000")}<span className="qlink-price"> IAM</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>



			</div>
		);
	}
}

const mapStateToProps = state => ({
	iam: state.wallet.Iam,
	marketIAMPrice: state.wallet.marketIAMPrice,
});

PortIAM = connect(mapStateToProps)(PortIAM);
export default PortIAM;

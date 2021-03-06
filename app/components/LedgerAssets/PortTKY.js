import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import tkyLogo from "../../img/tky.png";

class PortTKY extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tkyPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={tkyLogo}
								alt=""
								width="46"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">The Key {numeral(this.props.marketTKYPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tky * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> TKY</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.tky*this.props.marketTKYPrice).format("$0,0.00")} USD</span>
							</div>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	tky: state.wallet.Tky,
	marketTKYPrice: state.wallet.marketTKYPrice
});

PortTKY = connect(mapStateToProps)(PortTKY);
export default PortTKY;

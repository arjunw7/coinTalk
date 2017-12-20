import React from 'react';
import axios from './axios';
import { Loading }from './loading';

export class Coins extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,LTC&tsyms=USD,EUR&e=Coinbase')
        .then((results) => {
            this.setState({
                bitcoin: results.data.DISPLAY.BTC.USD,
                ethereum: results.data.DISPLAY.ETH.USD,
                litecoin: results.data.DISPLAY.LTC.USD
            })
        })
    }
    render() {
        const { bitcoin, ethereum, litecoin } = this.state;
        if (!this.state.bitcoin) {
            return (
                <Loading />
            )
        }
        var bColor = "green";
        var eColor = "green";
        var lColor = "green";
        if (bitcoin.CHANGEPCT24HOUR < 0) {
            bColor = "red";
        }
        if (ethereum.CHANGEPCT24HOUR < 0) {
            eColor = "red";
        }
        if (litecoin.CHANGEPCT24HOUR < 0) {
            lColor = "red";
        }
        return (
            <div className="coins">
                <div className="coin bitcoin">
                <h2>{bitcoin.FROMSYMBOL} Bitcoin</h2>
                    <ul>
                        <li>Price: {bitcoin.PRICE}</li>
                        <li>24 hour high: {bitcoin.HIGH24HOUR}</li>
                        <li>24 hour low: {bitcoin.LOW24HOUR}</li>
                        <li>24 hour change: <span className={bColor}>{bitcoin.CHANGE24HOUR}</span></li>
                        <li>% change: <span className={bColor}>{bitcoin.CHANGEPCT24HOUR}</span></li>
                        <li>Marketcap: {bitcoin.MKTCAP}</li>
                    </ul>
                </div>
                <div className="coin ether">
                <h2>{ethereum.FROMSYMBOL} Ethereum</h2>
                    <ul>
                        <li>Price: {ethereum.PRICE}</li>
                        <li>24 hour high: {ethereum.HIGH24HOUR}</li>
                        <li>24 hour low: {ethereum.LOW24HOUR}</li>
                        <li>24 hour change: <span className={eColor}>{ethereum.CHANGE24HOUR}</span></li>
                        <li>% change: <span className={eColor}>{ethereum.CHANGEPCT24HOUR}</span></li>
                        <li>Marketcap: {ethereum.MKTCAP}</li>
                    </ul>
                </div>
                <div className="coin litecoin">
                <h2>{litecoin.FROMSYMBOL} Litecoin</h2>
                    <ul>
                        <li>Price: {litecoin.PRICE}</li>
                        <li>24 hour high: {litecoin.HIGH24HOUR}</li>
                        <li>24 hour low: {litecoin.LOW24HOUR}</li>
                        <li>24 hour change: <span className={lColor}>{litecoin.CHANGE24HOUR}</span></li>
                        <li>% change: <span className={lColor}>{litecoin.CHANGEPCT24HOUR}</span></li>
                        <li>Marketcap: {litecoin.MKTCAP}</li>
                    </ul>
                </div>
            </div>
        )
    }
}

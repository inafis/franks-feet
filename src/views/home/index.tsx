import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TokenIcon } from "../../components/TokenIcon";
import { useConnectionConfig } from "../../contexts/connection";
import { useMarkets } from "../../contexts/market";
import { useUserBalance, useUserTotalBalance, useAccountByMint } from "../../hooks";
import { WRAPPED_SOL_MINT } from "../../utils/ids";
import { formatUSD } from "../../utils/utils";
import { useConnection } from "../../contexts/connection";
import { PublicKey, RpcResponseAndContext, TokenAmount } from "@solana/web3.js";
import Countdown from 'react-countdown';
import Moment from 'react-moment';
import moment, { Duration } from 'moment';
export const HomeView = () => {
  const { marketEmitter, midPriceInUSD } = useMarkets();
  const { tokenMap } = useConnectionConfig();
  const [tokenTotal, setTokenTotal] = useState<TokenAmount>()
  const connection = useConnection()
  const [timeTo, setTimeTo] = useState<Duration>()
  const SHDW_ADDRESS = "C3ciBtHiEFnwi7q2GnGGUoN3dFiCSMsKRY3CY5JziXuy";
  const SOL = useUserBalance(WRAPPED_SOL_MINT);
  // const SHDW_ACC = useAccountByMint('C3ciBtHiEFnwi7q2GnGGUoN3dFiCSMsKRY3CY5JziXuy')
  const { balanceInUSD: totalBalanceInUSD } = useUserTotalBalance();

  const SHDW_KEY = new PublicKey('C3ciBtHiEFnwi7q2GnGGUoN3dFiCSMsKRY3CY5JziXuy')

  useEffect(() => {
    const refreshTotal = () => { };
    (async function () {
      let tokenInfo = await connection.getTokenAccountBalance(SHDW_KEY);
      setTokenTotal(tokenInfo.value)
    })()
    let idoClose = moment.duration(moment('4 Jan 2022 09:00:00 EST').diff(moment()));
    console.log(idoClose.hours())
    setTimeTo(idoClose)
    const dispose = marketEmitter.onMarket(() => {
      refreshTotal();
    });

    refreshTotal();

    return () => {
      dispose();
    };
  }, [marketEmitter, midPriceInUSD, tokenMap]);

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col span={24}>
        {tokenTotal?.amount ? (
          <div>
            <h2>Total Raised: {formatUSD.format(parseInt(tokenTotal.uiAmountString as string))}</h2>
            <h2 style={{ display: "inline-flex", alignItems: "center" }}>
              Amount needed before Franks Foot Collection : {formatUSD.format(100000000 - parseInt(tokenTotal.uiAmountString as string))}
            </h2>
            <h2>We're {((parseInt(tokenTotal.uiAmountString as string) / 100000000) * 100).toFixed(2)}% of the way to Frank releasing a Foot Pic NFT Collection! </h2>
            <h2>The IDO ends in: {' '}<Countdown date={Date.parse("4 Jan 2022 09:00:00 EST")} zeroPadTime={0}></Countdown> hours</h2>
            {timeTo? (
              <h2>To reach our goal we need to raise {formatUSD.format((100000000 -parseInt(tokenTotal.uiAmountString as string))/timeTo?.hours())} per hour</h2>
            ):(<h2>Could not calculate remaining raise rate</h2>)}
            
          </div>
        ) : (
          <h2> Could not retrieve token </h2>)}
        <video width="320" height="240" autoPlay muted>
          <source src="/mp4.mp4" type="video/mp4" />
        </video>
      </Col>

      <Col span={24}>
        <div className="builton" />
      </Col>
    </Row>
  );
};

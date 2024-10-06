"use client";
import React from 'react'
import Appbar from "@/components/Appbar/page";


import SwapContract from "@/app/swapcontract/page";


import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import { WalletModalProvider,WalletDisconnectButton,WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';



const page= () =>{
  return (
<div style={{width: "100vw"}}>
      <ConnectionProvider endpoint={"https://api.mainnet-beta.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: 20
              }}>
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
           <Appbar/>
           <SwapContract/>
            </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default page
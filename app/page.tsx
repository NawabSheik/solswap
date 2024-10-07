"use client";
import React from 'react'
import Appbar from "@/components/Appbar/page";
import SwapContract from "@/app/swapcontract/page";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import { WalletModalProvider} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const Page= () =>{
  return (
    <div className='bg-black '>
      <ConnectionProvider endpoint={"https://api.mainnet-beta.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
                <Appbar/>
              
                <SwapContract/>
            </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  )
}

export default Page
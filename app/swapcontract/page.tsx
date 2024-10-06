"use client";

import {VersionedTransaction,PublicKey} from "@solana/web3.js";
import axios from "axios";
import React ,{useEffect,useState} from "react";
import { useConnection,useWallet } from "@solana/wallet-adapter-react";




export default function Page() {
  
    const {connection}=useConnection();
    const wallet=useWallet();

    const [inputMint,setInputMint]=useState('');
    const [outputMint,setOutputMint]=useState('');
    const [amount,setAmount]=useState('');
    const[slippageBps, setSlippageBps]=useState('');
    const [response,setResponse]=useState(null);

    const inputMintOptions=[
        {value:'So11111111111111111111111111111111111111112',label:'Solana'},
        {value:'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',label:'Bonk'},
        {value:'7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',label:'Ether'},

    ];

    const outputMintOptions=[
        {value:'So11111111111111111111111111111111111111112',label:'Solana'},
        {value:'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',label:'Bonk'},
        {value:'7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',label:'Ether'},

    ];
    
    async function getQuote(e){
        e.preventDefault();
       
        const res=await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`)
        setResponse(res.data);
       
        const quoteResponse=res.data;
        console.log(quoteResponse);
        return quoteResponse;
    }

    async function swap(e){
        e.preventDefault();
      
        try {
            const quoteResponse=await getQuote(e);
            if(!quoteResponse){
                throw new Error('Quote response is not available');
            }
            const { data: { swapTransaction } } = await (
                await axios.post('https://quote-api.jup.ag/v6/swap', {
                    quoteResponse,
                    userPublicKey: wallet.publicKey.toString(),
                })
            );
            console.log("swapTransaction");
            const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
            var transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            console.log('Deserialized transaction: ',transaction);

            const signedTransaction=await wallet.signTransaction(transaction);
            console.log("Signed Transaction: ", signedTransaction);

              
            
            const latestBlockHash = await connection.getLatestBlockhash();
    
            // Execute the transaction
            const rawTransaction = signedTransaction.serialize()
            const txid = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2
            });
            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txid
            });
            console.log(`https://solscan.io/tx/${txid}`);
          } catch(e) {
            console.log(e)
          }
          
    }
    return (
        <div>
            <h1>Swap Contract</h1>
            <form onSubmit={getQuote}>
                <div>
                    <label>
                        Input Mint:
                        <select value={inputMint} onChange={(e) => setInputMint(e.target.value)} required>
                            <option value="" disabled>Select Input Mint</option>
                            {inputMintOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>  
                    </label>
                </div>
                <div>
                    <label>
                        Output Mint:
                        <select value={outputMint} onChange={(e) => setOutputMint(e.target.value)} required>
                            <option value="" disabled>Select Output Mint</option>
                            {outputMintOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Slippage Limit:
                        <input
                            type="number"
                            value={slippageBps}
                            onChange={(e) => setSlippageBps(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Get Quote</button>
                </div>
            </form>
            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
            <button onClick={swap} className='btn'>Swap Token</button>
        </div>
    )
}

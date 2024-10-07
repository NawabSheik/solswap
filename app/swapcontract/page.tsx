"use client";

import {VersionedTransaction} from "@solana/web3.js";
import axios from "axios";
import React ,{useState} from "react";
import { useConnection,useWallet } from "@solana/wallet-adapter-react";





export default function Page() {
  
    const {connection}=useConnection();
    const wallet=useWallet();

    const [inputMint,setInputMint]=useState('');
    const [outputMint,setOutputMint]=useState('');
    const [amount,setAmount]=useState('0');
    const [response,setResponse]=useState(null);
    const [outAmount, setOutAmount] = useState('GET QUOTE');

    const inputMintOptions=[
        {value:'So11111111111111111111111111111111111111112',label:'SOL'},
        {value:'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',label:'BONK'},
        {value:'7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',label:'Ether'},

    ];

    const outputMintOptions=[
        {value:'So11111111111111111111111111111111111111112',label:'SOL'},
        {value:'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',label:'BONK'},
        {value:'7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',label:'Ether'},

    ];
    
    async function getQuote(e){
        e.preventDefault();
       
        const res=await axios.get(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=300`)
        setResponse(res.data);
        console.log(response);
        setOutAmount(res.data.outAmount);
       
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
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
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
        <div className="swap-contract">
            <div className="swap-div">
            <h1 className="text-4xl font-bold mb-2">Flip the Coin</h1>
            
            <div >
            <form onSubmit={getQuote}>
                <div className="styled-div">
                    <label>
                       <h2 className="text-lg">You&apos;re Selling</h2>
                        <select value={inputMint} onChange={(e) => setInputMint(e.target.value)} required className="selection">
                          
                            {inputMintOptions.map((option)   => (
                                <option key={option.value} className="text-lg bg-black token-options" value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>  
                    </label>
                    <label>
                       
                        <input
                            value={amount}
                            className="input-section"
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="styled-div">
                    <label>
                       <h2 className="text-lg">You&apos;re Buying</h2>
                       <select value={outputMint} onChange={(e) => setOutputMint(e.target.value)} required className="selection">
                           
                           {outputMintOptions.map((option) => (
                               <option key={option.value} value={option.value} className="text-lg bg-black token-options">
                                   {option.label}
                               </option>
                           ))}
                       </select>
                    </label>

                    <label>
                    <button type="submit">
                     <h2 className="input-section">{outAmount}</h2>
                     </button>
                   </label>
                </div>
                <div>
                </div>
                {/* <div className="styled-div">
                    <label>

                            <h2 className="text-lg">Slippage Limit</h2>
                        <input
                            type="number"
                            value={slippageBps}
                            onChange={(e) => setSlippageBps(e.target.value)}
                            required
                            className="input-section"
                            
                        />
                    </label>
                    <button type="submit">Get Quote</button>
                </div> */}
            </form>
            <button onClick={swap} className='swap-btn'>Swap Token</button>
        </div>
        </div>
        </div>
    )
}

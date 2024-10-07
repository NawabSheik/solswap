import React from 'react';
import Image from 'next/image';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';


const page = () => {
  return (
    <div style={{display:"flex",flexDirection:"row", width:"100vw", justifyContent:"space-between", padding:"20px"}}>
   
        <Image className='p-2'  src="/logo.png" alt="logo" width="200" height="100"/>
   
      
        <WalletMultiButton className='h-48'/>
     
    </div>
  )
}

export default page
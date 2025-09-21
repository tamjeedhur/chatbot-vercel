import { useState, useEffect } from "react";
import { ethers } from "ethers";

const useMetamask = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
      const ethSigner = ethProvider.getSigner();
      setSigner(ethSigner);

      const fetchAccount = async () => {
        try {
          const accounts = await window?.ethereum?.request({
            method: "eth_requestAccounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error("Error fetching account:", error);
        }
      };

      fetchAccount();
    }
  }, []);

  const connectMetaMask = async () => {
    setLoading(true);
    try {
      if (!provider) {
        throw new Error("Provider not available");
      }
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const message = "Please sign this message to authenticate";
      if (signer) {
        const signature = await signer.signMessage(message);
        return { address: accounts[0], signature };
      }
    } catch (error) {
      console.error("Error connecting MetaMask:", error);
    } finally {
      setLoading(false);
    }
    return { address: null, signature: null };
  };

  return { connectMetaMask, account, loading };
};

export default useMetamask;

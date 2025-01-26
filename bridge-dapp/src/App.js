import './App.css';

import React, { useState } from 'react';

// 1. MetaMask SDK
import { MetaMaskSDK } from '@metamask/sdk';

// 2. Ethers (para interactuar con el contrato en Ethereum)
import { BrowserProvider, Contract, parseUnits } from 'ethers';

// 3. Sui Wallet Kit
import { WalletKitProvider, ConnectButton } from '@mysten/wallet-kit';

function App() {
  // Estado para cuentas, montos, dirección de puente, etc.
  const [ethAccount, setEthAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [direction, setDirection] = useState("ETH_TO_SUI");

  // Instancia MetaMask SDK y obtiene el provider. Hazlo fuera del componente o dentro (lazy):
  const MMSDK = new MetaMaskSDK({
    // Opciones que necesites (autoConnect, logging, etc.)
    useDeeplink: false,
    autoConnect: false,
  });
  const ethereum = MMSDK.getProvider(); // similar a window.ethereum

  // Dirección del contrato IBT desplegado en Ethereum
  const IBT_ETH_ADDRESS = "0xTU_DIRECCION_IBT"; // Reemplaza con la dirección real

  // ABI de tu contrato (importa desde un archivo JSON o define aquí)
  const IBT_ETH_ABI = [
    // Reemplaza con el ABI real de tu contrato
    "function burn(uint256 amount) public",
    "function mint(address recipient, uint256 amount) public"
  ];

  // ─────────────────────────────────────────────────────────
  // CONEXIÓN A METAMASK VIA SDK
  // ─────────────────────────────────────────────────────────
  async function connectMetamask() {
    try {
      if (!ethereum) {
        alert("MetaMask no está disponible. Instala la extensión o revisa tu configuración.");
        return;
      }
      // Pide cuentas al usuario
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      setEthAccount(accounts[0]);
      console.log("Conectado a MetaMask:", accounts[0]);
    } catch (err) {
      console.error("Error al conectar Metamask:", err);
    }
  }

  // ─────────────────────────────────────────────────────────
  // LÓGICA DE PUENTE
  // ─────────────────────────────────────────────────────────
  // Mantén la misma funcionalidad: quema en la cadena de origen y
  // mintea en la cadena de destino. Solo cambiamos la parte de conexión.

  async function handleBridge() {
    if (!amount) {
      alert("Introduce una cantidad válida.");
      return;
    }

    if (direction === "ETH_TO_SUI") {
      await ethToSui();
    } else {
      await suiToEth();
    }
  }

  // Ejemplo quemar en ETH y luego mintear en Sui
  async function ethToSui() {
    try {
      if (!ethAccount) {
        alert("Primero conecta MetaMask.");
        return;
      }

      // 1. Conecta ethers usando el provider de MetaMask SDK
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // 2. Llama a burn en tu contrato IBT
      const ibtContract = new Contract(IBT_ETH_ADDRESS, IBT_ETH_ABI, signer);
      const burnAmount = parseUnits(amount, 18);
      const txBurn = await ibtContract.burn(burnAmount);
      await txBurn.wait();
      console.log("Tokens quemados en ETH.");

      // 3. Llamar a la lógica de mintear en Sui
      //    Esto se hace con la Sui wallet. Podemos pedir al usuario que conecte
      //    con el <ConnectButton /> (ver abajo).
      alert("Ahora mintea en Sui (ejemplo). Implementa la llamada a tu módulo Move con wallet-kit.");
      // Podrías hacer algo como:
      /*
      const txb = new TransactionBlock();
      txb.moveCall({
        target: `0xTU_PACKAGE_ID::IBT::mint_and_transfer`,
        arguments: [txb.pure(suiAccount), txb.pure(Number(amount))],
      });
      // ... firmar y ejecutar con wallet-kit ...
      */

    } catch (err) {
      console.error("Error en ETH_TO_SUI:", err);
    }
  }

  // Ejemplo quemar en Sui y luego mintear en ETH
  async function suiToEth() {
    try {
      // 1. Quema en Sui: llama `burn` en tu módulo Move con la wallet Sui.
      alert("Primero quema en Sui (ejemplo). Implementa la llamada a tu módulo Move con wallet-kit.");

      // 2. Mintear en Ethereum usando ethers
      if (!ethAccount) {
        alert("Conecta MetaMask para mintear en ETH.");
        return;
      }
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const ibtContract = new Contract(IBT_ETH_ADDRESS, IBT_ETH_ABI, signer);
      const mintAmount = parseUnits(amount, 18);
      const txMint = await ibtContract.mint(ethAccount, mintAmount);
      await txMint.wait();
      console.log("Tokens minteados en ETH.");

    } catch (err) {
      console.error("Error en SUI_TO_ETH:", err);
    }
  }

  // ─────────────────────────────────────────────────────────
  // RENDER DEL COMPONENTE
  // ─────────────────────────────────────────────────────────
    return (
  <WalletKitProvider>
    <div className="app">
      <h1>Mi Bridge dApp (ETH ↔ Sui)</h1>
      <div className="wallet-section">
        <button className="connect-button" onClick={connectMetamask}>
          Conectar MetaMask
        </button>
        <p className="eth-account">Cuenta ETH: {ethAccount}</p>
      </div>
      <ConnectButton className="sui-wallet-button" />
      <div className="bridge-container">
        <label htmlFor="amount" className="bridge-label">
          Monto a puentear:
        </label>
        <input
          type="number"
          id="amount"
          className="bridge-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Cantidad..."
        />
        <select
          className="bridge-select"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="ETH_TO_SUI">ETH → Sui</option>
          <option value="SUI_TO_ETH">Sui → ETH</option>
        </select>
        <button className="bridge-button" onClick={handleBridge}>
          Bridge!
        </button>
      </div>
    </div>
  </WalletKitProvider>
);
}
export default App;

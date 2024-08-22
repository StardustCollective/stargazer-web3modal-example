import React, { useEffect, useState } from "react";

import { useStargazerWallet } from "@stardust-collective/web3-react-stargazer-connector";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSignMessage } from "wagmi";

const STARGAZER_EIP_6963_RDNS = "io.stargazerwallet";

function App() {
  const w3mModal = useWeb3Modal();
  const wagmiAccount = useAccount();
  const wagmiSignMessage = useSignMessage();
  const stargazerWallet = useStargazerWallet();
  const [signedPayloads, setSignedPayloads] = useState<Record<string, any>>({});

  const doSignEVMData = async () => {
    if (!wagmiAccount.address) {
      return;
    }

    const payload = "Sign this ethereum sample payload";
    const signature = await wagmiSignMessage.signMessageAsync({
      message: payload,
    });
    setSignedPayloads((p) => ({ ...p, ETH: { payload, signature } }));
  };

  const doSignDAGData = async () => {
    if (!stargazerWallet.active) {
      return;
    }

    const payload = "Sign this constellation sample payload";
    const signature = await stargazerWallet.provider.request({
      method: "dag_signData",
      params: [stargazerWallet.account, window.btoa(JSON.stringify(payload))],
    });
    setSignedPayloads((p) => ({ ...p, DAG: { payload, signature } }));
  };

  useEffect(() => {
    if (
      (wagmiAccount.status === "connected" ||
        wagmiAccount.status === "reconnecting") &&
      wagmiAccount.connector?.id === STARGAZER_EIP_6963_RDNS
    ) {
      stargazerWallet.activate();
    }
  }, [wagmiAccount.status, wagmiAccount.connector]);

  // @ts-ignore
  window.debugStargazer = { w3mModal, wagmiAccount, stargazerWallet };

  return (
    <div className="App">
      <h1>Wallet Connect :: web3modal :: connect example</h1>
      <h2>Connect wallet</h2>
      <button onClick={() => w3mModal.open()}>Open Modal</button>
      <h2>Connection info</h2>
      <p>
        <b>Status:</b>
        <br />
        {wagmiAccount.status}
        <br />
        <br />
        <b>Connected EVM Account:</b>
        <br />
        {wagmiAccount.address}
        <br />
        <br />
        <b>Connected DAG Account:</b>
        <br />
        {stargazerWallet.active && stargazerWallet.account}
        <br />
      </p>
      <h2>Interact with wallet</h2>
      <button onClick={doSignDAGData}>Sign constellation payload</button>
      <br />
      <button onClick={doSignEVMData}>Sign ethereum payload</button>
      <h2>Signed payloads</h2>
      <pre>{JSON.stringify(signedPayloads, null, 2)}</pre>
    </div>
  );
}

export default App;

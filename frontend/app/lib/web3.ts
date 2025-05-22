import Web3 from "web3";
import storage from "node-persist";
import { hdkey } from "ethereumjs-wallet";
import HDWalletProvider from "@truffle/hdwallet-provider";

const provider: any = new HDWalletProvider({
  mnemonic: {
      phrase: process.env.NEXT_PUBLIC_MNEMONIC as string
  },
  providerOrUrl: process.env.NEXT_PUBLIC_GANACHE_URL as string,
  numberOfAddresses: 10 // Load first 10 accounts
}); 
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_GANACHE_URL as string)
// ); // Adjust port if needed

const web3 = new Web3(provider)
const contractABI: any[] = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_child",
        type: "address",
      },
    ],
    name: "AccountActivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "parent",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "child",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "childName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "age",
        type: "uint8",
      },
    ],
    name: "AccountCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_child",
        type: "address",
      },
    ],
    name: "AccountDeactivated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "parent",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "child",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "DepositMade",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_add",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_add2",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawalMade",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isParent",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "kidAccounts",
    outputs: [
      {
        internalType: "address",
        name: "parent",
        type: "address",
      },
      {
        internalType: "string",
        name: "parentName",
        type: "string",
      },
      {
        internalType: "address",
        name: "child",
        type: "address",
      },
      {
        internalType: "string",
        name: "childName",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "age",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "withdrawLimit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastDeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nextAllowanceTime",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "hasGuardianApproval",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isAccountActive",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_child",
        type: "address",
      },
      {
        internalType: "string",
        name: "_childName",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_age",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "parentName",
        type: "string",
      },
    ],
    name: "createAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_kid",
        type: "address",
      },
    ],
    name: "getKid",
    outputs: [
      {
        internalType: "address",
        name: "parent",
        type: "address",
      },
      {
        internalType: "address",
        name: "child",
        type: "address",
      },
      {
        internalType: "string",
        name: "childName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "parentName",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_add",
        type: "address",
      },
    ],
    name: "checkIfParent",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "checkIfChild",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_child",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amountInEther",
        type: "uint256",
      },
    ],
    name: "setAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_child",
        type: "address",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_add",
        type: "address",
      },
    ],
    name: "activateAccont",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_child",
        type: "address",
      },
    ],
    name: "checkAndDeactivateAccount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_child",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS; // Replace with deployed contract address

const contract = new web3.eth.Contract(contractABI, contractAddress);

await storage.init();
// await storage.clear();
const getNewAddress = async () => {
  try {
    const usedIndexes: number[] = (await storage.getItem("usedIndexes")) || [];

    let newIndex = 0;
    while (usedIndexes.includes(newIndex)) newIndex++;

    usedIndexes.push(newIndex);
    await storage.setItem("usedIndexes", usedIndexes);

    // const hdWallet = hdkey.fromMasterSeed(
    //   process.env.NEXT_PUBLIC_MNEMONIC as unknown as string | any
    // );
    // const wallet = hdWallet
    //   .derivePath(`m/44'/60'/0'/0/${newIndex}`)
    //   .getWallet();
    // const newAddress = `0x${wallet.getAddress().toString("hex")}`;

    const accounts = await web3.eth.getAccounts();
    // console.log("New Ethereum Address:", accounts[newIndex]);
    return accounts[newIndex];
  } catch (error) {
    console.error("Error generating address:", error);
  }
};

export { web3, contract, getNewAddress };

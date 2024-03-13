const ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "header",
        type: "string",
      },
    ],
    name: "setHeader",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rootHash",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default ABI;

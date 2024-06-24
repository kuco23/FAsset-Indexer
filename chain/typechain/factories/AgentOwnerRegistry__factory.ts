/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../common";
import type {
  AgentOwnerRegistry,
  AgentOwnerRegistryInterface,
} from "../AgentOwnerRegistry";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IGovernanceSettings",
        name: "_governanceSettings",
        type: "address",
      },
      {
        internalType: "address",
        name: "_initialGovernance",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_supportRevoke",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "managementAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "iconUrl",
        type: "string",
      },
    ],
    name: "AgentDataChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes",
        name: "encodedCall",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "encodedCallHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowedAfterTimestamp",
        type: "uint256",
      },
    ],
    name: "GovernanceCallTimelocked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "initialGovernance",
        type: "address",
      },
    ],
    name: "GovernanceInitialised",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "governanceSettings",
        type: "address",
      },
    ],
    name: "GovernedProductionModeEntered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "encodedCallHash",
        type: "bytes32",
      },
    ],
    name: "TimelockedGovernanceCallCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "encodedCallHash",
        type: "bytes32",
      },
    ],
    name: "TimelockedGovernanceCallExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "value",
        type: "address",
      },
    ],
    name: "Whitelisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "value",
        type: "address",
      },
    ],
    name: "WhitelistingRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "managementAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "prevWorkAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "workAddress",
        type: "address",
      },
    ],
    name: "WorkAddressChanged",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "addAddressToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_addresses",
        type: "address[]",
      },
    ],
    name: "addAddressesToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "allowAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_encodedCall",
        type: "bytes",
      },
    ],
    name: "cancelGovernanceCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_encodedCall",
        type: "bytes",
      },
    ],
    name: "executeGovernanceCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_managementAddress",
        type: "address",
      },
    ],
    name: "getAgentDescription",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_managementAddress",
        type: "address",
      },
    ],
    name: "getAgentIconUrl",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_managementAddress",
        type: "address",
      },
    ],
    name: "getAgentName",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_workAddress",
        type: "address",
      },
    ],
    name: "getManagementAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_managementAddress",
        type: "address",
      },
    ],
    name: "getWorkAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "governance",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "governanceSettings",
    outputs: [
      {
        internalType: "contract IGovernanceSettings",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IGovernanceSettings",
        name: "_governanceSettings",
        type: "address",
      },
      {
        internalType: "address",
        name: "_initialGovernance",
        type: "address",
      },
    ],
    name: "initialise",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isExecutor",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "isWhitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "productionMode",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "revokeAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_allowAll",
        type: "bool",
      },
    ],
    name: "setAllowAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerWorkAddress",
        type: "address",
      },
    ],
    name: "setWorkAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "supportsRevoke",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "switchToProductionMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_managementAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_description",
        type: "string",
      },
      {
        internalType: "string",
        name: "_iconUrl",
        type: "string",
      },
    ],
    name: "whitelistAndDescribeAgent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b5060405162001b2238038062001b22833981016040819052620000349162000214565b828282828262000045828262000062565b5050151560805250506000805460ff19169055506200026c915050565b7f2aa47ee5db910f3b2a06970c443249cc77dbd9f96100cfebc1775ab7fb1d18248054600160a01b900460ff1615620000e25760405162461bcd60e51b815260206004820152601460248201527f696e697469616c6973656420213d2066616c736500000000000000000000000060448201526064015b60405180910390fd5b6001600160a01b0383166200013a5760405162461bcd60e51b815260206004820152601860248201527f676f7665726e616e63652073657474696e6773207a65726f00000000000000006044820152606401620000d9565b6001600160a01b038216620001855760405162461bcd60e51b815260206004820152601060248201526f5f676f7665726e616e6365207a65726f60801b6044820152606401620000d9565b80546001600160a01b038481166001600160a81b031990921691909117600160a01b1782556001820180549184166001600160a01b0319909216821790556040519081527f9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db9060200160405180910390a1505050565b6001600160a01b03811681146200021157600080fd5b50565b6000806000606084860312156200022a57600080fd5b83516200023781620001fb565b60208501519093506200024a81620001fb565b604085015190925080151581146200026157600080fd5b809150509250925092565b6080516118936200028f600039600081816101eb015261069e01526118936000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c8063689baff0116100c3578063debfda301161007c578063debfda30146102f8578063e17f212e1461030b578063e2ec6ec31461032a578063ef88bf131461033d578063f5a9838314610350578063fc31a2e81461035857600080fd5b8063689baff01461027957806378d2ac291461028c5780637b9417c8146102ac5780638d28b5e9146102bf578063c6062392146102d2578063cf5d3c30146102e557600080fd5b8063317a7aec11610115578063317a7aec1461020d5780633af32abf146102205780634d7d9c01146102335780634ee643a5146102465780635aa6e6751461025357806362354e031461025b57600080fd5b806301ffc9a714610152578063073e824e1461017a57806316fc2f6d146101be57806320c5f99d146101d35780632583e7f7146101e6575b600080fd5b610165610160366004611234565b610384565b60405190151581526020015b60405180910390f35b6101a6610188366004611273565b6001600160a01b039081166000908152600260205260409020541690565b6040516001600160a01b039091168152602001610171565b6101d16101cc366004611290565b6103b0565b005b6101d16101e1366004611290565b610498565b6101657f000000000000000000000000000000000000000000000000000000000000000081565b6101d161021b366004611273565b610687565b61016561022e366004611273565b610719565b6101d1610241366004611310565b610747565b6000546101659060ff1681565b6101a661076d565b60008051602061183e833981519152546001600160a01b03166101a6565b6101d1610287366004611273565b610816565b61029f61029a366004611273565b6109bb565b6040516101719190611373565b6101d16102ba366004611273565b610a67565b61029f6102cd366004611273565b610a78565b61029f6102e0366004611273565b610a9f565b6101d16102f336600461143d565b610ac6565b610165610306366004611273565b610ae9565b60008051602061183e83398151915254600160a81b900460ff16610165565b6101d16103383660046114d8565b610b83565b6101d161034b36600461158a565b610bc5565b6101d1610d39565b6101a6610366366004611273565b6001600160a01b039081166000908152600360205260409020541690565b600061038f82610e0e565b806103aa57506001600160e01b0319821663323cc6bd60e21b145b92915050565b6103b8610e44565b60405160008051602061183e833981519152906000906103db90859085906115c3565b604051809103902090508160020160008281526020019081526020016000205460000361044f5760405162461bcd60e51b815260206004820152601a60248201527f74696d656c6f636b3a20696e76616c69642073656c6563746f7200000000000060448201526064015b60405180910390fd5b6040518181527f69b058d6225c01c1f2a25801ca5b05705fa2e9118e93d518390ba804398c87b19060200160405180910390a16000908152600290910160205260408120555050565b60008051602061183e8339815191526104b033610ae9565b6104ec5760405162461bcd60e51b815260206004820152600d60248201526c37b7363c9032bc32b1baba37b960991b6044820152606401610446565b600083836040516104fe9291906115c3565b6040805191829003909120600081815260028501602052918220549092509081900361056c5760405162461bcd60e51b815260206004820152601a60248201527f74696d656c6f636b3a20696e76616c69642073656c6563746f720000000000006044820152606401610446565b804210156105bc5760405162461bcd60e51b815260206004820152601960248201527f74696d656c6f636b3a206e6f7420616c6c6f77656420796574000000000000006044820152606401610446565b6000828152600284016020526040808220829055845460ff60b01b1916600160b01b1785555130906105f190889088906115c3565b6000604051808303816000865af19150503d806000811461062e576040519150601f19603f3d011682016040523d82523d6000602084013e610633565b606091505b5050845460ff60b01b191685556040518481529091507fec1225e5a8a8acb91e03ce648c683c74f5d152a775b9715980999441d714c44f9060200160405180910390a161067f81610ea0565b505050505050565b61068f610ebd565b1561070c5761069c610ef3565b7f00000000000000000000000000000000000000000000000000000000000000006107005760405162461bcd60e51b81526020600482015260146024820152731c995d9bdad9481b9bdd081cdd5c1c1bdc9d195960621b6044820152606401610446565b61070981610f37565b50565b6107096000366000610fab565b6001600160a01b03811660009081526001602052604081205460ff16806103aa575060005460ff1692915050565b61074f610ebd565b1561070c5761075c610ef3565b6000805460ff191682151517905550565b60008051602061183e833981519152805460009190600160a81b900460ff166107a35760018101546001600160a01b0316610810565b805460408051631cc9492560e21b815290516001600160a01b03909216916373252494916004808201926020929091908290030181865afa1580156107ec573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061081091906115d3565b91505090565b61081f33610719565b6108635760405162461bcd60e51b81526020600482015260156024820152741859d95b9d081b9bdd081dda1a5d195b1a5cdd1959605a1b6044820152606401610446565b6001600160a01b038116158061089157506001600160a01b0381811660009081526002602052604090205416155b6108d35760405162461bcd60e51b8152602060048201526013602482015272776f726b206164647265737320696e2075736560681b6044820152606401610446565b336000908152600360205260409020546001600160a01b03168015610919576001600160a01b038116600090815260026020526040902080546001600160a01b03191690555b33600090815260036020526040902080546001600160a01b0319166001600160a01b03841690811790915515610972576001600160a01b038216600090815260026020526040902080546001600160a01b031916331790555b604080516001600160a01b0383811682528416602082015233917f174ce844d7e28d695e043ecb1f4f404b2b32b9d554236756bbbf09c730cfaf20910160405180910390a25050565b6001600160a01b03811660009081526005602052604090208054606091906109e2906115f0565b80601f0160208091040260200160405190810160405280929190818152602001828054610a0e906115f0565b8015610a5b5780601f10610a3057610100808354040283529160200191610a5b565b820191906000526020600020905b815481529060010190602001808311610a3e57829003601f168201915b50505050509050919050565b610a6f610e44565b610709816110c2565b6001600160a01b03811660009081526006602052604090208054606091906109e2906115f0565b6001600160a01b03811660009081526004602052604090208054606091906109e2906115f0565b610ace610e44565b610ad7846110c2565b610ae384848484611180565b50505050565b60008051602061183e833981519152805460009190600160a01b900460ff168015610b7c57508054604051630debfda360e41b81526001600160a01b0385811660048301529091169063debfda3090602401602060405180830381865afa158015610b58573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b7c919061162a565b9392505050565b610b8b610e44565b60005b8151811015610bc157610bb9828281518110610bac57610bac611647565b60200260200101516110c2565b600101610b8e565b5050565b60008051602061183e8339815191528054600160a01b900460ff1615610c245760405162461bcd60e51b8152602060048201526014602482015273696e697469616c6973656420213d2066616c736560601b6044820152606401610446565b6001600160a01b038316610c7a5760405162461bcd60e51b815260206004820152601860248201527f676f7665726e616e63652073657474696e6773207a65726f00000000000000006044820152606401610446565b6001600160a01b038216610cc35760405162461bcd60e51b815260206004820152601060248201526f5f676f7665726e616e6365207a65726f60801b6044820152606401610446565b80546001600160a01b038481166001600160a81b031990921691909117600160a01b1782556001820180549184166001600160a01b0319909216821790556040519081527f9789733827840833afc031fb2ef9ab6894271f77bad2085687cf4ae5c7bee4db9060200160405180910390a1505050565b610d41610e44565b60008051602061183e8339815191528054600160a81b900460ff1615610da95760405162461bcd60e51b815260206004820152601a60248201527f616c726561647920696e2070726f64756374696f6e206d6f64650000000000006044820152606401610446565b6001810180546001600160a01b03191690558054600160a81b60ff60a81b1982161782556040516001600160a01b0390911681527f83af113638b5422f9e977cebc0aaf0eaf2188eb9a8baae7f9d46c42b33a1560c906020015b60405180910390a150565b60006001600160e01b031982166301ffc9a760e01b14806103aa57506001600160e01b03198216633af32abf60e01b1492915050565b610e4c61076d565b6001600160a01b0316336001600160a01b031614610e9e5760405162461bcd60e51b815260206004820152600f60248201526e6f6e6c7920676f7665726e616e636560881b6044820152606401610446565b565b3d604051818101604052816000823e8215610eb9578181f35b8181fd5b60008051602061183e833981519152805460009190600160b01b900460ff1680610810575054600160a81b900460ff1615919050565b60008051602061183e8339815191528054600160b01b900460ff1615610f2f57333014610f2257610f2261165d565b805460ff60b01b19169055565b610709610e44565b6001600160a01b03811660009081526001602052604090205460ff16610f5a5750565b6001600160a01b038116600081815260016020908152604091829020805460ff1916905590519182527fe01091cddc91f5497c62b6d5b4ae6514036739c2528f0463485236065e1eba4a9101610e03565b60008051602061183e833981519152610fc2610e44565b60008484604051610fd49291906115c3565b604080519182900382208454636221a54b60e01b845291519093506000926001600160a01b0390921691636221a54b9160048083019260209291908290030181865afa158015611028573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061104c9190611673565b9050838110156110595750825b6000611065824261168c565b600084815260028601602052604090819020829055519091507f8c02104dfc280f713854f25297de671710c544c58de69dbde8fb66974ce1ab9e906110b19089908990879086906116ad565b60405180910390a150505050505050565b6001600160a01b0381166111075760405162461bcd60e51b815260206004820152600c60248201526b61646472657373207a65726f60a01b6044820152606401610446565b6001600160a01b03811660009081526001602052604090205460ff161561112b5750565b6001600160a01b038116600081815260016020818152604092839020805460ff191690921790915590519182527faab7954e9d246b167ef88aeddad35209ca2489d95a8aeb59e288d9b19fae5a549101610e03565b6001600160a01b03841660009081526004602052604090206111a2848261173a565b506001600160a01b03841660009081526005602052604090206111c5838261173a565b506001600160a01b03841660009081526006602052604090206111e8828261173a565b50836001600160a01b03167fdfc42408096207c0b2f3755d74f7f3179c9329dd74cc7953dbdc5832b25f3376848484604051611226939291906117fa565b60405180910390a250505050565b60006020828403121561124657600080fd5b81356001600160e01b031981168114610b7c57600080fd5b6001600160a01b038116811461070957600080fd5b60006020828403121561128557600080fd5b8135610b7c8161125e565b600080602083850312156112a357600080fd5b823567ffffffffffffffff808211156112bb57600080fd5b818501915085601f8301126112cf57600080fd5b8135818111156112de57600080fd5b8660208285010111156112f057600080fd5b60209290920196919550909350505050565b801515811461070957600080fd5b60006020828403121561132257600080fd5b8135610b7c81611302565b6000815180845260005b8181101561135357602081850181015186830182015201611337565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610b7c602083018461132d565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156113c5576113c5611386565b604052919050565b600082601f8301126113de57600080fd5b813567ffffffffffffffff8111156113f8576113f8611386565b61140b601f8201601f191660200161139c565b81815284602083860101111561142057600080fd5b816020850160208301376000918101602001919091529392505050565b6000806000806080858703121561145357600080fd5b843561145e8161125e565b9350602085013567ffffffffffffffff8082111561147b57600080fd5b611487888389016113cd565b9450604087013591508082111561149d57600080fd5b6114a9888389016113cd565b935060608701359150808211156114bf57600080fd5b506114cc878288016113cd565b91505092959194509250565b600060208083850312156114eb57600080fd5b823567ffffffffffffffff8082111561150357600080fd5b818501915085601f83011261151757600080fd5b81358181111561152957611529611386565b8060051b915061153a84830161139c565b818152918301840191848101908884111561155457600080fd5b938501935b8385101561157e578435925061156e8361125e565b8282529385019390850190611559565b98975050505050505050565b6000806040838503121561159d57600080fd5b82356115a88161125e565b915060208301356115b88161125e565b809150509250929050565b8183823760009101908152919050565b6000602082840312156115e557600080fd5b8151610b7c8161125e565b600181811c9082168061160457607f821691505b60208210810361162457634e487b7160e01b600052602260045260246000fd5b50919050565b60006020828403121561163c57600080fd5b8151610b7c81611302565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052600160045260246000fd5b60006020828403121561168557600080fd5b5051919050565b808201808211156103aa57634e487b7160e01b600052601160045260246000fd5b606081528360608201528385608083013760006080858301015260006080601f19601f870116830101905083602083015282604083015295945050505050565b601f821115611735576000816000526020600020601f850160051c810160208610156117165750805b601f850160051c820191505b8181101561067f57828155600101611722565b505050565b815167ffffffffffffffff81111561175457611754611386565b6117688161176284546115f0565b846116ed565b602080601f83116001811461179d57600084156117855750858301515b600019600386901b1c1916600185901b17855561067f565b600085815260208120601f198616915b828110156117cc578886015182559484019460019091019084016117ad565b50858210156117ea5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b60608152600061180d606083018661132d565b828103602084015261181f818661132d565b90508281036040840152611833818561132d565b969550505050505056fe2aa47ee5db910f3b2a06970c443249cc77dbd9f96100cfebc1775ab7fb1d1824a26469706673582212205b71b2067e5a7f7d778283c238ffc3da700df3c40a9f1f56c53fdfb316491c1964736f6c63430008170033";

type AgentOwnerRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AgentOwnerRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AgentOwnerRegistry__factory extends ContractFactory {
  constructor(...args: AgentOwnerRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _governanceSettings: AddressLike,
    _initialGovernance: AddressLike,
    _supportRevoke: boolean,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(
      _governanceSettings,
      _initialGovernance,
      _supportRevoke,
      overrides || {}
    );
  }
  override deploy(
    _governanceSettings: AddressLike,
    _initialGovernance: AddressLike,
    _supportRevoke: boolean,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(
      _governanceSettings,
      _initialGovernance,
      _supportRevoke,
      overrides || {}
    ) as Promise<
      AgentOwnerRegistry & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): AgentOwnerRegistry__factory {
    return super.connect(runner) as AgentOwnerRegistry__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AgentOwnerRegistryInterface {
    return new Interface(_abi) as AgentOwnerRegistryInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): AgentOwnerRegistry {
    return new Contract(address, _abi, runner) as unknown as AgentOwnerRegistry;
  }
}

let amtA = document.getElementById('amtA');
let amtB = document.getElementById('amtB');
inputA = document.getElementById('inputA');
inputB = document.getElementById('inputB');
// let withDrawA = document.getElementById('withDrawA');
// let depositA = document.getElementById('depositA');
// let withDrawB = document.getElementById('withDrawB');
// let depositB = document.getElementById('depositB');


// connect Meta Mask to gui
let account;
const connectMetaMask = async () => {
    if(window.ethereum != "undefined") {
        const acct = await ethereum.request({method: "eth_requestAccounts"});
        account = acct[0];
    }
}
connectMetaMask();


// connect smart contract to gui
const connectSmartContract = async () => {
    // define our ABI and Address of current node on Ganache Test Network
    const abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "deduct",
                    "type": "int256"
                }
            ],
            "name": "deductAmountFromWalletA",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "deduct",
                    "type": "int256"
                }
            ],
            "name": "deductAmountFromWalletB",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "deposit",
                    "type": "int256"
                }
            ],
            "name": "depositAmountToWalletA",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "deposit",
                    "type": "int256"
                }
            ],
            "name": "depositAmountToWalletB",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "withDraw",
                    "type": "int256"
                }
            ],
            "name": "withDrawFromATransferToB",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "withDraw",
                    "type": "int256"
                }
            ],
            "name": "withDrawFromBTransferToA",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getAmountOfWalletA",
            "outputs": [
                {
                    "name": "",
                    "type": "int256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getAmountOfWalletB",
            "outputs": [
                {
                    "name": "",
                    "type": "int256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "walletA",
            "outputs": [
                {
                    "name": "",
                    "type": "int256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "walletB",
            "outputs": [
                {
                    "name": "",
                    "type": "int256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const address = "0x7002071AF54EBea1aCcA30f5b4e1d3CD343e87Fe";

    // connect the contract.sol to gui --> standard code
    window.web3 = await new Web3(window.ethereum);
    window.contract = await new window.web3.eth.Contract(abi, address);
    console.log("connected to smart contract");

    // display initial values of both wallets
    amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
    amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();
}
connectSmartContract();



// work with smart contract
// 1. Function to check for valid input
function isValidValuePresent() {
    let amount = "";
    if(inputA.value == "" && inputB.value == "") {
        confirm("Values in both the boxes cannot be empty.");
    } else if(inputA.value != "" && inputB.value != "") {
        confirm("Only one box needs to be filled");
    } else if(inputA.value != "") {
        amount = inputA.value;
        return ['A', amount];
    } else if(inputB.value != "") {
        amount = inputB.value;
        return ['B', amount];
    }
    return [];
}

// 1. deposit to current WALLET
const deposit = async (walletChar) => {
    let list = isValidValuePresent();
    if(list.length != 0) {
        if(list[0] == 'A' && list[0] == walletChar) {
            await window.contract.methods.depositAmountToWalletA(list[1]).send({from: account});
            amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
        } else if(list[0] == 'B' && list[0] == walletChar) {
            await window.contract.methods.depositAmountToWalletB(list[1]).send({from: account});
            amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();
        } else {
            confirm(`The value in ${walletChar} box cannot be empty`);
        }
    }
}


// 2. transfer to other WALLET and deduct amount from current WALLET
const transfer = async (walletChar) => {
    let list = isValidValuePresent();
    if(list.length != 0) {
        if(list[0] == 'A' && list[0] == walletChar) {
            await window.contract.methods.withDrawFromATransferToB(list[1]).send({from: account});
        } else if(list[0] == 'B' && list[0] == walletChar) {
            await window.contract.methods.withDrawFromBTransferToA(list[1]).send({from: account});
        } else {
            confirm(`The value in ${walletChar} box cannot be empty`);
        }
        amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
        amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();
    }
}


const deduct = async (walletChar) => {
    let list = isValidValuePresent();
    if(list.length != 0) {
        if(list[0] == 'A' && list[0] == walletChar) {
            await window.contract.methods.deductAmountFromWalletA(list[1]).send({from: account});
            amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
        } else if(list[0] == 'B' && list[0] == walletChar) {
            await window.contract.methods.deductAmountFromWalletB(list[1]).send({from: account});
            amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();
        } else {
            confirm(`The value in ${walletChar} box cannot be empty`);
        }
    }
}


// 1. deposit to WALLET A
// const depositToA = async () => {
//     let amount = inputA.value;
//     if(amount != "") {
//         await window.contract.methods.depositAmountToWalletA(amount).send({from: account});
//         amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
//     }
// }

// // 2. deposit to WALLET B
// const depositToB = async () => {
//     let amount = inputB.value;
//     if(amount != "") {
//         await window.contract.methods.depositAmountToWalletB(amount).send({from: account});
//         amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();
//     }
// }

// // 3. deduct from WALLET A and add to WALLET B
// const transferFromAToB = async () => {
//     let amount = inputA.value;
//     if(amount != "") {
//         await window.contract.methods.withDrawFromATransferToB(amount).send({from: account});
//         amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
//         amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();
//     }
// }

// // 4. deduct from WALLET B and add to WALLET A
// const transferFromBToA = async () => {
//     let amount = inputA.value;
//     if(amount != "") {
//         await window.contract.methods.withDrawFromBTransferToA(amount).send({from: account});
//         amtA.innerText = await window.contract.methods.getAmountOfWalletA().call();
//         amtB.innerText = await window.contract.methods.getAmountOfWalletB().call();

//     }
// }

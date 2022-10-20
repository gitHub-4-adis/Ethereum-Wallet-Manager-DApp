pragma solidity ^0.8.17;

contract SimpleContract {
    int public walletA; 
    int public walletB;

    constructor() public {
        walletA = 500;
        walletB = 700;
    }

    function getAmountOfWalletA() view public returns(int) {
        return walletA;
    }

    function getAmountOfWalletB() view public returns(int) {
        return walletB;
    }

    function withDrawFromATransferToB(int withDraw) public {
        if(walletA - withDraw < 0) {
            return;
        } else {
            walletA = walletA - withDraw;
            walletB = walletB + withDraw;
        }
    }

    function withDrawFromBTransferToA(int withDraw) public {
        if(walletB - withDraw < 0) {
            return;
        } else {
            walletB = walletB - withDraw;
            walletA = walletA + withDraw;
        }
    }

    function depositAmountToWalletA(int deposit) public {
        walletA = walletA + deposit;
    }

    function depositAmountToWalletB(int deposit) public {
        walletB = walletB + deposit;
    }

    function deductAmountFromWalletA(int deduct) public {
        if(walletA - deduct >= 0) {
            walletA = walletA - deduct;
        }
    }

    function deductAmountFromWalletB(int deduct) public {
        if(walletB - deduct >= 0) {
            walletB = walletB - deduct;
        }
    }

}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Game {
    address public player1;
    address public player2;
    uint public stakeAmount;
    uint public totalStake;
    bool public gameStarted;
    address public owner;

    constructor(uint _stakeAmount) {
        stakeAmount = _stakeAmount;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function enterGame() public payable {
        require(msg.value == stakeAmount, "Incorrect stake amount");
        require(!gameStarted, "Game already started");

        if (player1 == address(0)) {
            player1 = msg.sender;
        } else if (player2 == address(0)) {
            require(msg.sender != player1, "Player1 already joined");
            player2 = msg.sender;
            gameStarted = true;
        } else {
            revert("Game is full");
        }

        totalStake += msg.value;
    }

    function getNumberOfPlayers() public view returns (uint) {
        uint numPlayers = 0;
        if (player1 != address(0)) {
            numPlayers++;
        }
        if (player2 != address(0)) {
            numPlayers++;
        }
        return numPlayers;
    }

    function declareWinner(address winner) public onlyOwner {
        require(gameStarted, "Game has not started");
        require(
            winner == player1 || winner == player2,
            "Winner must be a player in the game"
        );

        // TODO: Call to Verifier.verify() to prove state transition history

        payable(winner).transfer(totalStake);

        // Reset the game
        resetGame();
    }

    function resetGame() private {
        player1 = address(0);
        player2 = address(0);
        totalStake = 0;
        gameStarted = false;
    }
}

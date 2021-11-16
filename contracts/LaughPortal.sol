// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

//unicode for middle finger:  U+1F595	in ES6 this is \u{1F595}
//U+1F923	🤣

contract LaughPortal {

   uint256 totalLaughs;

   uint256 private seed;
   
   event NewLaugh(address indexed from, string message, uint256 timestamp, string prize);

   struct Laugh {
        address laugher; // The address of the user who laughed.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user laughed.
        string prize; // Did the laugher win a prize
   }

   Laugh[] laughs;

   mapping(address => uint256) public lastLaughedAt;
   
   constructor() payable {
      console.log("Life is a construct!");

      seed = (block.timestamp + block.difficulty) % 100;
   }

   // essentially POST request
   function laugh(string memory _message) public {
      
      require(
         lastLaughedAt[msg.sender] + 10 minutes < block.timestamp,
         "Wait 10 minutes"
      );

      lastLaughedAt[msg.sender] = block.timestamp;
      console.log("time stamp: ", lastLaughedAt[msg.sender]);
      
      totalLaughs += 1;
      console.log("%s has laughed!", msg.sender);
      string memory winner = "";
      seed = (block.difficulty + block.timestamp + seed) % 100;
      console.log("Random #: ", seed);
      if (seed <= 25) {
         console.log("%s won!", msg.sender);
         uint256 prizeAmount = 0.0001 ether;
         require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
         );
         (bool success, ) = (msg.sender).call{value: prizeAmount}("");
         require(success, "Failed to withdraw money from contract.");
         winner = "ETH Winner";
      }

      laughs.push(Laugh(msg.sender, _message, block.timestamp, winner));

      emit NewLaugh(msg.sender, _message, block.timestamp, winner);

   }

   function getAllLaughs() public view returns (Laugh[] memory) {
        return laughs;
    }

   // GET request
   function getTotalLaughs() public view returns (uint256) {
      // console.log("We have %d total laughs", totalLaughs);
      return totalLaughs;
   }


}
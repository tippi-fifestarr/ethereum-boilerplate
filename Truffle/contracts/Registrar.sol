// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// contract OtherContract {
//     function CallonMe() {
//         // see the youtube video of scavenger hunt
//     }
// }

contract Registrar is Ownable, ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    mapping(address => bytes32) registerTx;
    mapping(address => bytes32) registerMsg;
     
    constructor(string memory _name) public ERC721("NameCard","NTMY") {
        registerTx[tx.origin] = keccak256(abi.encode(_name));
        registerMsg[msg.sender] = keccak256(abi.encode(_name));
    }

    string public question = "How much gas does this string cost?";

    modifier onlyOnce() {
        require(registerTx[tx.origin] == 0);
        require(registerMsg[msg.sender] == 0);
        _;
    }
    function signIn(string memory _name) public onlyOnce returns (uint256) {
        registerTx[tx.origin] = keccak256(abi.encode(_name));
        registerMsg[msg.sender] = keccak256(abi.encode(_name));
        _tokenIds.increment();
        uint256 nameCardId = _tokenIds.current();
        _mint(msg.sender, nameCardId);
        
        return nameCardId;

    }
   
    function checkRegister(address addr) public view returns (bytes32, bytes32) {
        return (registerTx[addr], registerMsg[addr]);
    }

}

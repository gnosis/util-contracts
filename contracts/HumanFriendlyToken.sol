/// Implements ERC 20 Token standard including extra accessors for human readability.
/// See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
pragma solidity ^0.5.0;
import "./Token.sol";

/// @title Abstract human-friendly token contract - Functions to be implemented by token contracts
contract HumanFriendlyToken is Token {
    /*
     *  Public functions
     */
    function name() public view returns (string memory);
    function symbol() public view returns (string memory);
    function decimals() public view returns (uint8);
}

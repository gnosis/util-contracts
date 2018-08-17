/// Implements ERC 20 Token standard including extra accessors for human readability.
/// See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
pragma solidity ^0.4.24;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";


/// @title Abstract human-friendly token contract - Functions to be implemented by token contracts
contract HumanFriendlyToken is ERC20 {

    /*
     *  Public functions
     */
    function name() public view returns (string);
    function symbol() public view returns (string);
    function decimals() public view returns (uint8);
}

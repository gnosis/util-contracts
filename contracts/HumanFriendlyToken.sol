// SPDX-License-Identifier: LGPL-3.0-or-newer

/// Implements ERC 20 Token standard including extra accessors for human readability.
/// See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
pragma solidity ^0.6.0;
import "./Token.sol";

/// @title Abstract human-friendly token contract - Functions to be implemented by token contracts
abstract contract HumanFriendlyToken is Token {
    /*
     *  Public functions
     */
    function name() public virtual view returns (string memory);
    function symbol() public virtual view returns (string memory);
    function decimals() public virtual view returns (uint8);
}

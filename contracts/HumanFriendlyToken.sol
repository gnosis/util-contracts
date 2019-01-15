/// Implements ERC 20 Token standard including extra accessors for human readability.
/// See: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
pragma solidity ^0.5.0;

import "./interfaces/GnosisIERC20.sol";

/// @title Abstract human-friendly token contract - Functions to be implemented by token contracts
//  @todo  Backwards compatible right now - remove in favour of just GnosisIERC20.sol
contract HumanFriendlyToken is GnosisIERC20 {}

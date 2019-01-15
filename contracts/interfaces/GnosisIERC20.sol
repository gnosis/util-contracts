pragma solidity ^0.5.0;

import "./GnosisIERC20Info.sol";

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/// @title Abstract Contract GnosisIERC20
/// @dev Inherits from OpenZeppelin IERC20
/// @dev Interface for full ERC20 functions + constants: token name, symbol, decimal
// TODO: Convert to proper interface when/if inheritance changes incorporated
contract GnosisIERC20 is GnosisIERC20Info, IERC20 {}

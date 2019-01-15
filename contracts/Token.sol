pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/// @title  Token - Abstract Contract
/// @dev    Inherits OpenZeppelin IERC20
//  @todo   Change other contracts to use IERC20 directly - backwards compatible below
contract Token is IERC20 {}

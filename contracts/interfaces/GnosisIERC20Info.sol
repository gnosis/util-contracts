pragma solidity ^0.5.0;

// TODO: decide to use below or not - or HumanFriendlyToken interface
interface GnosisIERC20Info {
    /**
     *  Getters
     */
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}

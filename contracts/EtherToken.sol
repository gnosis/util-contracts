// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.7.0;
import "./GnosisStandardToken.sol";

/// @title Token contract - Token exchanging Ether 1:1
/// @author Stefan George - <stefan@gnosis.pm>
contract EtherToken is GnosisStandardToken {
    using GnosisMath for *;

    /*
     *  Events
     */
    event Deposit(address indexed sender, uint value);
    event Withdrawal(address indexed receiver, uint value);

    /*
     *  Constants
     */
    string public constant name = "Ether Token";
    string public constant symbol = "ETH";
    uint8 public constant decimals = 18;

    /*
     *  Public functions
     */
    /// @dev Buys tokens with Ether, exchanging them 1:1
    function deposit() public payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        totalTokens = totalTokens.add(msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    /// @dev Sells tokens in exchange for Ether, exchanging them 1:1
    /// @param value Number of tokens to sell
    function withdraw(uint value) public {
        // Balance covers value
        balances[msg.sender] = balances[msg.sender].sub(value);
        totalTokens = totalTokens.sub(value);
        msg.sender.transfer(value);
        emit Withdrawal(msg.sender, value);
    }
}

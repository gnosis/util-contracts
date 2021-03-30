// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./StorageReadable.sol";
import "./StorageSimulate.sol";
import "./StorageSimulation.sol";

/**
 * @title Storage Accessible Extension
 * @author Gnosis Developers
 * @dev Generic base contract that allows callers to access all internal storage.
 */
abstract contract StorageAccessible is StorageReadable, StorageSimulation {
    using StorageSimulate for StorageSimulation;

    /**
     * @dev Simulates a delegete call to a target contract in the context of self.
     *
     * Internally reverts execution to avoid side effects (making it static).
     * Catches revert and returns encoded result as bytes.
     *
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract (encoded method name and arguments).
     */
    function simulate(address targetContract, bytes calldata calldataPayload)
        external
        returns (bytes memory response)
    {
        response = StorageSimulation(this).simulate(targetContract, calldataPayload);
    }
}

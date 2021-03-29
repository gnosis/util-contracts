// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage Simulation Extension
 * @author Gnosis Developers
 */
abstract contract StorageSimulation {
    /**
     * @dev Performs a delegetecall on a targetContract in the context of self.
     * Internally reverts execution to avoid side effects (making it static).
     *
     * This method reverts with data equal to `abi.encode(bool(success), bytes(response))`.
     * Specifically, the `returndata` after a call to this method will be:
     * `success:bool || response.length:uint256 || response:bytes`.
     *
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract (encoded method name and arguments).
     */
    function simulateAndRevert(
        address targetContract,
        bytes memory calldataPayload
    ) external {
        assembly {
            let success := delegatecall(
                gas(),
                targetContract,
                add(calldataPayload, 0x20),
                mload(calldataPayload),
                0,
                0
            )

            mstore(0x00, success)
            mstore(0x20, returndatasize())
            returndatacopy(0x40, 0, returndatasize())
            revert(0, add(returndatasize(), 0x40))
        }
    }
}

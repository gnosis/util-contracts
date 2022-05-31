// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./StorageReadable.sol";
import "./StorageSimulation.sol";

/**
 * @title Storage Simulation Library
 * @author Gnosis Developers
 * @dev Generic base contract that allows callers to access all internal storage.
 */
abstract contract StorageAccessible is StorageReadable, StorageSimulation {
    /**
     * @dev Simulates a delegate call to a target contract in the context of self.
     *
     * Internally reverts execution to avoid side effects (making it static).
     * Catches revert and returns encoded result as bytes.
     *
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract (encoded method name and arguments).
     */
    function simulate(
        address targetContract,
        bytes calldata calldataPayload
    ) public returns (bytes memory response) {
        // Suppress compiler warnings about not using parameters, while allowing
        // parameters to keep names for documentation purposes. This does not
        // generate code.
        targetContract;
        calldataPayload;

        assembly {
            let internalCalldata := mload(0x40)
            // Store `simulateAndRevert.selector`.
            mstore(internalCalldata, "\xb4\xfa\xba\x09")
            // Abuse the fact that both this and the internal methods have the
            // same signature, and differ only in symbol name (and therefore,
            // selector) and copy calldata directly. This saves us approximately
            // 250 bytes of code and 300 gas at runtime over the
            // `abi.encodeWithSelector` builtin.
            calldatacopy(
                add(internalCalldata, 0x04),
                0x04,
                sub(calldatasize(), 0x04)
            )

            // `pop` is required here by the compiler, as top level expressions
            // can't have return values in inline assembly. `call` typically
            // returns a 0 or 1 value indicated whether or not it reverted, but
            // since we know it will always revert, we can safely ignore it.
            pop(call(
                gas(),
                address(),
                0,
                internalCalldata,
                calldatasize(),
                // The `simulateAndRevert` call always reverts, and instead
                // encodes whether or not it was successful in the return data.
                // The first 32-byte word of the return data contains the
                // `success` value, so write it to memory address 0x00 (which is
                // reserved Solidity scratch space and OK to use).
                0x00,
                0x20
            ))


            // Allocate and copy the response bytes, making sure to increment
            // the free memory pointer accordingly (in case this method is
            // called as an internal function). The remaining `returndata[0x20:]`
            // contains the ABI encoded response bytes, so we can just write it
            // as is to memory.
            let responseSize := sub(returndatasize(), 0x20)
            response := mload(0x40)
            mstore(0x40, add(response, responseSize))
            returndatacopy(response, 0x20, responseSize)

            if iszero(mload(0x00)) {
                revert(add(response, 0x20), mload(response))
            }
        }
    }
}

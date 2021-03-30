// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./StorageSimulation.sol";

/**
 * @title Storage Simulation Library
 * @author Gnosis Developers
 * @dev Convenience methods for interacting with {@link StorageSimulation} contracts.
 */
library StorageSimulate {
    using StorageSimulate for StorageSimulation;

    /**
     * @dev Precomputed selector of {@link StorageSimulation.simulateAndRevert}.
     *
     * This is defined as a constant hex literal so that it can be used in
     * inline assembly.
     */
    bytes4 internal constant SIMULATE_AND_REVERT_SELECTOR = hex"b4faba09";

    /**
     * @dev Mask for 32-byte padding calldata length.
     *
     * This is defined as a constant as negative integer literals are not
     * permitted in inline assembly.
     */
    int256 private constant PAD_MASK = -32;

    /**
     * @dev Simulate a delegete call in a specified context to a target contract.
     *
     * Internally reverts execution to avoid side effects (making it static).
     * Catches revert and returns encoded result as bytes.
     *
     * @param context The context to simulate the delegate call.
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract.
     */
    function simulate(
        StorageSimulation context,
        address targetContract,
        bytes memory calldataPayload
    ) internal returns (bytes memory response) {
        assembly {
            // Solidity memory bytes should always point to a memory address past
            // 0x60, but just make sure to avoid consuming all the gas in the call
            // if this invariant is broken. This is required because we encode the
            // internal call in place.
            if lt(calldataPayload, 0x60) {
                revert(0, 0)
            }

            // In order to avoid copying the calldata payload, which requires a
            // loop, encode the internal call in-place by temporarily writing
            // over the memory preceding the calldata payload and restoring it
            // after the call. The internall call is encoded as:
            // `selector:bytes4 || target:address || payload.offset:uint256 || payload:bytes`.
            let internalCalldata := sub(calldataPayload, 0x44)

            // Backup memory that we will be temporarily overwriting.
            let temp1 := mload(internalCalldata)
            let temp2 := mload(add(internalCalldata, 0x04))
            let temp3 := mload(add(internalCalldata, 0x24))

            // Encode the internal function call.
            mstore(internalCalldata, SIMULATE_AND_REVERT_SELECTOR)
            mstore(add(internalCalldata, 0x04), targetContract)
            mstore(add(internalCalldata, 0x24), 0x40)

            // `pop` is required here by the compiler, as top level expressions
            // can't have return values in inline assembly. `call` typically
            // returns a 0 or 1 value indicated whether or not it reverted, but
            // since we expect it to always revert, we can safely ignore it.
            pop(
                call(
                    gas(),
                    context,
                    0,
                    internalCalldata,
                    // Solidity ABI requires function data to be 32-byte padded
                    // (excluding the selector). This means the internal call data
                    // length will be:
                    // ```
                    //    4 // selector
                    // + 32 // target contract
                    // + 32 // calldata payload offset
                    // + 32 // calldata payload length
                    // +  N // 32-byte padded calldata payload data
                    // ```
                    // Since 32 is a power of two, we can implement padding a
                    // simple masked addition.
                    add(0x64, and(add(mload(calldataPayload), 31), PAD_MASK)),
                    // The `simulateAndRevert` call always reverts, and instead
                    // encodes whether or not it was successful in the return data.
                    // The first 32-byte word of the return data contains the
                    // `success` value, so write it to memory address 0x00 (which is
                    // reserved Solidity scratch space and OK to use).
                    0x00,
                    0x20
                )
            )
            let success := mload(0x00)

            // Make sure the call returns at least 64 bytes of data. This is the
            // smallest possible encoding of `success:bool || response:bytes`.
            if lt(returndatasize(), 0x40) {
                revert(0, 0)
            }

            // Recover the memory that we overwrote.
            mstore(internalCalldata, temp1)
            mstore(add(internalCalldata, 0x04), temp2)
            mstore(add(internalCalldata, 0x24), temp3)

            // Allocate and copy the response bytes, making sure to increment
            // the free memory pointer accordingly. The remaining `returndata[0x20:]`
            // contains the ABI encoded response bytes, so we can just write it
            // as is to memory.
            let responseSize := sub(returndatasize(), 0x20)
            response := mload(0x40)
            mstore(0x40, add(response, responseSize))
            returndatacopy(response, 0x20, responseSize)

            // Make sure that the response byte length is smaller than its encoded
            // size. This protects us from calling into a contract that doesn't
            // implement `StorageSimulation` returning unexpected data and causing
            // `response` to reference bytes beyond our allocation.
            if gt(mload(response), responseSize) {
                revert(0, 0)
            }

            // Finally propagate the delegate call's revert.
            if iszero(success) {
                revert(add(response, 0x20), mload(response))
            }
        }
    }
}

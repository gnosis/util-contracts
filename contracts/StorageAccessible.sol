// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.7.0;

/// @title ViewStorageAccessible - Interface on top of StorageAccessible base class to allow simulations from view functions
interface ViewStorageAccessible {
    /**
     * @dev Same as `simulateDelegatecall` on StorageAccessible. Marked as view so that it can be called from external contracts
     * that want to run simulations from within view functions. Will revert if the invoked simulation attempts to change state.
     */
    function simulateDelegatecall(
        address targetContract,
        bytes memory calldataPayload
    ) external view returns (bytes memory);

    /**
     * @dev Same as `getStorageAt` on StorageAccessible. This method allows reading aribtrary ranges of storage.
     */
    function getStorageAt(uint256 offset, uint256 length)
        external
        view
        returns (bytes memory);
}

/// @title StorageAccessible - generic base contract that allows callers to access all internal storage.
contract StorageAccessible {
    /**
     * @dev Reads `length` bytes of storage in the currents contract
     * @param offset - the offset in the current contract's storage in words to start reading from
     * @param length - the number of words (32 bytes) of data to read
     * @return the bytes that were read.
     */
    function getStorageAt(uint256 offset, uint256 length)
        external
        view
        returns (bytes memory)
    {
        bytes memory result = new bytes(length * 32);
        for (uint256 index = 0; index < length; index++) {
            assembly {
                let word := sload(add(offset, index))
                mstore(add(add(result, 0x20), mul(index, 0x20)), word)
            }
        }
        return result;
    }

    /**
     * @dev Performs a delegetecall on a targetContract in the context of self.
     * Internally reverts execution to avoid side effects (making it static). Catches revert and returns encoded result as bytes.
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract (encoded method name and arguments).
     */
    function simulateDelegatecall(
        address targetContract,
        bytes calldata calldataPayload
    ) public returns (bytes memory response) {
        bytes4 selector = this.simulateDelegatecallInternal.selector;
        assembly {
            let internalCalldata := mload(0x40)
            mstore(internalCalldata, selector)
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

            pop(call(
                gas(),
                address(),
                0,
                internalCalldata,
                calldatasize(),
                // Store the `success` value at memory address 0x00 (reserved
                // Solidity scratch space).
                0x00,
                0x20
            ))


            // Allocate and copy the response bytes, making sure to increment
            // the free memory pointer accordingly (in case this method is
            // called as an internal function).
            let responseSize := sub(returndatasize(), 0x20)
            response := mload(0x40)
            mstore(0x40, add(response, responseSize))
            returndatacopy(response, 0x20, responseSize)

            if iszero(mload(0x00)) {
                revert(add(response, 0x20), mload(response))
            }
        }
    }

    /**
     * @dev Performs a delegetecall on a targetContract in the context of self.
     * Internally reverts execution to avoid side effects (making it static). Returns encoded result as revert message
     * concatenated with the success flag of the inner call as a last byte.
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract (encoded method name and arguments).
     */
    function simulateDelegatecallInternal(
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

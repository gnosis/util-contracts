pragma solidity ^0.5.2;


/// @title StorageAccessible - generic base contract that allows callers to access all internal storage.
contract StorageAccessible {
    /**
     * @dev Reads `length` bytes of storage in the currents contract
     * @param offset - the offset in the current contract's storage in words to start reading from
     * @param length - the number of words (32 bytes) of data to read
     * @return the bytes that were read.
     */
    function getStorageAt(uint256 offset, uint256 length)
        public
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
    function executeStaticDelegatecall(
        address targetContract,
        bytes memory calldataPayload
    ) public returns (bytes memory) {
        bytes memory innerCall = abi.encodeWithSignature(
            "executeStaticDelegatecallInternal(address,bytes)",
            targetContract,
            calldataPayload
        );
        (, bytes memory response) = address(this).call(innerCall);
        return response;
    }

    /**
     * @dev Performs a delegetecall on a targetContract in the context of self.
     * Internally reverts execution to avoid side effects (making it static). Returns encoded result as revert message.
     * @param targetContract Address of the contract containing the code to execute.
     * @param calldataPayload Calldata that should be sent to the target contract (encoded method name and arguments).
     */
    function executeStaticDelegatecallInternal(
        address targetContract,
        bytes memory calldataPayload
    ) public returns (bytes memory) {
        (, bytes memory response) = targetContract.delegatecall(
            calldataPayload
        );
        assembly {
            revert(add(response, 0x20), mload(response))
        }
    }
}

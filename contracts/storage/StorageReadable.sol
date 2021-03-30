// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage Reading Extension
 * @author Gnosis Developers
 */
abstract contract StorageReadable {
    /**
     * @dev Reads `length` bytes of storage in the currents contract
     *
     * @param offset The offset in the current contract's storage in words to start reading from
     * @param length The number of words (32 bytes) of data to read
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
}

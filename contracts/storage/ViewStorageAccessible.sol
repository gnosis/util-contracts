// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "./StorageAccessible.sol";

/**
 * @title ViewStorageAccessible
 * @author Gnosis Developers
 * @dev Interface on top of StorageAccessible base class to allow simulations from view functions
 */
interface ViewStorageAccessible {
    /**
     * @dev Same as {@link StorageAccessible.simulate}. Marked as view so that
     * it can be called from external contracts that want to run simulations
     * from within view functions.
     *
     * Will revert if the invoked simulation attempts to change state.
     */
    function simulate(
        address targetContract,
        bytes memory calldataPayload
    ) external view returns (bytes memory);

    /**
     * @dev Same as {@link StorageAccessible.getStorageAt}.
     */
    function getStorageAt(uint256 offset, uint256 length)
        external
        view
        returns (bytes memory);
}

// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import "../storage/StorageAccessible.sol";
import "../storage/ViewStorageAccessible.sol";

contract StorageAccessibleWrapper is StorageAccessible {
    struct FooBar {
        uint256 foo;
        uint256 bar;
    }

    uint8 public constant SLOT_FOO = 0;
    uint8 public constant SLOT_BAR = 1;
    uint8 public constant SLOT_BAM = 1;
    uint8 public constant SLOT_BAZ = 2;
    uint8 public constant SLOT_QUX = 3;
    uint8 public constant SLOT_FOOBAR = 4;

    uint256 foo;
    uint128 bar;
    uint64 bam;
    uint256[] baz;
    mapping(uint256 => uint256) qux;
    FooBar foobar;

    constructor() {}

    function setFoo(uint256 foo_) public {
        foo = foo_;
    }

    function setBar(uint128 bar_) public {
        bar = bar_;
    }

    function setBam(uint64 bam_) public {
        bam = bam_;
    }

    function setBaz(uint256[] memory baz_) public {
        baz = baz_;
    }

    function setQuxKeyValue(uint256 key, uint256 value) public {
        qux[key] = value;
    }

    function setFoobar(uint256 foo_, uint256 bar_) public {
        foobar = FooBar({foo: foo_, bar: bar_});
    }
}

/**
 * Defines reader methods on StorageAccessibleWrapper that can be later executed
 * in the context of a previously deployed instance
 */
contract ExternalStorageReader {
    // Needs same storage layout as the contract it is reading from
    uint256 foo;

    function getFoo() public view returns (uint256) {
        return foo;
    }

    function setAndGetFoo(uint256 foo_) public returns (uint256) {
        foo = foo_;
        return foo;
    }

    function doRevert() public pure {
        revert("test revert");
    }

    function invokeDoRevertViaStorageAccessible(StorageAccessible target)
        public
    {
        target.simulate(
            address(this),
            abi.encodeWithSignature("doRevert()")
        );
    }

    function invokeStaticDelegatecall(
        ViewStorageAccessible target,
        bytes calldata encodedCall
    ) public view returns (uint256) {
        uint256 result = abi.decode(
            target.simulate(address(this), encodedCall),
            (uint256)
        );
        return result;
    }
}

contract StorageSimulateWrapper {
    using StorageSimulate for StorageSimulation;

    function simulate(
        StorageSimulation context,
        address targetContract,
        bytes memory calldataPayload
    ) external returns (bytes memory) {
        return context.simulate(targetContract, calldataPayload);
    }

    function simulateInvalidMemory() external {
        bytes memory invalidBytes;
        assembly {
            // This is technically undefined behaviour, since the Solidity
            // compiler can use the scratch space in between statements, but
            // this lets us test the path where we check that the memory address
            // gives us enough space for in-place encoding ¯\_(ツ)_/¯.
            mstore(0, 0)
            invalidBytes := 0
        }
        StorageSimulation(address(0)).simulate(address(0), invalidBytes);
    }
}

contract MockStorageSimulation {
    enum Kind {None, Return, Revert}
    struct Mock {
        Kind kind;
        bytes response;
    }

    mapping(bytes => Mock) private mocks;

    function mockCall(
        Kind kind,
        bytes calldata input,
        bytes calldata response
    ) external {
        mocks[input] = Mock({kind: kind, response: response});
    }

    function simulateAndRevert(address, bytes calldata)
        external
        view
    {
        Mock memory mock = mocks[msg.data];
        assert(mock.kind != Kind.None);

        bytes memory response = mock.response;
        if (mock.kind == Kind.Return) {
            assembly {
                return(add(response, 0x20), mload(response))
            }
        } else {
            assembly {
                revert(add(response, 0x20), mload(response))
            }
        }
    }
}

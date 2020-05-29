pragma solidity ^0.5.2;
import "../StorageAccessible.sol";


contract StorageAccessibleWrapper is StorageAccessible {
    struct FooBar {
        uint256 foo;
        uint256 bar;
    }

    uint256 foo; // slot 0
    uint128 bar; // slot 1
    uint64 bam; // slot 1
    uint256[] baz; // slot 2
    mapping(uint256 => uint256) qux; // slot 3
    FooBar foobar; // slot 4 & 5

    constructor() public {}

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

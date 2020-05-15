pragma solidity ^0.5.2;
import "../StorageAccessible.sol";


contract StorageAccessibleWrapper is StorageAccessible {
    struct FooBar {
        uint256 foo;
        uint256 bar;
    }

    uint256 foo = 42; // slot 0
    uint128 bar = 7; // slot 1
    uint64 bam = 13; // slot 1
    uint256[] baz; // slot 2
    mapping(uint256 => uint256) qux; // slot 3
    FooBar foobar; // slot 4 & 5

    constructor() public {
        baz.push(1);
        baz.push(2);
        qux[42] = 69;
        foobar = FooBar({foo: 19, bar: 21});
    }
}

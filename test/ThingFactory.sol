pragma solidity >=0.4.24 ^0.5.1;

import "../contracts/ConstructedCloneFactory.sol";

contract ThingData {
    uint public widgetState;
    address public badDude;
    int8 public something;

    event MadeWeirdStuff(bytes32 weirdStuff);
}

contract Thing is ThingData {
    function makeWeirdStuff(int8 ingredient) public returns (bytes32 weirdStuff) {
        something += ingredient;
        weirdStuff = keccak256(abi.encodePacked(widgetState, badDude, something));
        emit MadeWeirdStuff(weirdStuff);
    }
}

contract ThingFactory is ConstructedCloneFactory, ThingData {
    Thing public masterCopy;

    event ThingCreated(Thing thing);

    constructor() public {
        masterCopy = new Thing();
    }

    function cloneConstructor(bytes calldata /* args */) external {
        // (uint paramA, uint paramB) = abi.decodePacked(args, uint, uint);
        uint paramA;
        uint paramB;
        assembly {
            paramA := calldataload(0x44)
            paramB := calldataload(0x64)
        }

        // just the Thing constructor
        require(paramA > 0);
        widgetState = paramA ^ paramB;
        badDude = address(paramB >> 96);
        something = int8(paramA);
    }

    function createThing(uint paramA, uint paramB) public returns (Thing thing) {
        thing = Thing(createClone(address(masterCopy), abi.encodePacked(paramA, paramB)));
        emit ThingCreated(thing);
    }
}

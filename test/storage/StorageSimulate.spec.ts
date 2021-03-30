import { expect } from "chai";
import { BytesLike, Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("StorageSimulate", () => {
  let StorageSimulateWrapper: ContractFactory;

  // It would be awesome to use the `ethereum-waffle` mock contract here, but
  // unfortunately, it doesn't support reverting with arbitrary bytes, only with
  // revert messages.
  let MockStorageSimulation: ContractFactory;

  before(async () => {
    StorageSimulateWrapper = await ethers.getContractFactory("StorageSimulateWrapper");
    MockStorageSimulation = await ethers.getContractFactory("MockStorageSimulation");
  });

  enum MockKind {
    Return = 1,
    Revert = 2,
  }

  async function mockSimulateAndRevert(
    mockContract: Contract,
    options: {
      kind?: MockKind;
      targetContract: string;
      calldataPayload: BytesLike;
      response: BytesLike;
    },
  ): Promise<void> {
    const { kind, targetContract, calldataPayload, response } = {
      kind: MockKind.Revert,
      ...options,
    };

    const input = MockStorageSimulation.interface.encodeFunctionData("simulateAndRevert", [
      targetContract,
      calldataPayload,
    ]);
    await mockContract.mockCall(kind, input, response);
  }

  function encodeResponse(success: boolean, data: BytesLike): string {
    return ethers.utils.hexConcat([
      ethers.utils.defaultAbiCoder.encode(
        ["bool", "uint256"],
        [success, ethers.utils.hexDataLength(data)],
      ),
      data,
    ]);
  }

  function encodeRevert(message: string): string {
    const iface = new ethers.utils.Interface(["function Error(string)"]);
    return encodeResponse(false, iface.encodeFunctionData("Error", [message]));
  }

  describe("simulate", async () => {
    it("reverts when passed in payload pointing to before the zero slot", async () => {
      const instance = await StorageSimulateWrapper.deploy();
      await expect(instance.simulateInvalidMemory()).to.be.reverted;
    });

    it("pads calldata payload to 32 bytes", async () => {
      const instance = await StorageSimulateWrapper.deploy();
      const mock = await MockStorageSimulation.deploy();

      const targetContract = `0x${"2a".repeat(20)}`;
      for (const length of [0, 10, 28, 32, 42]) {
        const calldataPayload = [...Array(length)].map((_, i) => i);
        await mockSimulateAndRevert(mock, {
          targetContract,
          calldataPayload,
          response: encodeResponse(true, "0xbeefc0de"),
        });

        expect(
          await instance.callStatic.simulate(mock.address, targetContract, calldataPayload),
        ).to.equal("0xbeefc0de");
      }
    });

    it("silently accepts non-reveted `simulateAndRevert` calls", async () => {
      const instance = await StorageSimulateWrapper.deploy();
      const mock = await MockStorageSimulation.deploy();

      await mockSimulateAndRevert(mock, {
        kind: MockKind.Return,
        targetContract: ethers.constants.AddressZero,
        calldataPayload: "0x",
        response: encodeResponse(true, "0x"),
      });

      await expect(instance.callStatic.simulate(mock.address, ethers.constants.AddressZero, "0x"))
        .to.not.be.reverted;
    });

    it("reverts when simulation response is malformed", async () => {
      const instance = await StorageSimulateWrapper.deploy();
      const mock = await MockStorageSimulation.deploy();

      await mockSimulateAndRevert(mock, {
        kind: MockKind.Return,
        targetContract: ethers.constants.AddressZero,
        calldataPayload: "0x",
        response: "0xbaadc0de",
      });

      await expect(instance.callStatic.simulate(mock.address, ethers.constants.AddressZero, "0x"))
        .to.be.reverted;
    });

    it("reverts when response data length is larger than return size", async () => {
      const instance = await StorageSimulateWrapper.deploy();
      const mock = await MockStorageSimulation.deploy();

      await mockSimulateAndRevert(mock, {
        kind: MockKind.Return,
        targetContract: ethers.constants.AddressZero,
        calldataPayload: "0x",
        response: ethers.utils.defaultAbiCoder.encode(["bool", "uint256"], [true, 1_000_000]),
      });

      await expect(instance.callStatic.simulate(mock.address, ethers.constants.AddressZero, "0x"))
        .to.be.reverted;
    });

    it("propagates internal delegate call reverts", async () => {
      const instance = await StorageSimulateWrapper.deploy();
      const mock = await MockStorageSimulation.deploy();

      await mockSimulateAndRevert(mock, {
        targetContract: ethers.constants.AddressZero,
        calldataPayload: "0x",
        response: encodeRevert("test error"),
      });

      await expect(
        instance.callStatic.simulate(mock.address, ethers.constants.AddressZero, "0x"),
      ).to.be.revertedWith("test error");
    });
  });
});

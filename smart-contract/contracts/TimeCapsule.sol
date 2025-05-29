// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TimeCapsule is ReentrancyGuard {
    struct Capsule {
        uint256 unlockTime;
        address creator;
        address opener;
        string message;
        string[] attachments;
        bool isPrivate;
        bool isOpened;
    }

    mapping(uint256 => Capsule) public capsules;
    uint256 public nextCapsuleId;
    mapping(address => uint256[]) public capsulesByCreator;

    event CapsuleCreated(uint256 indexed id, address indexed creator, uint256 unlockTime);
    event CapsuleOpened(uint256 indexed id, address indexed opener);

    function createCapsule(
        string memory _message,
        uint256 _daysInFuture,
        bool _isPrivate,
        string[] memory _attachments
    ) external returns (uint256) {
        require(_daysInFuture > 0, "Unlock date must be in future");
        require(bytes(_message).length <= 1000, "Message exceeds 1000 bytes");
        require(_attachments.length <= 5, "Max 5 attachments allowed");

        uint256 unlockTime = block.timestamp + (_daysInFuture * 1 days);
        uint256 id = nextCapsuleId;

        Capsule storage capsule = capsules[id];
        capsule.unlockTime = unlockTime;
        capsule.creator = msg.sender;
        capsule.message = _message;
        capsule.isPrivate = _isPrivate;
        capsule.isOpened = false;
        capsule.opener = address(0);
        for (uint256 i = 0; i < _attachments.length; i++) {
            capsule.attachments.push(_attachments[i]);
        }

        capsulesByCreator[msg.sender].push(id);
        nextCapsuleId += 1;

        emit CapsuleCreated(id, msg.sender, unlockTime);
        return id;
    }

    function openCapsule(uint256 _id) external {
        Capsule storage capsule = capsules[_id];
        require(block.timestamp >= capsule.unlockTime, "Capsule still locked");
        if (capsule.isPrivate) {
            require(msg.sender == capsule.creator, "Only creator can open private");
        }
        require(!capsule.isOpened, "Capsule already opened");

        capsule.isOpened = true;
        capsule.opener = msg.sender;
        emit CapsuleOpened(_id, msg.sender);
    }

    function viewCapsule(uint256 _id) external view returns (string memory message, string[] memory attachments) {
        Capsule memory capsule = capsules[_id];
        if (capsule.isPrivate) {
            require(msg.sender == capsule.creator, "Only creator can view private");
        } else {
            require(block.timestamp >= capsule.unlockTime, "Public capsule locked");
        }
        return (capsule.message, capsule.attachments);
    }

    function getCapsuleDetails(uint256 _id) external view returns (
        address creator,
        uint256 unlockTime,
        bool isPrivate,
        bool isOpened,
        address opener
    ) {
        Capsule memory capsule = capsules[_id];
        return (capsule.creator, capsule.unlockTime, capsule.isPrivate, capsule.isOpened, capsule.opener);
    }

    function getCapsulesByCreator(address _creator) external view returns (uint256[] memory) {
        return capsulesByCreator[_creator];
    }
}
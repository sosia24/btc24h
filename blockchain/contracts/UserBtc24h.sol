// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/access/Ownable.sol';

struct UserStruct {
    bool registered;
    uint8 totalLevels;
    address level1;
    address level2;
    address level3;
    address level4;
    address level5;
    address level6;
    address level7;
    address level8;
    address level9;
    address level10;
    address level11;
    address level12;
    address level13;
    address level14;
    address level15;
    address level16;
    address level17;
    address level18;
    address level19;
    address level20;
    address level21;
    address level22;
    address level23;
    address level24;
    address level25;
    address level26;
    address level27;
    address level28;
    address level29;
    address level30;
    address level31;
    address level32;
    address level33;
    address level34;
    address level35;
    address level36;
    address level37;
    address level38;
    address level39;
    address level40;
}

contract UserBtc24h is Ownable {
    event UserAdded(address indexed user, uint indexed timestamp);

    mapping(address => UserStruct) private users;

    constructor() Ownable(msg.sender) {
        users[msg.sender] = UserStruct(
            true,
            0,
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0),
            address(0)
        );
    }

    function createUser(address level1) public {
        require(level1 != address(0), 'Zero address cannot be an affiliate');
        require(
            !users[tx.origin].registered,
            'This user has already been registered'
        );
        require(users[level1].registered, 'Sponsor must be registered');

        UserStruct memory sponsor = users[level1];
        users[tx.origin].registered = true;
        users[tx.origin].level1 = level1;
        addLevels(tx.origin, sponsor);
        users[tx.origin].totalLevels = sponsor.totalLevels + 1 <= 40
            ? sponsor.totalLevels + 1
            : 40;

        emit UserAdded(tx.origin, block.timestamp);
    }

    function addLevels(address user, UserStruct memory sponsor) internal {
        users[user].level2 = sponsor.level1;
        users[user].level3 = sponsor.level2;
        users[user].level4 = sponsor.level3;
        users[user].level5 = sponsor.level4;
        users[user].level6 = sponsor.level5;
        users[user].level7 = sponsor.level6;
        users[user].level8 = sponsor.level7;
        users[user].level9 = sponsor.level8;
        users[user].level10 = sponsor.level9;
        users[user].level11 = sponsor.level10;
        users[user].level12 = sponsor.level11;
        users[user].level13 = sponsor.level12;
        users[user].level14 = sponsor.level13;
        users[user].level15 = sponsor.level14;
        users[user].level16 = sponsor.level15;
        users[user].level17 = sponsor.level16;
        users[user].level18 = sponsor.level17;
        users[user].level19 = sponsor.level18;
        users[user].level20 = sponsor.level19;
        users[user].level21 = sponsor.level20;
        users[user].level22 = sponsor.level21;
        users[user].level23 = sponsor.level22;
        users[user].level24 = sponsor.level23;
        users[user].level25 = sponsor.level24;
        users[user].level26 = sponsor.level25;
        users[user].level27 = sponsor.level26;
        users[user].level28 = sponsor.level27;
        users[user].level29 = sponsor.level28;
        users[user].level30 = sponsor.level29;
        users[user].level31 = sponsor.level30;
        users[user].level32 = sponsor.level31;
        users[user].level33 = sponsor.level32;
        users[user].level34 = sponsor.level33;
        users[user].level35 = sponsor.level34;
        users[user].level36 = sponsor.level35;
        users[user].level37 = sponsor.level36;
        users[user].level38 = sponsor.level37;
        users[user].level39 = sponsor.level38;
        users[user].level40 = sponsor.level39;
    }

    function getUser(
        address _address
    ) external view returns (UserStruct memory) {
        return users[_address];
    }
}

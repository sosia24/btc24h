// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC1155 } from '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import './IUserBtc24h.sol';
import './IPaymentManager.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';
import 'hardhat/console.sol';
contract Btc24hCollection is ERC1155, Ownable, ERC1155Holder {
    using SafeERC20 for IERC20;

    IERC20 private token;
    IUserBtc24h private userBtc24h;
    IPaymentManager public paymentManager;
    address public reservePool;

    mapping(address => mapping(uint256 => bool)) private userActive;

    constructor(
        address _token,
        address _user,
        address _paymentManager,
        address _reservePool
    ) ERC1155('') Ownable(msg.sender) {
        token = IERC20(_token);
        userBtc24h = IUserBtc24h(_user);
        paymentManager = IPaymentManager(_paymentManager);
        reservePool = _reservePool;
    }

    function mint(uint256 id, uint256 amount) public {
        require(id >= 1 && id <= 3, 'Invalid id');
        IUserBtc24h.UserStruct memory user = userBtc24h.getUser(msg.sender);
        if (!user.registered) {
            userBtc24h.createUser(owner());
        }
        if (id == 1) {
            amount = amount * 10e6;
        } else if (id == 2) {
            amount = amount * 50e6;
        } else {
            amount = amount * 100e6;
        }
        token.safeTransferFrom(msg.sender, address(this), amount);

        distributeUnilevel(user, (amount * 20) / 100, id);
        paymentManager.incrementBalance((amount * 30) / 100);
        token.safeTransfer(address(paymentManager), (amount * 30) / 100);
        token.safeTransfer(reservePool, (amount * 50) / 100);

        _mint(msg.sender, id, amount, '');
    }

    function distributeUnilevel(
        IUserBtc24h.UserStruct memory user,
        uint amount,
        uint tokenId
    ) internal {
        address[] memory levels = new address[](user.totalLevels);
        uint excess = ((40 - user.totalLevels) * amount) / 40;

        for (uint8 i = 0; i < user.totalLevels; i++) {
            levels[i] = getLevelAddress(user, i + 1);
        }

        for (uint8 i = 0; i < levels.length; i++) {
            if (isActive(levels[i], tokenId)) {
                uint share = amount / 40;
                token.safeTransfer(levels[i], share);
            } else {
                excess += (amount) / 40;
            }
        }

        if (excess > 0) {
            paymentManager.incrementBalance(excess);
            token.safeTransfer(address(paymentManager), excess);
        }
    }
    function getLevelAddress(
        IUserBtc24h.UserStruct memory user,
        uint8 level
    ) internal pure returns (address) {
        if (level == 1) return user.level1;
        if (level == 2) return user.level2;
        if (level == 3) return user.level3;
        if (level == 4) return user.level4;
        if (level == 5) return user.level5;
        if (level == 6) return user.level6;
        if (level == 7) return user.level7;
        if (level == 8) return user.level8;
        if (level == 9) return user.level9;
        if (level == 10) return user.level10;
        if (level == 11) return user.level11;
        if (level == 12) return user.level12;
        if (level == 13) return user.level13;
        if (level == 14) return user.level14;
        if (level == 15) return user.level15;
        if (level == 16) return user.level16;
        if (level == 17) return user.level17;
        if (level == 18) return user.level18;
        if (level == 19) return user.level19;
        if (level == 20) return user.level20;
        if (level == 21) return user.level21;
        if (level == 22) return user.level22;
        if (level == 23) return user.level23;
        if (level == 24) return user.level24;
        if (level == 25) return user.level25;
        if (level == 26) return user.level26;
        if (level == 27) return user.level27;
        if (level == 28) return user.level28;
        if (level == 29) return user.level29;
        if (level == 30) return user.level30;
        if (level == 31) return user.level31;
        if (level == 32) return user.level32;
        if (level == 33) return user.level33;
        if (level == 34) return user.level34;
        if (level == 35) return user.level35;
        if (level == 36) return user.level36;
        if (level == 37) return user.level37;
        if (level == 38) return user.level38;
        if (level == 39) return user.level39;
        if (level == 40) return user.level40;
        revert('Invalid level');
    }
    function activeUnilevel(uint256 tokenId) external {
        require(tokenId >= 1 && tokenId <= 3, 'Invalid tokenId');

        if (tokenId == 1) {
            require(
                !userActive[msg.sender][1],
                'Unilevel for tokenId 1 already active'
            );
        } else if (tokenId == 2) {
            require(
                !userActive[msg.sender][2],
                'Unilevel for tokenId 2 already active'
            );
        } else if (tokenId == 3) {
            require(
                !userActive[msg.sender][3],
                'Unilevel for tokenId 3 already active'
            );
        }

        require(
            balanceOf(msg.sender, tokenId) > 0,
            'You need the required NFT for this unilevel'
        );

        safeTransferFrom(msg.sender, address(this), tokenId, 1, '');

        userActive[msg.sender][tokenId] = true;
    }

    function isActive(
        address user,
        uint256 tokenId
    ) public view returns (bool) {
        require(tokenId >= 1 && tokenId <= 3, 'Invalid tokenId');

        return userActive[user][tokenId];
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC1155, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

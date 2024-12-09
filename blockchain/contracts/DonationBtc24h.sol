// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './IBurnable.sol';
import './IPaymentManager.sol';
import './IUniswapOracle.sol';
// import './IQueueDistribution.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import './IUserBtc24h.sol';
import { Initializable } from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import { UUPSUpgradeable } from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import 'hardhat/console.sol';
library Donation {
    struct UserDonation {
        uint balance;
        uint startedTimestamp;
        uint totalClaimed;
        uint maxUnilevel;
        uint unilevelReached;
    }
}

contract DonationBtc24h is
    Initializable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IBurnable;
    using SafeERC20 for IERC20;

    event UserDonated(address indexed user, uint amount);
    event UserClaimed(address indexed user, uint amount);
    event Burn(uint indexed amount);

    uint24 public constant limitPeriod = 1 days;
    IUniswapOracle public uniswapOracle;
    IBurnable private token;
    IERC20 private constant wbtc =
        IERC20(0xc2132D05D31c914a87C6611C10748AEb04B58e8F);

    uint256 public distributionBalance;
    IPaymentManager public paymentManager;
    IUserBtc24h private userBtc24h;
    address public queueDistribution;

    uint256 public totalBurned;
    uint256 public totalDistributedForUsers;
    uint256 public totalForDevelopment;
    uint256 public totalPaidToUsers;
    uint public nextPoolFilling;

    mapping(address => Donation.UserDonation) private users;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _paymentManager,
        address oracle,
        address _token,
        address _user
    ) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        paymentManager = IPaymentManager(_paymentManager);
        uniswapOracle = IUniswapOracle(oracle);
        token = IBurnable(_token);
        userBtc24h = IUserBtc24h(_user);
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function setUniswapOracle(address oracle) external onlyOwner {
        uniswapOracle = IUniswapOracle(oracle);
    }

    function setPaymentManager(address _paymentManager) external onlyOwner {
        paymentManager = IPaymentManager(_paymentManager);
    }

    function addDistributionFunds(uint256 amount) external {
        token.safeTransferFrom(msg.sender, address(this), amount);
        distributionBalance += amount;
    }

    // function setQueue(address _queue) external onlyOwner {
    //     queueDistribution = IQueueDistribution(_queue);
    // }

    function timeUntilNextWithdrawal(
        address user
    ) public view returns (uint256) {
        Donation.UserDonation memory userDonation = users[user];
        uint256 timeElapsed = block.timestamp - userDonation.startedTimestamp;

        if (timeElapsed < limitPeriod) {
            return limitPeriod - timeElapsed;
        } else {
            return 0;
        }
    }

    function donate(uint128 amount) external nonReentrant {
        uint amountUsdt = uniswapOracle.returnPrice(amount);
        require(
            amountUsdt >= 10 * 10 ** 6,
            'Amount must be greater than 10 dollars'
        );
        require(
            users[msg.sender].balance == 0,
            'Only one contribution is allowed'
        );

        IUserBtc24h.UserStruct memory user = userBtc24h.getUser(msg.sender);

        if (!user.registered) {
            userBtc24h.createUser(owner());
        }

        users[msg.sender].balance = amountUsdt;
        users[msg.sender].maxUnilevel = amountUsdt / 2;
        users[msg.sender].maxUnilevel = amountUsdt / 2;

        users[msg.sender].startedTimestamp = block.timestamp;

        token.safeTransferFrom(msg.sender, address(this), amount);
        nextPoolFilling += (amount * (30)) / 100;
        uint256 burnAmount = (amount * 15) / 100;
        uint256 unilevelAmount = (amount * (20)) / 100;
        uint256 queueAmount = (amount * 35) / 100;

        token.burn(burnAmount);
        totalBurned += burnAmount;
        totalDistributedForUsers += unilevelAmount;
        distributeUnilevel(user, unilevelAmount);
        // token.safeTransfer(address(queueDistribution), queueAmount);
        // queueDistribution.incrementBalance(queueAmount);
        emit UserDonated(msg.sender, amount);
        emit Burn(burnAmount);
    }

    function distributeUnilevel(
        IUserBtc24h.UserStruct memory user,
        uint amount
    ) internal {
        uint price = uniswapOracle.returnPrice(1 ether);

        address[] memory levels = new address[](user.totalLevels);
        uint excess = ((40 - user.totalLevels) * amount) / 40;

        for (uint8 i = 0; i < user.totalLevels; i++) {
            levels[i] = getLevelAddress(user, i + 1);
        }

        for (uint8 i = 0; i < levels.length; i++) {
            if (isActive(levels[i])) {
                uint share = amount / 40;

                Donation.UserDonation storage userDonation = users[levels[i]];

                if (
                    userDonation.unilevelReached + (share * price) / 1 ether >
                    userDonation.maxUnilevel
                ) {
                    uint remaining = ((userDonation.maxUnilevel -
                        userDonation.unilevelReached) * 1 ether) / price;

                    excess += (share - remaining);
                    share = remaining;

                    userDonation.unilevelReached += (userDonation.maxUnilevel -
                        userDonation.unilevelReached);
                } else {
                    userDonation.unilevelReached += (share * price) / 1 ether;
                }

                token.safeTransfer(levels[i], share);
            } else {
                excess += (amount) / 40;
            }
        }

        if (excess > 0) {
            //swapToken()

            paymentManager.incrementBalance(excess);
            token.safeTransfer(address(paymentManager), excess);
        }
    }

    function isActive(address level) internal view returns (bool) {
        if (
            users[level].balance > 0 &&
            timeUntilNextWithdrawal(level) != 0 &&
            users[level].maxUnilevel - users[level].unilevelReached > 0
        ) {
            return true;
        }
        return false;
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

    function refillPool() external onlyOwner {
        distributionBalance += nextPoolFilling;
        nextPoolFilling = 0;
    }

    function claimDonation() external nonReentrant {
        Donation.UserDonation storage userDonation = users[msg.sender];
        uint timeElapsed = block.timestamp - userDonation.startedTimestamp;

        require(
            timeElapsed >= limitPeriod,
            'Tokens are still locked for 1 day'
        );

        uint totalValueInUSD = calculateTotalValue(msg.sender);

        uint currentPrice = uniswapOracle.returnPrice(1e18);
        uint totalTokensToSend = (totalValueInUSD * 1e18) / currentPrice;

        require(
            distributionBalance >= totalTokensToSend,
            'Insufficient token balance for distribution'
        );

        distributionBalance -= totalTokensToSend;

        users[msg.sender].balance = 0;
        uint paymentManagerAmount;
        uint userAmount;
        paymentManagerAmount = (totalTokensToSend * 75) / 10000;
        userAmount = (totalTokensToSend - paymentManagerAmount);

        uint amountOut = paymentManagerAmount;
        // uint amountOut = swapToken(paymentManagerAmount, address(usdt), 3000);
        paymentManager.incrementBalance(amountOut);

        // wbtc.safeTransfer(address(paymentManager), amountOut);
        token.safeTransfer(address(paymentManager), amountOut);
        totalForDevelopment += paymentManagerAmount;
        token.safeTransfer(msg.sender, userAmount);
        totalPaidToUsers += userAmount;

        userDonation.totalClaimed += totalValueInUSD;

        emit UserClaimed(msg.sender, totalTokensToSend);
    }

    function swapToken(uint amountIn) internal returns (uint amountOut) {
        token.approve(
            address(0xE592427A0AEce92De3Edee1F18E0157C05861564),
            amountIn
        );

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: address(token),
                tokenOut: address(wbtc),
                fee: 10000,
                recipient: address(this),
                deadline: block.timestamp + 20,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564)
            .exactInputSingle(params);
    }

    function getUser(
        address _user
    ) external view returns (Donation.UserDonation memory) {
        Donation.UserDonation memory userDonation = users[_user];
        return userDonation;
    }

    function previewTotalValue(
        address user
    ) external view returns (uint balance) {
        Donation.UserDonation memory userDonation = users[user];
        uint percentage = 5;

        balance =
            userDonation.balance +
            ((userDonation.balance * percentage) / 100);
    }

    function calculateTotalValue(
        address user
    ) internal view returns (uint balance) {
        Donation.UserDonation memory userDonation = users[user];

        balance = userDonation.balance + ((userDonation.balance * 5) / 100);
    }
}

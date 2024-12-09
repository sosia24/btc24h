// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract PaymentManager is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public wbtcToken;
    uint public wbtcBalanceFree;
    mapping(address => uint) private wbtcRecipientsClaim;
    mapping(address => uint24) public recipientsPercentage;
    mapping(address => bool) public immutableWallets;
    address[] private recipients;
    uint8 public totalRecipients;
    uint24 public totalPercentage;
    address public donationContract;
    address public collectionContract;
    address public presaleContract;

    event DonationSet(address indexed donationAddress);
    event CollectionSet(address indexed collectionContract);
    event RecipientAdded(address indexed newRecipient, uint24 percentage);
    event RecipientPercentageUpdated(
        address indexed recipient,
        uint24 newPercentage
    );
    event ImmutableWalletAdded(address indexed wallet);

    constructor(
        address _wbtcToken,
        address initialOwner
    ) Ownable(initialOwner) {
        wbtcToken = IERC20(_wbtcToken);

        recipients.push(0x969D14769009375a0AD051a407C792bA3C2fC44E);
        recipientsPercentage[
            0x969D14769009375a0AD051a407C792bA3C2fC44E
        ] = 250000;
        totalPercentage += 250000;
        totalRecipients = 1;
        addImmutableWallet(0x969D14769009375a0AD051a407C792bA3C2fC44E);
    }

    function setDonation(address _donation) external onlyOwner {
        require(
            _donation != address(0),
            'Donation address cannot be zero address'
        );
        donationContract = _donation;
        emit DonationSet(_donation);
    }

    modifier onlyContracts() {
        require(
            donationContract == msg.sender,
            'Only the donation contract can call this function.'
        );
        _;
    }

    function incrementBalance(uint256 amount) external onlyContracts {
        wbtcBalanceFree += amount;
    }

    function claim() external {
        uint24 recipientPercentage = recipientsPercentage[msg.sender];
        require(recipientPercentage > 0, 'You are not a registered recipient');

        if (wbtcBalanceFree > 0) {
            uint24 aux = 1000000;
            for (uint256 index = 0; index < recipients.length; index++) {
                aux -= recipientsPercentage[recipients[index]];

                wbtcRecipientsClaim[recipients[index]] +=
                    (wbtcBalanceFree *
                        recipientsPercentage[recipients[index]]) /
                    1000000;
            }
            wbtcBalanceFree = (wbtcBalanceFree * aux) / 1000000;
        }

        uint wbtcAmount = wbtcRecipientsClaim[msg.sender];

        wbtcRecipientsClaim[msg.sender] = 0;

        if (wbtcAmount > 0) {
            wbtcToken.safeTransfer(msg.sender, wbtcAmount);
        }
    }

    function getUserBalance(
        address _wallet
    ) external view returns (uint256 wbtcBalance) {
        uint24 recipientPercentage = recipientsPercentage[_wallet];
        if (recipientPercentage == 0) {
            return (wbtcRecipientsClaim[_wallet]);
        }

        wbtcBalance =
            wbtcRecipientsClaim[_wallet] +
            (wbtcBalanceFree * recipientPercentage) /
            1000000;
    }

    function addRecipient(
        address newRecipient,
        uint24 percentage
    ) external onlyOwner {
        require(newRecipient != address(0), 'Recipient address cannot be zero');
        require(
            recipientsPercentage[newRecipient] == 0,
            'Recipient already exists'
        );
        require(
            totalPercentage + percentage <= 1000000,
            'Total percentage exceeds 100%'
        );

        recipients.push(newRecipient);
        recipientsPercentage[newRecipient] = percentage;
        totalPercentage += percentage;
        totalRecipients++;

        emit RecipientAdded(newRecipient, percentage);
    }

    function addImmutableWallet(address wallet) public onlyOwner {
        require(wallet != address(0), 'Wallet address cannot be zero');
        require(
            recipientsPercentage[wallet] > 0,
            'Wallet must be a recipient to be made immutable'
        );
        immutableWallets[wallet] = true;
        emit ImmutableWalletAdded(wallet);
    }

    function updateRecipientPercentage(
        address recipient,
        uint24 newPercentage
    ) external onlyOwner {
        require(
            recipientsPercentage[recipient] > 0,
            'Recipient does not exist'
        );
        require(
            !immutableWallets[recipient],
            'This recipient is immutable and cannot have their percentage updated'
        );

        uint24 currentPercentage = recipientsPercentage[recipient];
        totalPercentage = totalPercentage - currentPercentage + newPercentage;
        require(totalPercentage <= 1000000, 'Total percentage exceeds 100%');

        recipientsPercentage[recipient] = newPercentage;

        emit RecipientPercentageUpdated(recipient, newPercentage);
    }
}

import {
    loadFixture,
    time,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import "@openzeppelin/hardhat-upgrades"
  import { ethers, upgrades } from "hardhat";
  import { Btc24h, DonationBtc24h } from "../typechain-types";
import { log } from "console";
  
  describe("Donation", function () {
    async function deployFixture() {
      const [owner, otherAccount] = await ethers.getSigners();
      const Btc24h = await ethers.getContractFactory("btc24h");
      const btc24h = await Btc24h.deploy() as Btc24h;
      await btc24h.waitForDeployment()
      const btc24hAddress = await btc24h.getAddress();
      const UniswapOracle = await ethers.getContractFactory("UniswapOracle");
      const uniswapOracle = await UniswapOracle.deploy();
      const uniswapOracleAddress = await uniswapOracle.getAddress();

      const UserBtc24h = await ethers.getContractFactory("UserBtc24h");
      const user = await UserBtc24h.deploy();
      const userAddress = await user.getAddress();
  
  
  
      const PaymentManager = await ethers.getContractFactory("PaymentManager");
      const paymentManager = await PaymentManager.deploy(
        btc24hAddress,
        owner.address
      );
      const paymentManagerAddress = await paymentManager.getAddress();



  
      const Donation = await ethers.getContractFactory("DonationBtc24h");
      const donationProxy = await upgrades.deployProxy(Donation, [
        paymentManagerAddress,
        uniswapOracleAddress,
        btc24hAddress,
        userAddress
      ]);
      const donation = Donation.attach(await donationProxy.getAddress()) as DonationBtc24h;
      const donationAddress = await donation.getAddress()
      await paymentManager.setDonation(donationAddress)


      return {
        owner,
        otherAccount,
        donation,
        btc24h,
        paymentManager,
        donationAddress,
        paymentManagerAddress,
        user
      };
    }
  
    it("Should create donation", async function () {
      const {
        owner,
        otherAccount,
  
        donation,
        donationAddress,
        btc24h,
      } = await loadFixture(deployFixture);
      await btc24h.approve(donationAddress,ethers.parseUnits("3000000","ether"))
      await donation.addDistributionFunds(ethers.parseUnits("2000000","ether"))

      expect(await btc24h.balanceOf(donation)).to.be.equal(ethers.parseUnits("2000000","ether"))
      await donation.donate(ethers.parseUnits("100","ether"))
      expect(await donation.previewTotalValue(owner.address)).to.be.equal(94.5*10**6);
      const oneDay = 24*60*60
      expect(await donation.timeUntilNextWithdrawal(owner.address)).to.be.within(oneDay-10,oneDay+10)
      await expect(donation.claimDonation()).to.be.revertedWith("Tokens are still locked for 1 day")
      await time.increase(oneDay)
      expect(await donation.timeUntilNextWithdrawal(owner.address)).to.be.equal(0)
      await donation.claimDonation()
      

      
    });

    it("Should create donation unilevel", async function () {
        const {
            owner,
            otherAccount,
            donation,
            donationAddress,
            btc24h,
            user
        } = await loadFixture(deployFixture);
    
        await btc24h.approve(donationAddress, ethers.parseUnits("3000000", "ether"));
        await donation.addDistributionFunds(ethers.parseUnits("2000000", "ether"));
    
        const wallets = [];
        for (let i = 0; i < 40; i++) {
            const wallet = ethers.Wallet.createRandom();
            
            wallets.push(wallet);
            await owner.sendTransaction({
                to: wallet.address,
                value: ethers.parseUnits("1", "ether"),
            });
    
            await btc24h.transfer(wallet.address, ethers.parseUnits("300", "ether"));
        }

        let anterior = owner.address; 


        for (const [index, wallet] of wallets.entries()) {
            const connectedWallet = wallet.connect(ethers.provider);
        
            await user.connect(connectedWallet).createUser(anterior);
        
            const donationAmount = index === 0 ? "100" : "300";
  
            await btc24h.connect(connectedWallet).approve(
                donationAddress,
                ethers.parseUnits(donationAmount, "ether")
            );
        
            await donation.connect(connectedWallet).donate(
                ethers.parseUnits(donationAmount, "ether")
            );
        
            anterior = wallet.address;

        }
        
        
    });
    


    
  });
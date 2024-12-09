import {
    loadFixture,
    time,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { expect } from "chai";
  import "@openzeppelin/hardhat-upgrades"
  import { ethers, upgrades } from "hardhat";
  import { Btc24h, DonationBtc24h, Usdt } from "../typechain-types";
  
  describe("Collection", function () {
    async function deployFixture() {
      const [owner, otherAccount] = await ethers.getSigners();
      const Usdt = await ethers.getContractFactory("usdt");
      const usdt = await Usdt.deploy() as Usdt;
      await usdt.waitForDeployment()
      const usdtAddress = await usdt.getAddress();



  
      const UserBtc24h = await ethers.getContractFactory("UserBtc24h");
      const user = await UserBtc24h.deploy();
      const userAddress = await user.getAddress();
  
      const PaymentManager = await ethers.getContractFactory("PaymentManager");
      const paymentManager = await PaymentManager.deploy(
        usdtAddress,
    
        owner.address
      );
      const paymentManagerAddress = await paymentManager.getAddress();

      const Btc24hCollection = await ethers.getContractFactory("Btc24hCollection");
      const btc24hCollection = await Btc24hCollection.deploy(usdtAddress,userAddress,paymentManagerAddress,otherAccount.address);
      const btc24hCollectionAddress = await btc24hCollection.getAddress();

  

      await paymentManager.setDonation(btc24hCollectionAddress)
      await btc24hCollection.setApprovalForAll(btc24hCollectionAddress,true)


      return {
        owner,
        otherAccount,
        btc24hCollection,
        usdt,
        paymentManager,
        btc24hCollectionAddress,
        paymentManagerAddress,
        user
      };
    }
  
    it("Should buy nfts", async function () {
      const {
        owner,
        otherAccount,
        btc24hCollection,
        usdt,
        paymentManager,
        btc24hCollectionAddress,
        paymentManagerAddress,
      } = await loadFixture(deployFixture);
      await usdt.mint(owner.address,320*10**6)
      await usdt.approve(btc24hCollectionAddress,320*10**6)

      await btc24hCollection.mint(1,2)
      await btc24hCollection.mint(2,2)
      await btc24hCollection.mint(3,2)

      expect(await usdt.balanceOf(otherAccount.address)).to.be.equal(160*10**6);
      expect(await usdt.balanceOf(paymentManagerAddress)).to.be.equal(160*10**6);
      expect(await usdt.balanceOf(owner.address)).to.be.equal(0);
      expect(await btc24hCollection.isActive(owner.address,1)).to.be.equal(false)
      expect(await btc24hCollection.isActive(owner.address,2)).to.be.equal(false)
      expect(await btc24hCollection.isActive(owner.address,3)).to.be.equal(false)

      await btc24hCollection.activeUnilevel(1)
      await btc24hCollection.activeUnilevel(2)
      await btc24hCollection.activeUnilevel(3)

      expect(await btc24hCollection.isActive(owner.address,1)).to.be.equal(true)
      expect(await btc24hCollection.isActive(owner.address,2)).to.be.equal(true)
      expect(await btc24hCollection.isActive(owner.address,3)).to.be.equal(true)

      await expect(btc24hCollection.activeUnilevel(1)).to.be.revertedWith("Unilevel for tokenId 1 already active")
      await expect(btc24hCollection.activeUnilevel(2)).to.be.revertedWith("Unilevel for tokenId 2 already active")
      await expect(btc24hCollection.activeUnilevel(3)).to.be.revertedWith("Unilevel for tokenId 3 already active")


      
    });

    it("Should buy nfts", async function () {
      const {
        owner,
        otherAccount,
        btc24hCollection,
        usdt,
        paymentManager,
        btc24hCollectionAddress,
        paymentManagerAddress,
        user
      } = await loadFixture(deployFixture);
      await usdt.mint(owner.address,160000*10**6)
      await usdt.approve(btc24hCollectionAddress,160000*10**6)

      await btc24hCollection.mint(1,1)
      await btc24hCollection.mint(2,1)
      await btc24hCollection.mint(3,1)


      await btc24hCollection.activeUnilevel(1)
      await btc24hCollection.activeUnilevel(2)
      await btc24hCollection.activeUnilevel(3)

   
      const wallets = [];
      for (let i = 0; i < 40; i++) {
          const wallet = ethers.Wallet.createRandom();
          
          wallets.push(wallet);
          await owner.sendTransaction({
              to: wallet.address,
              value: ethers.parseUnits("1", "ether"),
          });
  
          await usdt.transfer(wallet.address, 160*10**6);
      }

      let anterior = owner.address; 


      for (const [index, wallet] of wallets.entries()) {
          const connectedWallet = wallet.connect(ethers.provider);
      
          await user.connect(connectedWallet).createUser(anterior);
          await usdt.connect(connectedWallet).approve(
            btc24hCollectionAddress,
            160*10**6
        );
        
          await btc24hCollection.connect(connectedWallet).mint(1,1)
          await btc24hCollection.connect(connectedWallet).mint(2,1)
          await btc24hCollection.connect(connectedWallet).mint(3,1)


          
          anterior = wallet.address;

      }

      


    });


    
  });
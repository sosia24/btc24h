// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './TickMath.sol';
import './INonfungiblePositionManager.sol';

contract Liquidity is Ownable {
    IUniswapV3Factory public uniswapV3Factory;
    INonfungiblePositionManager public nonfungiblePositionManager;
    uint160 private constant SQRT_PRICE_X96_LOWER = 4295128739;
    uint160 private constant SQRT_PRICE_X96_UPPER =
        1461446703485210103287273052203988822378723970341;

    constructor() Ownable(msg.sender) {
        uniswapV3Factory = IUniswapV3Factory(
            0x1F98431c8aD98523631AE4a59f267346ea31F984
        );
        nonfungiblePositionManager = INonfungiblePositionManager(
            0xC36442b4a4522E871399CD717aBDD847Ab11FE88
        );
    }
    function withdrawNFT(
        uint256 tokenId,
        address recipient
    ) external onlyOwner {
        require(recipient != address(0), 'Invalid recipient address');

        nonfungiblePositionManager.safeTransferFrom(
            address(this),
            recipient,
            tokenId
        );
    }

    function calculateQ64_96(
        uint decimalValue
    ) public pure returns (uint160 q64_96Value) {
        require(decimalValue > 0, 'Value must be greater than zero');
        uint scaledValue = decimalValue * 1e15;
        q64_96Value = uint160((sqrt(scaledValue) << 96) / 1e18) * 1e3;
    }

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function createLiquidity(
        address tokenA,
        address tokenB,
        uint24 fee,
        uint256 amountA,
        uint256 amountB,
        uint160 price
    ) external {
        require(tokenA < tokenB, 'Invalid token order');

        require(
            IERC20(tokenA).allowance(msg.sender, address(this)) >= amountA,
            'Insufficient allowance for tokenA'
        );
        require(
            IERC20(tokenB).allowance(msg.sender, address(this)) >= amountB,
            'Insufficient allowance for tokenB'
        );

        int24 tickLower = TickMath.getTickAtSqrtRatio(SQRT_PRICE_X96_LOWER);
        int24 tickUpper = TickMath.getTickAtSqrtRatio(SQRT_PRICE_X96_UPPER);
        require(tickLower < tickUpper, 'Invalid ticks');

        int24 tickSpacing = uniswapV3Factory.feeAmountTickSpacing(fee);
        tickLower = (tickLower / tickSpacing) * tickSpacing;
        tickUpper = (tickUpper / tickSpacing) * tickSpacing;

        address pool = uniswapV3Factory.getPool(tokenA, tokenB, fee);
        if (pool == address(0)) {
            pool = uniswapV3Factory.createPool(tokenA, tokenB, fee);
            nonfungiblePositionManager.createAndInitializePoolIfNecessary(
                tokenA,
                tokenB,
                fee,
                price
            );
        }

        (uint256 tokenId, , , ) = _mintNewPosition(
            tokenA,
            tokenB,
            fee,
            amountA,
            amountB,
            tickLower,
            tickUpper
        );
    }

    function test(
        address token0,
        address token1,
        uint24 fee,
        uint160 price
    ) external {
        nonfungiblePositionManager.createAndInitializePoolIfNecessary(
            token0,
            token1,
            fee,
            price
        );
    }

    function _mintNewPosition(
        address token0,
        address token1,
        uint24 fee,
        uint256 amount0ToMint,
        uint256 amount1ToMint,
        int24 tickLower,
        int24 tickUpper
    )
        internal
        returns (
            uint256 tokenId,
            uint128 liquidity,
            uint256 amount0,
            uint256 amount1
        )
    {
        TransferHelper.safeTransferFrom(
            token0,
            msg.sender,
            address(this),
            amount0ToMint
        );
        TransferHelper.safeTransferFrom(
            token1,
            msg.sender,
            address(this),
            amount1ToMint
        );

        TransferHelper.safeApprove(
            token0,
            address(nonfungiblePositionManager),
            amount0ToMint
        );
        TransferHelper.safeApprove(
            token1,
            address(nonfungiblePositionManager),
            amount1ToMint
        );

        INonfungiblePositionManager.MintParams
            memory params = INonfungiblePositionManager.MintParams({
                token0: token0,
                token1: token1,
                fee: fee,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: amount0ToMint,
                amount1Desired: amount1ToMint,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp
            });

        (tokenId, liquidity, amount0, amount1) = nonfungiblePositionManager
            .mint(params);

        if (amount0 < amount0ToMint) {
            TransferHelper.safeApprove(
                token0,
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund0 = amount0ToMint - amount0;
            TransferHelper.safeTransfer(token0, msg.sender, refund0);
        }

        if (amount1 < amount1ToMint) {
            TransferHelper.safeApprove(
                token1,
                address(nonfungiblePositionManager),
                0
            );
            uint256 refund1 = amount1ToMint - amount1;
            TransferHelper.safeTransfer(token1, msg.sender, refund1);
        }
    }
}

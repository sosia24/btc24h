// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol';
import '@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol';

contract UniswapOracle {
    address public poolEthaWeth;
    address public poolWethUsdt;
    address public owner;
    address public etha;
    address public weth;
    address public usdt;

    event OwnerChanged(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, 'Not the contract owner');
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnerChanged(address(0), owner);
    }

    function changeOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), 'New owner cannot be the zero address');
        address oldOwner = owner;
        owner = newOwner;
        emit OwnerChanged(oldOwner, newOwner);
    }

    function setEtha(address _etha) external onlyOwner {
        require(_etha != address(0), 'ETHA cannot be the zero address');
        etha = _etha;
    }

    function setUsdt(address _usdt) external onlyOwner {
        require(_usdt != address(0), 'USDT cannot be the zero address');
        usdt = _usdt;
    }

    function setWeth(address _weth) external onlyOwner {
        require(_weth != address(0), 'WETH cannot be the zero address');
        weth = _weth;
    }

    function setPoolEthaWeth(uint24 _fee) external onlyOwner {
        require(etha != address(0), 'ETHA address not set');
        require(weth != address(0), 'WETH address not set');

        address _pool = IUniswapV3Factory(
            0x1F98431c8aD98523631AE4a59f267346ea31F984
        ).getPool(etha, weth, _fee);
        require(_pool != address(0), 'Pool does not exist');

        poolEthaWeth = _pool;
    }
    function setPoolWethUsdt(uint24 _fee) external onlyOwner {
        require(usdt != address(0), 'ETHA address not set');
        require(weth != address(0), 'WETH address not set');

        address _pool = IUniswapV3Factory(
            0x1F98431c8aD98523631AE4a59f267346ea31F984
        ).getPool(weth, usdt, _fee);
        require(_pool != address(0), 'Pool does not exist');

        poolWethUsdt = _pool;
    }

    function returnPrice(uint128 amountIn) external view returns (uint) {
        // require(poolEthaWeth != address(0), 'ETHA/WETH pool not set');
        // require(poolWethUsdt != address(0), 'WETH/USDT pool not set');

        // (int24 tickEthaWeth, ) = OracleLibrary.consult(poolEthaWeth, 10);
        // uint amountOut = OracleLibrary.getQuoteAtTick(
        //     tickEthaWeth,
        //     amountIn,
        //     etha,
        //     weth
        // );
        // (int24 tickWethUsdt, ) = OracleLibrary.consult(poolWethUsdt, 10);
        // uint amountOut2 = OracleLibrary.getQuoteAtTick(
        //     tickWethUsdt,
        //     uint128(amountOut),
        //     weth,
        //     usdt
        // );
        // return amountOut2;
        return (amountIn * 9e5) / 1 ether;
    }
    function getPriceEthaWeth(uint128 amountIn) external view returns (uint) {
        require(poolEthaWeth != address(0), 'ETHA/WETH pool not set');
        require(etha != address(0) && weth != address(0), 'Addresses not set');

        (int24 tickEthaWeth, ) = OracleLibrary.consult(poolEthaWeth, 10);
        uint amountOut = OracleLibrary.getQuoteAtTick(
            tickEthaWeth,
            amountIn,
            etha,
            weth
        );
        return amountOut;
    }

    function getPriceWethUsdt(uint128 amountIn) external view returns (uint) {
        require(poolWethUsdt != address(0), 'WETH/USDT pool not set');
        require(weth != address(0) && usdt != address(0), 'Addresses not set');

        (int24 tickWethUsdt, ) = OracleLibrary.consult(poolWethUsdt, 10);
        uint amountOut = OracleLibrary.getQuoteAtTick(
            tickWethUsdt,
            amountIn,
            weth,
            usdt
        );
        return amountOut;
    }
}

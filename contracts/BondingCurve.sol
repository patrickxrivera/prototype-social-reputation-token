pragma solidity >=0.4.21 <0.7.0;

// Bonding Curve based on a square root curve y = m * (x ^ 1/2)
// This bonding curve is equivalent to Bancor's Formula where reserve ratio = 2/3
contract BondingCurve {
    uint256 constant public DECIMALS = 10 ** 18;

    function calculatePurchaseReturn(
        uint256 _totalSupply,
        uint256 _reserveBalance,
        uint256 _reserveRatio,
        uint256 _depositAmount
    )   public
        pure
        returns (uint256)
    {
        uint256 newTotal = _totalSupply + _depositAmount;
        uint256 newPrice = (newTotal * newTotal / DECIMALS) * (newTotal / DECIMALS);

        return sqrt(newPrice) * 2 / 3 - _reserveBalance;
    }

    function calculateSaleReturn(
        uint256 _totalSupply,
        uint256 _reserveBalance,
        uint256 _reserveRatio,
        uint256 _sellAmount
    )   public
        pure
        returns (uint256)
    {
        uint256 newTotal = _totalSupply + _sellAmount;
        uint256 newPrice = (newTotal * newTotal / DECIMALS) * (newTotal / DECIMALS);

        return _reserveBalance - sqrt(newPrice) * 2 / 3;
    }

    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
}
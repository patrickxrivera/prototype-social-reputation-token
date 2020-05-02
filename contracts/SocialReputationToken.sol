pragma solidity >=0.4.21 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SocialReputationToken {
    string private _name;

    string private _symbol;

    uint256 private _totalSupply;

    string private _baseURIPrefix = "https://api.socialrep.com";

    string private _baseURI;

    string private ZERO_TOKEN_BALANCE = "No tokens left to mint.";

    string private INVALID_REDEMPTION_ADDRESS = "This address does not hold any tokens";

    struct TokenOwner {
        // what # token was this issued
        uint256 tokenId;
        // what # token is this out of remaining supply
        uint256 tokenPosition;
        uint256 price;
    }

    mapping(address => TokenOwner) private _tokenOwners;

    address[] private _tokenPositions;

    uint256 _tokenIdCounter = 1;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory tokenURIPrefix_, // unique id for this project
        uint256 totalSupply_
    ) public payable {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = totalSupply_;
        _baseURI = _setBaseURI(tokenURIPrefix_);
        // TODO: add ETH collateral
    }

    function mint(address to) external returns(bool) {
        require(_totalSupply > 0, ZERO_TOKEN_BALANCE);

        // TODO: fetch price

        uint256 _tokenPosition = _tokenPositions.length;
        uint256 _price = 10;

        _tokenOwners[to] = TokenOwner({
            tokenId: _tokenIdCounter,
            tokenPosition: _tokenPosition,
            price: _price
        });

        _tokenPositions.push(to);

        _tokenIdCounter++;

        return true;
    }

    function redeem(address from) external returns(bool) {
        require(_exits(from), INVALID_REDEMPTION_ADDRESS);

        TokenOwner storage _tokenOwner = _tokenOwners[from];

        // uint256 _price = _tokenOwner.price;
        uint256 _tokenPosition = _tokenOwner.tokenPosition;

        delete(_tokenOwners[from]);
        _removeTokenPosition(_tokenPosition);

        // TODO:
        // recalculate the prices and tokenPositions for the outstanding tokens
        // send the ETH to the address
        return true;
    }

    function _removeTokenPosition(uint256 _tokenPosition) internal returns(bool) {
        for (uint i = _tokenPosition; i < _tokenPositions.length - 1; i++) {
            _tokenPositions[i] = _tokenPositions[i + 1];
        }

        _tokenPositions.pop();

        return true;
    }

    // Setters

    function _setBaseURI(string memory _tokenURIPrefix) internal view returns(string memory) {
        return string(abi.encodePacked(_baseURIPrefix,"/", _tokenURIPrefix));
    }

    // Getters

    function name() public view returns(string memory) {
        return _name;
    }

    function symbol() public view returns(string memory) {
        return _symbol;
    }

    function totalSupply() public view returns(uint256) {
        return _totalSupply;
    }

    function baseURI() public view returns(string memory) {
        return _baseURI;
    }

    function tokenId(address owner) public view returns(uint256) {
        return _tokenOwners[owner].tokenId;
    }

    function tokenURI(address owner) public view returns(string memory) {
        string memory _tokenURIStr = uintToStr(tokenId(owner));
        return string(abi.encodePacked(_baseURI,"/", _tokenURIStr));
    }

    function tokenPosition(address owner) public view returns(uint256) {
        return _tokenOwners[owner].tokenPosition;
    }

    function tokenPositions() public view returns(address[] memory) {
        return _tokenPositions;
    }

    // Utils

    // taken from: https://github.com/provable-things/ethereum-api/blob/master/oraclizeAPI_0.5.sol#L1045
    function uintToStr(uint _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        uint l = _i;
        while (l != 0) {
            bstr[k--] = byte(uint8(48 + l % 10));
            l /= 10;
        }
        return string(bstr);
    }

    function _exits(address addressToCheck) internal view returns(bool) {
        return _tokenOwners[addressToCheck].tokenId != 0;
    }
}
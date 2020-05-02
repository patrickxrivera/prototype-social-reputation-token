pragma solidity >=0.4.21 <0.7.0;

import "@nomiclabs/buidler/console.sol";

contract SocialReputationToken {
    string private _name;

    string private _symbol;

    uint256 private _totalSupply;

    string private _baseURIPrefix = "https://api.socialrep.com";

    string private _baseURI;

    string private ZERO_TOKEN_BALANCE = "No tokens left to mint.";

    struct TokenOwner {
        // what # token was this issued
        uint256 tokenId;
        // what # token is this out of remaining supply
        // uint256 addressIdx;
        // uint256 price;
    }

    mapping(address => TokenOwner) private _tokenOwners;

    address[] public _addressIndices;

    uint256 _tokenIdCounter = 1;

    constructor(
        string memory name_,
        string memory symbol_,
        // unique id for this project
        string memory tokenURIPrefix_,
        uint256 totalSupply_
    ) public payable {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = totalSupply_;
        _baseURI = _setBaseURI(tokenURIPrefix_);
    }

    function mint(address to) external returns(bool) {
        require(_totalSupply > 0, ZERO_TOKEN_BALANCE);
        // fetch price
        // build tokenUri
        // create TokenOwner struct
        // add to _tokenOwners map
        // add to array
        _tokenOwners[to] = TokenOwner({
            tokenId: _tokenIdCounter
        });
        _tokenIdCounter++;
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
}
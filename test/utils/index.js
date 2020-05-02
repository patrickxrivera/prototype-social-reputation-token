const { ethers } = require("@nomiclabs/buidler");

const deploySocialReputationContract = async ({ 
    NAME,
    SYMBOL,
    TOTAL_SUPPLY,
    TOKEN_URI_PREFIX
}) => {
    Token = await ethers.getContractFactory("SocialReputationToken");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    const socialReputationToken = await Token.deploy(NAME, SYMBOL, TOKEN_URI_PREFIX, TOTAL_SUPPLY);
    
    return {
        addr1,
        addr2,
        addr3,
        owner,
        addrs,
        socialReputationToken: await socialReputationToken.deployed()
    };
};

module.exports = {
    deploySocialReputationContract
}
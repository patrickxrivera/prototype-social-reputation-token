const { expect } = require("chai");
const { deploySocialReputationContract } = require("./utils");

describe("SocialReputationToken contract", () => {
    const CONSTANTS = {
        NAME: "PATRICK",
        SYMBOL: "PXR",
        TOTAL_SUPPLY: 10,
        BASE_URI: "https://api.socialrep.com",
        TOKEN_URI_PREFIX: "123",
    };
    
    const { NAME, SYMBOL, TOTAL_SUPPLY, BASE_URI, TOKEN_URI_PREFIX } = CONSTANTS;

    let socialReputationToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async () =>  {
        const response = await deploySocialReputationContract(CONSTANTS);
        
        socialReputationToken = response.socialReputationToken;
        addr1 = response.addr1;
        addr2 = response.addr2;
        owner = response.owner;
    });

    describe("deployment", () => {
        it("should set the name", async () => {
            const name = await socialReputationToken.name();
            expect(name).to.equal(NAME);
        });

        it("should set the symbol", async () => {
            const symbol = await socialReputationToken.symbol();
            expect(symbol).to.equal(SYMBOL);
        });

        it("should set the total supply", async () => {
            const totalSupply = await socialReputationToken.totalSupply();
            expect(totalSupply).to.equal(TOTAL_SUPPLY);
        });

        it("should set the base uri", async () => {
            const expected = `${BASE_URI}/${TOKEN_URI_PREFIX}`
            const baseURI = await socialReputationToken.baseURI();
            expect(baseURI).to.equal(expected);
        });
    });

    describe("mint", () => {
        it("should set the tokenUri", async () => {
            let addr1Addr = await addr1.getAddress();
            await socialReputationToken.mint(addr1Addr);

            const addr1TokenURI = await socialReputationToken.tokenURI(addr1Addr);
            const expectedTokenURI = `${BASE_URI}/${TOKEN_URI_PREFIX}/1`;

            expect(addr1TokenURI).to.equal(expectedTokenURI);
        });

        describe("after calling mint multiple times", () =>  {
            it("should set the right token id for all addresses", async () => {
                let addr1Addr = await addr1.getAddress();
                await socialReputationToken.mint(addr1Addr);
                
                let addr2Addr = await addr2.getAddress();
                await socialReputationToken.mint(addr2Addr);
    
                const addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                const addr2TokenId = await socialReputationToken.tokenId(addr2Addr);
                
                expect(addr1TokenId).to.equal(1);
                expect(addr2TokenId).to.equal(2);
            });
        })
    });
});
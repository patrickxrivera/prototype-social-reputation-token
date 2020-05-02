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
    let addr3;

    beforeEach(async () =>  {
        const response = await deploySocialReputationContract(CONSTANTS);
        
        socialReputationToken = response.socialReputationToken;
        addr1 = response.addr1;
        addr2 = response.addr2;
        addr3 = response.addr3;
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
            it("should set the right tokenId for all addresses", async () => {
                let addr1Addr = await addr1.getAddress();
                await socialReputationToken.mint(addr1Addr);
                
                let addr2Addr = await addr2.getAddress();
                await socialReputationToken.mint(addr2Addr);
    
                const addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                const addr2TokenId = await socialReputationToken.tokenId(addr2Addr);
                
                expect(addr1TokenId).to.equal(1);
                expect(addr2TokenId).to.equal(2);
            });

            it("should set the right tokenPosition for all addresses", async () => {
                let addr1Addr = await addr1.getAddress();
                await socialReputationToken.mint(addr1Addr);
                
                let addr2Addr = await addr2.getAddress();
                await socialReputationToken.mint(addr2Addr);
    
                const addr1TokenPosition = await socialReputationToken.tokenPosition(addr1Addr);
                const addr2TokenPosition = await socialReputationToken.tokenPosition(addr2Addr);
                
                expect(addr1TokenPosition).to.equal(0);
                expect(addr2TokenPosition).to.equal(1);
            });
        })
    });

    describe("redeem", () => {
        describe("after calling redeem once", () => {
            it("should delete the token owner", async () => {
                let addr1Addr = await addr1.getAddress();
                await socialReputationToken.mint(addr1Addr);
    
                let addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                expect(addr1TokenId).to.equal(1);
                
                await socialReputationToken.redeem(addr1Addr);
                addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                expect(addr1TokenId).to.equal(0);
            });
    
            it("should delete the token position", async () => {
                let addr1Addr = await addr1.getAddress();
                await socialReputationToken.mint(addr1Addr);
    
                let tokenPositions = await socialReputationToken.tokenPositions();
                expect(tokenPositions).to.eql([addr1Addr]);
                
                await socialReputationToken.redeem(addr1Addr);
                tokenPositions = await socialReputationToken.tokenPositions();
                expect(tokenPositions).to.eql([]);
            });
        });

        describe("after calling redeem multiple times", () => {
            it("should delete all relevant token owners", async () => {
                let addr1Addr = await addr1.getAddress();
                let addr2Addr = await addr2.getAddress();
                let addr3Addr = await addr3.getAddress();

                await socialReputationToken.mint(addr1Addr);
                await socialReputationToken.mint(addr2Addr);
                await socialReputationToken.mint(addr3Addr);
    
                let addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                let addr2TokenId = await socialReputationToken.tokenId(addr2Addr);
                let addr3TokenId = await socialReputationToken.tokenId(addr3Addr);

                expect(addr1TokenId).to.equal(1);
                expect(addr2TokenId).to.equal(2);
                expect(addr3TokenId).to.equal(3);

                await socialReputationToken.redeem(addr2Addr);
                
                addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                addr2TokenId = await socialReputationToken.tokenId(addr2Addr);
                addr3TokenId = await socialReputationToken.tokenId(addr3Addr);

                expect(addr1TokenId).to.equal(1);
                expect(addr2TokenId).to.equal(0);
                expect(addr3TokenId).to.equal(3);

                await socialReputationToken.redeem(addr1Addr);

                addr1TokenId = await socialReputationToken.tokenId(addr1Addr);
                addr2TokenId = await socialReputationToken.tokenId(addr2Addr);
                addr3TokenId = await socialReputationToken.tokenId(addr3Addr);

                expect(addr1TokenId).to.equal(0);
                expect(addr2TokenId).to.equal(0);
                expect(addr3TokenId).to.equal(3);
            });
    
            it("should delete the token position", async () => {
                let addr1Addr = await addr1.getAddress();
                let addr2Addr = await addr2.getAddress();
                let addr3Addr = await addr3.getAddress();

                await socialReputationToken.mint(addr1Addr);
                await socialReputationToken.mint(addr2Addr);
                await socialReputationToken.mint(addr3Addr);
    
                tokenPositions = await socialReputationToken.tokenPositions();
                expect(tokenPositions).to.eql([addr1Addr, addr2Addr, addr3Addr]);

                await socialReputationToken.redeem(addr2Addr);

                tokenPositions = await socialReputationToken.tokenPositions();
                expect(tokenPositions).to.eql([addr1Addr, addr3Addr]);

                await socialReputationToken.redeem(addr1Addr);

                tokenPositions = await socialReputationToken.tokenPositions();
                expect(tokenPositions).to.eql([addr3Addr]);

                await socialReputationToken.redeem(addr3Addr);

                tokenPositions = await socialReputationToken.tokenPositions();
                expect(tokenPositions).to.eql([]);
            });
        });
    });
});
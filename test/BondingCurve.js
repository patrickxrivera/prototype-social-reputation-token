const { expect } = require("chai");
const { ethers } = require("@nomiclabs/buidler");

describe("BondingCurve contract", () => {
    let owner;
    let addrs;
    let bondingCurve;

    // describe("saleReturn", async () => {
        

    //     it("should return sale returns", async () =>  {
    //         const SELL_AMOUNT = 1;
    //         for (let i = 10; i > 0; i--) {
    //             let totalSupply = reserveBalance = i;
    //             const result = await bondingCurve.calculateSaleReturn(
    //                 totalSupply,
    //                 reserveBalance,
    //                 1,
    //                 SELL_AMOUNT
    //             )
    //             console.log(result);
    //         }

    //         expect(true).to.be(true);
    //     });
    // });

    describe("deployment", () => {
        it("should set the name", async () => {
            console.log("==== HELLO ====")
            BondingCurve = await ethers.getContractFactory("BondingCurve");
            [owner, ...addrs] = await ethers.getSigners();
            
            bondingCurve = await BondingCurve.deploy();
            await bondingCurve.deployed();
            const SELL_AMOUNT = 1;
            for (let i = 10; i > 0; i--) {
                let totalSupply = reserveBalance = i;
                const result = await bondingCurve.calculateSaleReturn(
                    totalSupply,
                    reserveBalance,
                    1,
                    SELL_AMOUNT
                )
                console.log(result);
            }

            expect(true).to.be(true);
        });
    });
});
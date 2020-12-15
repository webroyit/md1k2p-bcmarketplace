const { assert } = require('chai');

const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

// These accounts are from ganche
contract(Marketplace, ([deployer, seller, buyer]) => {
    let marketplace;

    // 'before' is do this before testing
    before(async() => {
        marketplace = await Marketplace.deployed();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = await marketplace.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })

        it('has a name', async() => {
            const name = await marketplace.name();
            assert.equal(name, "Drink Place");
        })
    });

})
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

    describe('products', async() => {
        let result, productCount;

        before(async() => {
            // from for which account is calling this function
            // 1 ETH = 1000000000000000000 Wei
            result = await marketplace.createProduct('Water', web3.utils.toWei('0.0001', 'Ether'), { from: seller });
            productCount = await marketplace.productCount();
        });

        it('creates products', async() => {
            // Handle success
            assert.equal(productCount, 1);

            // Check the log of ProductCreated
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is  correct');
            assert.equal(event.name, 'Water', 'name is  correct');
            assert.equal(event.price, '100000000000000', 'price is  correct');
            assert.equal(event.owner, seller, 'owner is  correct');
            assert.equal(event.purchased, false, 'purchased is  correct');

            // Handle failure: Product must have a name
            await marketplace.createProduct('', web3.utils.toWei('0.0001', 'Ether'), { from: seller }).should.be.rejected;
            // Handle failure: Product must have a price
            await marketplace.createProduct('Water', 0, { from: seller }).should.be.rejected;
        });

        it('lists products', async() => {
            const product = await marketplace.products(productCount);
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is  correct');
            assert.equal(product.name, 'Water', 'name is  correct');
            assert.equal(product.price, '100000000000000', 'price is  correct');
            assert.equal(product.owner, seller, 'owner is  correct');
            assert.equal(product.purchased, false, 'purchased is  correct');
        });

        it('sells products', async() => {
            // Track the seller balance before purchase
            let oldSellerBalanace;
            oldSellerBalanace = await web3.eth.getBalance(seller);
            oldSellerBalanace = new web3.utils.BN(oldSellerBalanace);

            // Success: Buyer makes purchase
            result = await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.0001', 'Ether') });

            // Check logs
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is  correct');
            assert.equal(event.name, 'Water', 'name is  correct');
            assert.equal(event.price, '100000000000000', 'price is  correct');
            assert.equal(event.owner, buyer, 'owner is  correct');
            assert.equal(event.purchased, true, 'purchased is  correct');

            // Check that the seller received funds
            let newSellerBalance;
            newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price;
            price = web3.utils.toWei('0.0001', 'Ether');
            price = new web3.utils.BN(price);

            // 'add()' is a function from oldSellerBalanace
            const expectedBalance = oldSellerBalanace.add(price);

            assert.equal(newSellerBalance.toString(), expectedBalance.toString());

            // Failure: Tries to buy a product that does not exist
            await marketplace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('0.0001', 'Ether') }).should.be.rejected;
            // Failure: Buyer tries to buy a product without enough ether
            await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.00005', 'Ether') }).should.be.rejected;
            // Failure: Deployer tries to buy a product
            await marketplace.purchaseProduct(productCount, { from: deployer, value: web3.utils.toWei('0.0001', 'Ether') }).should.be.rejected;
            // Failure: Buyer tries to buy a product again
            await marketplace.purchaseProduct(productCount, { from: buyer, value: web3.utils.toWei('0.0001', 'Ether') }).should.be.rejected;
        });
    });
})
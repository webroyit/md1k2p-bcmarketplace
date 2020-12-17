pragma solidity ^0.5.0;

// Handle business logic for buying and selling items on the blockchain
contract Marketplace{
    // State variable, data that stored on the blockchain
    // 'public' will create a function that allows other contract to get this value 
    string public name;

    // To keep track of how many products in the hash map
    uint public productCount = 0;

    // Store the sturct Product in a hash map or associative array
    mapping(uint => Product) public products;

    // Add items to the marketplace as a seller
    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    // It get run only once when the contract is deployed
    constructor() public{
        name = "Drink Place";
    }

    // '_' to represent local variables
    function createProduct(string memory _name, uint _price) public {
        // Name cannot be empty
        require(bytes(_name).length > 0);

        // Price must be greater than 0
        require(_price > 0);

        // Increment productCount
        productCount++;

        // Create the product
        // 'msg.sender' is the address of someone who calls this function
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);

        // To log out the product
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    // 'payable' to send ether
    function purchaseProduct(uint _id) public payable{
        // Fetch the product
        // 'memory' makes a copy of the Product
        Product memory _product = products[_id];

        // Fetch the owner
        address payable _seller = _product.owner;

        // Make sure the product has a valid id
        require(_product.id > 0 && _product.id <= productCount);

        // Require that there is enough Ether in the transaction
        require(msg.value >= _product.price);

        // Require that the product has not been purchased already
        require(!_product.purchased);

        // Require that the buyer is not the seller
        require(_seller != msg.sender);

        // Purchase it and transfer ownership to the buyer
        _product.owner = msg.sender;

        // Mark as purchased
        _product.purchased = true;

        // Update the product
        products[_id] = _product;

        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);

        // Trigger an event
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}
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
        address owner;
        bool purchased;
    }

    event ProductCreated(
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
}
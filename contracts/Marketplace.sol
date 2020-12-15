pragma solidity ^0.5.0;

// Handle business logic for buying and selling items on the blockchain
contract Marketplace{
    // State variable, data that stored on the blockchain
    // 'public' will create a function that allows other contract to get this value 
    string public name;

    // It get run only once when the contract is deployed
    constructor() public{
        name = "Drink Place";
    }
}
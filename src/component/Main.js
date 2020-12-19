import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
        <div id="content">
            <h1>Add product</h1>
            <form onSubmit={(event) => {
                event.preventDefault();

                // Note: when transfering ETH, it is done in wei
                const name = this.productName.value;
                const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether');
                this.props.createProduct(name, price);
            }}>
                <div className="form-group mr-sm-2">
                    <input
                        id="productName"
                        type="text"
                        ref={(input) => {this.productName = input }}
                        className="form-control"
                        placeholder="Product Name"
                        required />
                </div>
                <div className="form-group mr-sm-2">
                    <input
                        id="productPrice"
                        type="text"
                        ref={(input) => {this.productPrice = input }}
                        className="form-control"
                        placeholder="Product Price"
                        required />
                </div>
                <button type="submit" className="btn btn-warning">Add Product</button>
            </form>
        </div>
    );
  }
}

export default Main;

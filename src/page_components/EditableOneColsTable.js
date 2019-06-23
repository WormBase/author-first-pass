import {Component} from "react";
import React from "react";
import {Button, FormControl, Glyphicon, Table} from "react-bootstrap";

class OneColumnEditableTable extends Component {
    constructor(props) {
        super(props);

        //  this.state.products = [];
        this.state = {};
        this.state.products = props["products"];

        this.handleProductTable = this.handleProductTable.bind(this);
        this.updateProducts = this.updateProducts.bind(this);
    }
    handleRowDel(product) {
        var index = this.state.products.indexOf(product);
        this.state.products.splice(index, 1);
        this.setState(this.state.products);
        this.props.tableChangedCallback(this.state.products, this.props["stateVarName"]);
    };

    handleAddEvent(evt) {
        var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
        var product = {
            id: id,
            name: ""
        };
        this.state.products.push(product);
        this.setState(this.state.products);
        this.props.tableChangedCallback(this.state.products, this.props["stateVarName"]);
    }

    handleProductTable(evt) {
        var item = {
            id: evt.target.id,
            name: evt.target.name,
            value: evt.target.value
        };
        var products = this.state.products.slice();
        var newProducts = products.map(function(product) {
            for (var key in product) {
                if (key === item.name && product.id.toString() === item.id) {
                    product[key] = item.value;
                }
            }
            return product;
        });
        this.setState({products:newProducts});
        this.props.tableChangedCallback(newProducts, this.props["stateVarName"]);
        //  console.log(this.state.products);
    };

    updateProducts(newProducts) {
        this.setState({products: newProducts});
    }
    render() {

        return (
            <div>
                <label>{this.props["title"]}</label>
                <ProductTable onProductTableUpdate={this.handleProductTable.bind(this)}
                              onRowAdd={this.handleAddEvent.bind(this)}
                              onRowDel={this.handleRowDel.bind(this)}
                              products={this.state.products}
                              filterText={this.state.filterText}
                              sampleText={this.props.sampleText}
                />
            </div>
        );

    }

}
class ProductTable extends React.Component {

    render() {
        var onProductTableUpdate = this.props.onProductTableUpdate;
        var rowDel = this.props.onRowDel;
        let sampleText = this.props.sampleText;
        return (
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>&nbsp;</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.props.products.map(function(product) {
                        return (<ProductRow onProductTableUpdate={onProductTableUpdate} product={product} onDelEvent={rowDel.bind(this)} key={product.id} sampleText={sampleText}/>)
                    })}

                    </tbody>
                </Table>
                <Button onClick={this.props.onRowAdd}><Glyphicon glyph={"plus-sign"}/></Button>
            </div>
        );

    }

}

class ProductRow extends React.Component {
    onDelEvent() {
        this.props.onDelEvent(this.props.product);

    }
    render() {

        return (
            <tr>
                <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
                    type: "name",
                    value: this.props.product.name,
                    id: this.props.product.id
                }} sampleText={this.props.sampleText}/>
                <td>
                    <Button onClick={this.onDelEvent.bind(this)}><Glyphicon glyph={"minus-sign"}/></Button>
                </td>
            </tr>
        );

    }

}
class EditableCell extends React.Component {

    render() {
        return (
            <td>
                <FormControl type='text' name={this.props.cellData.type} placeholder={this.props.sampleText} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate}/>
            </td>
        );

    }

}

export default OneColumnEditableTable;


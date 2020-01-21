import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Card, Column, Level, Table} from 'rbx';
import Sidebar from "react-sidebar";

const Filler = ({}) => (
  <div>test</div>
);

var cartOverlayStyle = {
  visibility: 'hidden'
};

const App = () => {
  const [data, setData] = useState({});
  const [cartOpen, setCartOpen] = useState(true);
  const [cartContents, setCartContents] = useState([{"title": "Tso 3D Short Sleeve T-Shirt A", "price": 10.9, "count": 2, "size": "XL"}, {"title": "Tso 3D Short Sleeve T-Shirt A", "price": 10.9, "count": 2, "size": "M"}]);
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  //console.log(cartContents);

  return (
    <div>
      <HeadBar state={{cartOpen, setCartOpen}}/>
      <Sidebar style={cartOverlayStyle} sidebar={<CartContent state={{cartOpen, setCartOpen, cartContents, setCartContents}} />} test={cartContents} open={cartOpen}  styles={{ sidebar: { background: "white", position: "fixed" } }}/>

      <CardGrid products={products} state={{cartOpen, setCartOpen, cartContents, setCartContents}} />
    </div>
  );
};


 

function totalCost(itemsArr) {
  var totalcost = 0;
  itemsArr.forEach(obj => totalcost += obj.price * obj.count);
  return totalcost.toString();
}

const CartContent = ({state}) => {
  console.log(state.cartContents);
  return(
    <div>
      <Title> Shopping Cart </Title>
      <Table>
        <Table.Body>
          <React.Fragment>
           { state.cartContents.map(obj => CartItemCell(obj, state) ) }
          </React.Fragment>
            <Table.Row>
              <Table.Cell>
                {'total price = $' + totalCost(state.cartContents)}
              </Table.Cell>
            </Table.Row>
        </Table.Body>
      </Table>
      {CartCloseButton("Close cart", state)}
    </div>
  );
};

const CartItem = ({item}) => (
  <Table.Row>
    <Table.Cell>
      {item.title + ' ' + item.size + ' x' + item.count + ': $' + item.price*item.count}
    </Table.Cell>
  </Table.Row>
);

function CartItemCell(item, state) {
  var temp;
  function handleClick(e) {
    e.preventDefault();
    state.setCartContents(removeCartContents(state.cartContents, item, false));
    state.setCartOpen(false);
  }

  return (
  <Table.Row>
    <Table.Cell onClick={handleClick}>
      {item.title + ' ' + item.size + ' x' + item.count + ': $' + item.price*item.count}
    </Table.Cell>
  </Table.Row>
  )
}

function removeCartContents(contents, item, operation) {
  var localItem;
  var outArr;
  var index;
  if(operation == false) {
    localItem = contents.find(obj => ((obj.title === item.title) && (obj.size === item.size)));
    if(localItem.count > 1) {
      outArr = contents;
      index = outArr.indexOf(localItem);
      outArr[index] = {"title": localItem.title, "price": localItem.price, "count": (localItem.count-1), "size": localItem.size};
      return outArr;
    }
    if(localItem.count == 1) {
      outArr = contents;
      index = outArr.indexOf(localItem);
      outArr.splice(index, 1);
      return outArr;
    }
  }
  console.log("there was a major problem in alterCartContents");

}

function addCartContents(contents, item, operation, size) {
  var localItem;
  var outArr;
  var index;
  if(operation == true) {
    localItem = contents.find(obj => ((obj.title === item.title) && (obj.size === size)));
    console.log(localItem);
    if(localItem === undefined) {
      outArr = contents;
      outArr.push({"title": item.title, "price": item.price, "count": 1, "size": size});
      return outArr;
    }
    if(localItem.count > 0) {
      outArr = contents;
      index = outArr.indexOf(localItem);
      outArr[index] = {"title": localItem.title, "price": localItem.price, "count": (localItem.count+1), "size": size};
      return outArr;
    }
  }
  console.log("there was a major problem in alterCartContents");

}

function CartOpenButton(text, charZIndex, state) {
  function handleClick(e) {
    e.preventDefault();
    state.setCartOpen(true);
  }

  return (
    <Button style={{zIndex: charZIndex.toString()}} onClick={handleClick}>{text}</Button>
  )
}

function CartCloseButton(text, state) {
  function handleClick(e) {
    e.preventDefault();
    state.setCartOpen(false);
  }

  return (
    <Button onClick={handleClick}>{text}</Button>
  )
}

function CartAddButton(text, charZIndex, state, item, size) {
  function handleClick(e) {
    e.preventDefault();
    state.setCartContents(addCartContents(state.cartContents, item, true, size));
    state.setCartOpen(true);
  }

  return (
    <Button style={{zIndex: charZIndex.toString()}} onClick={handleClick}>{text}</Button>
  )
}

const HeadBar = ({state}) => (

  <Level>
    <Level.Item>
      {CartOpenButton("Shopping Cart", 3, state)}
    </Level.Item>
  </Level>
);

const CardGrid = ({ products, state }) => ( 
  <Column.Group>
    {[4, 3, 2, 1].map(i => (
      <Column key={i}>          
        <ColumnContent state={state} cardsArr={products.slice(((products.length/4)*(i-1)), ((products.length/4)*(i)))} />
      </Column>
      )
    )}
  </Column.Group>
);

const ColumnContent = ({ cardsArr, state }) => (
  <React.Fragment>
    { cardsArr.map(obj => <ItemCard item={ obj } state={state} /> ) }
  </React.Fragment>
);

const ItemCard = ({ item, state }) => (
  <Card style={{marginTop:"20px"}}>
    <Card.Header />
    <Card.Header.Title>{item.title}</Card.Header.Title>
    <Card.Image><img src={require('../public/data/products/'+item.sku+'_1.jpg')} /></Card.Image>
    <Card.Content>
      {item.description}<br />
      {'$'+item.price}
    </Card.Content>
    <Card.Footer>
      <Button.Group>
        {CartAddButton("S", 0, state, item, "S")}
        {CartAddButton("M", 0, state, item, "M")}
        {CartAddButton("L", 0, state, item, "L")}
        {CartAddButton("XL", 0, state, item, "XL")}
      </Button.Group>
    </Card.Footer>
  </Card>
);

export default App;

import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Card, Column, Level, Table} from 'rbx';
import Sidebar from "react-sidebar";
import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCp8f6uJppp1EdSoGbIX7WPlkInCNaeQcA",
  authDomain: "learnreact-2a7f9.firebaseapp.com",
  databaseURL: "https://learnreact-2a7f9.firebaseio.com",
  projectId: "learnreact-2a7f9",
  storageBucket: "learnreact-2a7f9.appspot.com",
  messagingSenderId: "212836049594",
  appId: "1:212836049594:web:5ce6da4952920205591883"
};


firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const Filler = ({}) => (
  <div>test</div>
);


var cartOverlayStyle = {
  visibility: 'hidden'
};

const App = () => {
  const [data, setData] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartContents, setCartContents] = useState([]);
  const [inventory, setInventory] = useState({});
  const products = Object.values(data);
  const inventoryReal = Object.values(inventory);


  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setInventory(snap.val());
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  console.log(inventory);

  return (
    <div>
      <HeadBar state={{cartOpen, setCartOpen}}/>
      <Sidebar style={cartOverlayStyle} sidebar={<CartContent state={{cartOpen, setCartOpen, cartContents, setCartContents, inventory, setInventory}} />} test={cartContents} open={cartOpen}  styles={{ sidebar: { background: "white", position: "fixed" } }}/>

      <CardGrid products={products} state={{cartOpen, setCartOpen, inventory, setInventory, cartContents, setCartContents}} />
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

function CartItemCell(item, state) {
  var temp;
  function handleClick(e) {
    e.preventDefault();
    console.log(item);
    state.setCartContents(removeCartContents(state.cartContents, item, false));
    state.setInventory(plusInventory(state.inventory, item.sku, item.size));
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
      outArr[index] = {"title": localItem.title, "price": localItem.price, "count": (localItem.count-1), "size": localItem.size, "sku": localItem.sku};
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
      outArr.push({"title": item.title, "price": item.price, "count": 1, "size": size, "sku": item.sku});
      return outArr;
    }
    if(localItem.count > 0) {
      outArr = contents;
      index = outArr.indexOf(localItem);
      outArr[index] = {"title": localItem.title, "price": localItem.price, "count": (localItem.count+1), "size": size, "sku": item.sku};
      return outArr;
    }
  }
  console.log("there was a major problem in alterCartContents");

}

function minusInventory(inventory, sku, size) {
  var localInventory = inventory;

  switch(size) {
    case "S":
      localInventory[sku]["S"] = localInventory[sku]["S"]-1;
      break;
    case "M":
      localInventory[sku]["M"] = localInventory[sku]["M"]-1;
      break;
    case "L":
      localInventory[sku]["L"] = localInventory[sku]["L"]-1;
      break;
    case "XL":
      localInventory[sku]["XL"] = localInventory[sku]["XL"]-1;
      break;
    default:
      break;
  }

  return localInventory;
  
}

function plusInventory(inventory, sku, size) {
  var localInventory = inventory;

  switch(size) {
    case "S":
      localInventory[sku]["S"] = localInventory[sku]["S"]+1;
      break;
    case "M":
      localInventory[sku]["M"] = localInventory[sku]["M"]+1;
      break;
    case "L":
      localInventory[sku]["L"] = localInventory[sku]["L"]+1;
      break;
    case "XL":
      localInventory[sku]["XL"] = localInventory[sku]["XL"]+1;
      break;
    default:
      break;
  }

  return localInventory;
  
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
  console.log("it me add button");
  function handleClick(e) {
    e.preventDefault();
    state.setCartContents(addCartContents(state.cartContents, item, true, size));
    state.setInventory(minusInventory(state.inventory, item.sku, size));
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
        <React.Fragment>
        {switchCartAddButton("S", 0, state, item, "S")}
        {switchCartAddButton("M", 0, state, item, "M")}
        {switchCartAddButton("L", 0, state, item, "L")}
        {switchCartAddButton("XL", 0, state, item, "XL")}
        </React.Fragment>
      </Button.Group>
    </Card.Footer>
  </Card>
);

const OutStockButton = ({}) => (
  <Button>"Out of stock"</Button>
);

function switchCartAddButton(label, zIndex, state, item, size) {

  var sku = item.sku;
  if(typeof(state.inventory[sku]) === undefined)
    return;
  if(state.inventory[sku] == null)
    return;
  console.log(state.inventory);
  if(label === "S")
    if(state.inventory[sku]["S"] === 0)
      if(state.inventory[sku]["M"] === 0)
        if(state.inventory[sku]["L"] === 0)
          if(state.inventory[sku]["XL"] === 0)
            return "Out of stock";

  if(state.inventory[sku][size] === 0)
    return;
  console.log("returning addbutton");
  return CartAddButton(label, 0, state, item, size);
}

export default App;

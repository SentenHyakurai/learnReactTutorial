import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Card, Column, Level, Table} from 'rbx';
import Sidebar from "react-sidebar";

const Filler = ({}) => (
  <div>test</div>
);



const App = () => {
  const [data, setData] = useState({});
  const [cartOpen, setCartOpen] = useState(true);
  const [cartContents, setCartContents] = useState([{"title": "Tso 3D Short Sleeve T-Shirt A", "price": 10.9, "count": 2, "size": "XL"}, {"title": "Tso 3D Short Sleeve T-Shirt A", "price": 10.9, "count": 2, "size": "M"}]);
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {s
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  console.log(products.length);

  return (
    <div>
      <HeadBar />
      <Sidebar sidebar={<CartContent itemsArr={cartContents} />} open={cartOpen}  styles={{ sidebar: { background: "white" } }}/>
      <CardGrid products={products} />
    </div>
  );
};

function totalCost(itemsArr) {
  var totalcost = 0;
  itemsArr.forEach(obj => totalcost += obj.price * obj.count);
  return totalcost.toString();
}

const CartContent = ({itemsArr}) => (
    <div>
      <Title> Shopping Cart </Title>
      <Table>
        <Table.Body>
          <React.Fragment>
           { itemsArr.map(obj => <CartItem item={ obj } /> ) }
          </React.Fragment>
            <Table.Row>
              <Table.Cell>
                {'total price = $' + totalCost(itemsArr)}
              </Table.Cell>
            </Table.Row>
        </Table.Body>
      </Table>
    </div>
);

const CartItem = ({item}) => (
  <Table.Row>
    <Table.Cell>
      {item.title + ' ' + item.size + ' x' + item.count + ': $' + item.price*item.count}
    </Table.Cell>
  </Table.Row>
);

const HeadBar = ({}) => (

  <Level>
    <Level.Item>
      <Button>Shopping Cart</Button>
    </Level.Item>
  </Level>
);

const CardGrid = ({ products }) => ( 
  <Column.Group>
    {[4, 3, 2, 1].map(i => (
      <Column key={i}>          
        <ColumnContent cardsArr={products.slice(((products.length/4)*(i-1)), ((products.length/4)*(i)))} />
      </Column>
      )
    )}
  </Column.Group>
);

const ColumnContent = ({ cardsArr }) => (
  <React.Fragment>
    { cardsArr.map(obj => <ItemCard item={ obj } /> ) }
  </React.Fragment>
);

const ItemCard = ({ item }) => (
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
        <Button>S</Button>
        <Button>M</Button>
        <Button>L</Button>
        <Button>XL</Button>
      </Button.Group>
    </Card.Footer>
  </Card>
);

export default App;

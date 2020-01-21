import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Card, Column} from 'rbx';

const Filler = ({}) => (
  <div>test</div>
);

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  console.log(products.length);

  return (
    <CardGrid products={products} />
  );
};

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
  <Title>{ item.title }</Title>
);

export default App;

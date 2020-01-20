import React, { useEffect, useState } from 'react';
import 'rbx/index.css';
import { Button, Container, Title, Card, Column} from 'rbx';

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

  return (
    <ul>
      {products.map(product => <li key={product.sku}>{product.title}</li>)}
    </ul>
  );
};

function splitData(data) {
  var count = 0;
  var col0 = [];
  var col1 = [];
  var col2 = [];
  var col3 = [];
  while(count < data.length) {
    switch(count % 4) {
      case 0:
        col0.push(data[count]);
      break;
      case 1:
        col1.push(data[count]);
      break;
      case 2:
        col2.push(data[count]);
      break;
      case 3:
        col3.push(data[count]);
      break;
      default:
       console.log("There was a problem in splitData function");
      break;
    }
  }

  return [col0, col1, col2, col3];
}

const cardGrid = ({ cards }) => (
  <Column.Group>
    
  </Column.Group>
);

const itemCard = ({ item }) => (
  <Card>{ item }</Card>
);

export default App;

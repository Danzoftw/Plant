import { Card, Container, Col, Row  } from 'react-bootstrap';

const Product = ( props ) => {

  const { product } = props;

  return (
        <Col sm={4} className="card mb-3">
          <h3 className="card-header">{ product.name }</h3>
          <img 
              src={ product.image.sourceUrl }
              alt="Product image"
          />
          <div className="">
            <h6 className="card-subtitle text-muted text-center p-3">  { product.price } </h6>
          </div>
          <div className="view-product">
            <p className="btn btn-secondary">View</p>
          </div>
        </Col>
  );
}

export default Product;
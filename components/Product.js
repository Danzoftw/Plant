import { Card, Container, Col, Row  } from 'react-bootstrap';
import Link from 'next/link';

const Product = ( props ) => {

  const { product } = props;
// console.warn('product', product);
  return (
        <Col sm={4} className="card mb-3">
          <h3 className="card-header">{ product.name }</h3>
          <Link as={`/product/${ product.slug }-${ product.databaseId}`} href={`/product?slug=${ product.slug }-${ product.databaseId}`}>
            <a className="card-body">
              <img className="img-fluid"
                  src={ product.image.sourceUrl }
                  alt="Product image"
              />
            </a>
          </Link>
          <div className="">
            <h6 className="card-subtitle text-muted text-center p-3">  </h6>
          </div>
        </Col>
  );
}

export default Product;
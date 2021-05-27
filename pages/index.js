import Layout from '../components/Layout';

import client from '../components/ApolloClient';

import Product from '../components/Product';

import { Card, Container, Col, Row  } from 'react-bootstrap';

import gql from 'graphql-tag';

const PRODUCTS_QUERY = gql`query{
        products(first: 20) {
            nodes {
                id
                databaseId
                averageRating
                slug
                description
                image {
                    uri
                    title
                    srcSet
                    sourceUrl
                }
            name
            }
        }
}`;

const Index = ( props ) => {

    const { products } = props;

    return (
        <Layout>
            <Container>
                <Row className="product-container">
                    { products.length ? (
                        products.map( product => <Product key={ product.id } product={ product } /> )
                    ) : ''}
                </Row>
            </Container>
        </Layout>
    )
};

Index.getInitialProps = async () => {
    const result = await client.query( { query: PRODUCTS_QUERY })
    return {
        products: result.data.products.nodes
    }
};

export default Index;
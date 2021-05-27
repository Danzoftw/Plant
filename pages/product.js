import Link from 'next/link';
import Layout from '../components/Layout';
import { withRouter } from 'next/router';
import client from "../components/ApolloClient";
import gql from 'graphql-tag';

const Product = withRouter ( props  => {
    console.warn( props );
    return(
       
        <div>Product</div>
    )
});

Product.getInitialProps = async function( context ){

    let{ query: { slug } } = context;
    const id = slug ? parseInt( slug.split( '-' ).pop() ) : context.query.id;

    const PRODUCTS_QUERY = gql`query Product( $id: Int ! ){
        productBy( mediaItemId: $id){
            id
            averageRating
            slug
            description
            image {
                uri
                title
                srcSet
                sourceUrl
                mediaItemId
            }
            name
        }
    }`;

    const res = await client.query(({
        query: PRODUCTS_QUERY,
        variables: { id }
    }));
    return {
        product: res.data.productBy
    }
};

export default Product;
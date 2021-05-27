import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Stylesheet.css";

const Layout = ( props ) => {
    return (
        <div>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Header/>
          
        { props.children }
        <Footer/>
        </div>
    )
}

export default Layout;
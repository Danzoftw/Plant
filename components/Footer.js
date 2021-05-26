import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

const Footer = () => {
   return(
        <section className="footer theme bg-covid-color">
            <Container className="py-3 py-sm-5">
                <Row className="py-lg-5 flex-column-reverse flex-lg-row">
                    <Col lg={5} md={12} className="py-3 py-sm-0">
                        <div className="footer-text">
                            <div className="title">
                                <p className="theme color-white footer-40 font-weight-600">plantisserie</p>
                            </div>
                            <div className="paragraph">
                                <p className="theme color-white footer-medium font-weight-400">As an alternative theory, (and because Latin scholars do this sort of thing) someone tracked down a 1914 Latin edition of De Finibus which challenges McClintock's 15th century claims and suggests that the dawn of lorem ipsum was as recent as the 20th century.</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={2} md={12} className="py-3 py-sm-0">
                        <div className="jump-to pl-lg-5">
                            <div className="title">
                                <p className="mb-0 theme color-white very-small-font font-weight-600">JUMP TO</p>
                            </div>
                            <div className="items-main">
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">Home</p>
                                </div>
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">Store</p>
                                </div>
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">Gardenia</p>
                                </div>
                                <div className="items">
                                    <p className="them very-small-font font-weight-400 my-2">Green Thumb</p>
                                </div>
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">Create a Gift</p>
                                </div>
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">About Us</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={2} md={12} className="py-3 py-sm-0">
                        <div className="jump-to pl-lg-5">
                            <div className="title">
                                <p className="mb-0 theme color-white very-small-font font-weight-600">SOCIAL</p>
                            </div>
                            <div className="items-main">
                                <div className="items d-flex align-items-center">
                                    <img
                                        src='/fbicon.svg'
                                    />
                                     <a href="www.google.com" className="theme color-footer-color-1 pl-2 theme very-small-font font-weight-400 my-2 text-decoration-none">Facebook</a>
                                </div>
                                <div className="items d-flex align-items-center">
                                    <img
                                        src='/instaicon.svg'
                                    />
                                    <a href="www.google.com" className="theme color-footer-color-1 pl-2 theme very-small-font font-weight-400 my-2 text-decoration-none">Instagram</a>
                                </div>
                                <div className="items">
                                    <span className="theme very-small-font font-weight-600 my-2 theme color-white">COMPANY</span>
                                </div>
                                <div className="items">
                                    <p className="them very-small-font font-weight-400 my-2">Returns Policy</p>
                                </div>
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">Shipping Policy</p>
                                </div>
                                <div className="items">
                                    <p className="theme very-small-font font-weight-400 my-2">FAQs</p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3} md={12} className="py-3 py-sm-0">
                        <div className="jump-to pl-lg-5">
                            <div className="title">
                                <p className="theme color-white very-small-font font-weight-600">CONTACT</p>
                            </div>
                            <div className="items-main">
                                <div className="items my-2">
                                    <a href="tel:+ 983 459 6488" className="theme font-hk font-weight-400 footer-20 text-decoration-none theme color-white">+ 983 459 6488</a>
                                </div>
                                <div className="items my-2">
                                    <a className="theme color-footer-color-1 very-small-font font-weight-400 text-decoration-none" href="mailto:hello@plantisserie.in">hello@plantisserie.ins</a>  
                                </div>
                            </div>
                            <div className="back-to-top position-absolute">
                                <p className="theme color-footer-color-1">back to top</p>
                            </div>
                        </div>
                    </Col>
                </Row>
               
            </Container>
            <Container className="pb-5 container">
                <Row>
                    <Col lg={6} md={12} className="py-3 py-sm-0">
                        <div className="all-rights">
                            <p className="theme color-footer-color-1 footer-medium font-weight-400">© Plantisserie, 2021. All Rights Reserved • Star powered by ioDroplet ⭐</p>
                        </div>
                    </Col>
                    <Col lg={6} md={12}>
                        <div className="payments d-flex justify-content-center justify-content-md-end pr-lg-5">
                            <div className="img-1 px-3">
                                <Image
                                    src='shiprocket.png'
                                />
                            </div>
                            <div className="img-2 px-3">
                                <Image
                                    src='.payu.png'
                                />
                            </div>
                            <div className="img-3 px-3">
                                <Image
                                    src='gpay.png'
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
   );
}

export default Footer;
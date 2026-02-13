import React from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../components/ui/PageWrapper';
import Container from '../components/ui/Container';

const ProductDetail = () => {
    const { id } = useParams();

    return (
        <PageWrapper>
            <Container>
                <h1>Product Detail</h1>
                <p>Product ID: {id}</p>
            </Container>
        </PageWrapper>
    );
};

export default ProductDetail;

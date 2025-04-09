import { Product } from "@/features/products/product";
import { Helmet } from "react-helmet";

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <Product />
    </>
  );
};

export default Products;

import React from "react";

const Product = ({ product,onAddToCart }) => {
  
  return (
    <div className="col-lg-6">
      <div className="card m-1">
        <div className="card-body">
          <h5>
            <i className="fa fa-arrow-right"></i>
            {product.productName}
          </h5>
          <div>${product.price.toFixed(2)}</div>
          <div className="mt-2">
            {" "}
            #{product.brand.brandName} #{product.category.categoryName}
          </div>
          <div>
            {[...Array(product.rating).keys()].map((prd) => {
              return <i className="fa fa-star text-warning" key={prd}></i>;
            })}
          </div>
          <div className="float-end">
            {product.isOrdered ? (
              <span className="text-primary">Added to cart</span>
            ) : (
              <button onClick={()=>onAddToCart(product)} className="btn btn-sm btn-primary">
                <i className="fa fa-cart-plus"></i>Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;

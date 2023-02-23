import React, { useContext, useEffect, useState } from "react";
import {
  BrandService,
  CategoriesService,
  ProductService,
} from "../components/OrdersService";
import Product from "./Product";
import UserContext from "../UserContext";

const Store = () => {
  const userContext = useContext(UserContext);
  const [brands, setbrands] = useState([]);
  const [productToShow, setProductToShow] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setcategories] = useState([]);
  const [products, setProducts] = useState([]);
  

  useEffect(() => {
    (async () => {
      let brandProducts = await BrandService.fetchBrands();

      let responseBrandProduct = await brandProducts.json();
      responseBrandProduct.forEach((brand) => {
        brand.isChecked = true;
      });

      setbrands(responseBrandProduct);

      let CategoriesProducts = await CategoriesService.fetchCategories();

      let responseCategoriesProduct = await CategoriesProducts.json();
      responseCategoriesProduct.forEach((category) => {
        category.isChecked = true;
      });

      setcategories(responseCategoriesProduct);

      let Products = await fetch(
        `http://localhost:5000/products?productName_like=${search}`,{method:'GET'}
      );
      if (Products.ok) {
        let responseProduct = await Products.json();
        responseProduct.forEach((product) => {
          product.brand = BrandService.getBrandByBrandId(
            responseBrandProduct,
            product.brandId
          );
          product.category = CategoriesService.getCategoriesByCategorydId(
            responseCategoriesProduct,
            product.categoryId
          );

          product.isOrdered = false;
        });

        setProducts(responseProduct);
        setProductToShow(responseProduct);
      }
    })();
  }, [search]);

  const updateBrandCheck = (id) => {
    let brandData = brands.map((brd) => {
      if (brd.id === id) {
        brd.isChecked = !brd.isChecked;
      }
      return brd;
    });

    setbrands(brandData);
    updateProductToShow();
  };
  const updateCategoryCheck = (id) => {
    let categoryData = categories.map((category) => {
      if (category.id === id) {
        category.isChecked = !category.isChecked;
      }
      return category;
    });

    setcategories(categoryData);
    updateProductToShow();
  };

  const onAddToCart = async (prd) => {
    let newOrder = {
      userId: userContext.user.currentUserId,
      productId: prd.id,
      quantity: 1,
      isPaymentCompleted: false,
    };
    let orderResponse = await fetch("http://localhost:5000/orders", {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: { "Content-type": "application/json" },
    });
    if (orderResponse.ok) {
      let orderResponseBody = await orderResponse.json();
      let prods = products.map((prod) => {
        if (prod.id === prd.id) prd.isOrdered = true;
        return prod;
      });
      setProducts(prods);
      updateProductToShow();
    }
  };
  const updateProductToShow = () => {
    setProductToShow(
      products
        .filter((pro) => {
          return categories.filter(
            (cat) => cat.id === pro.categoryId && cat.isChecked
          ).length;
        })
        .filter((pro) => {
          return brands.filter((br) => br.id === pro.brandId && br.isChecked)
            .length;
        })
    );
  };

  return (
    <div>
      <div className="row py-3 header">
        <div className="col-lg-3">
          <h4>
            <i className="fa fa-shopping-bag"></i> Store {""}
            <span className="badge bg-secondary">
              {productToShow.length}
            </span>
          </h4>
        </div>
        <div className="col-lg-9">
          <input
            type="search"
            value={search}
            placeholder="search product"
            className="form-control"
            autoFocus="autofocus"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-lg-3 py-2">
          <div className="my-2">
            <h5> Brands</h5>
            <ul className="list-group list-group-flush">
              {brands.map((brand) => {
                return (
                  <li className="list-group-item" key={brand.id}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value="true"
                        checked={brand.isChecked}
                        id={`brand${brand.id}`}
                        onChange={() => {
                          updateBrandCheck(brand.id);
                        }}
                      />
                      <label
                        className="form-check-lable"
                        htmlFor={`brand${brand.id}`}
                      >
                        {" "}
                        {brand.brandName}
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="my-2">
            <h5> Categories</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category) => {
                return (
                  <li className="list-group-item" key={category.id}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value="true"
                        checked={category.isChecked}
                        id={`brand${category.id}`}
                        onChange={() => {
                          updateCategoryCheck(category.id);
                        }}
                      />
                      <label
                        className="form-check-lable"
                        htmlFor={`category${category.id}`}
                      >
                        {" "}
                        {category.categoryName}
                      </label>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="col-lg-9 py-2">
          <div className="row">
            {productToShow.map((product) => {
              return (
                <Product
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Store;

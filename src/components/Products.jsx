import React, { useEffect, useMemo, useState } from "react";
import {
  BrandService,
  CategoriesService,
  getSortService,
} from "./OrdersService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState([]);
  const [sort, setSort] = useState("productName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [originalProducts, setOriginalProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState("");

  useEffect(() => {
    (async () => {
      let brandResponse = await BrandService.fetchBrands();
      let brandResponseBody = await brandResponse.json();
      setBrands(brandResponseBody);

      let categoriesResponse = await CategoriesService.fetchCategories();
      let categoriesResponseBody = await categoriesResponse.json();

      let productResponse = await fetch(
        `http://localhost:5000/products?productName_like=${search}&_sort=productName&_order=ASC`,
        { method: "GET" }
      );
      let productResponseBody = await productResponse.json();
      productResponseBody.forEach((product) => {
        product.brand = BrandService.getBrandByBrandId(
          brandResponseBody,
          product.brandId
        );
        setProducts(productResponseBody);
        setOriginalProducts(productResponseBody);
        product.category = CategoriesService.getCategoriesByCategorydId(
          categoriesResponseBody,
          product.categoryId
        );
      });
    })();
  }, [search]);

  const onChangeArrow = (e, columnName) => {
    e.preventDefault();
    setSort(columnName);
    const changeArrow = sortOrder === "asc" ? "desc" : "desc" ? "asc" : "";
    setSortOrder(changeArrow);
    setProducts(
      getSortService.getSortArray(originalProducts, columnName, changeArrow)
    );
  };
  const getcolumn = (columnName, displayName) => {
    return (
      <>
        <a onClick={(e) => onChangeArrow(e, columnName)}>
          {displayName} {""}
        </a>

        {sort === columnName && sortOrder === "asc" ? (
          <i className="fa fa-sort-up"></i>
        ) : (
          ""
        )}
        {sort === columnName && sortOrder === "desc" ? (
          <i className="fa fa-sort-down"></i>
        ) : (
          ""
        )}
      </>
    );
  };
  const filterProducts = useMemo(() => {
    return originalProducts.filter(
      (opro) => opro.brand.brandName.indexOf(selectedBrands) >= 0
    );
  }, [(originalProducts, selectedBrands)]);
  useEffect(() => {
    setProducts(getSortService.getSortArray(filterProducts, sort, sortOrder));
  }, [filterProducts, sort, sortOrder]);
  return (
    <div className="row">
      <div className="col-12">
        <div className="row p-3 header">
          <div className="col-lg-3">
            <h5>
              <i className="fa fa-suitcase"></i>Products
              <span className="badge bg-secondary">{products.length}</span>
            </h5>
          </div>
          <div className="col-lg-6">
            <input
              type="search"
              value={search}
              placeholder="search"
              className="form-control"
              autoFocus="autofocus"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="col-lg-3">
            <select
              className="form-control"
              value={selectedBrands}
              onChange={(e) => setSelectedBrands(e.target.value)}
            >
              <option value="">All brands</option>
              {brands.map((brand) => {
                return (
                  <option value={brand.brandName} key={brand.id}>
                    {brand.brandName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="col-lg-10 mx-auto mb-2">
        <div className="card my-2 shadow">
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th> {getcolumn("productName", "productName")} </th>

                  <th>{getcolumn("price", "Price")}</th>
                  <th>{getcolumn("brand.brandName", "Brand")}</th>
                  <th>{getcolumn("category.categoryName", "Category")}</th>
                  <th>{getcolumn("rating", "Rating")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product.id}>
                      <td>{product.productName}</td>
                      <td>{product.price}</td>
                      <td>{product.brand.brandName}</td>
                      <td>{product.category.categoryName}</td>
                      <td>
                        {[...Array(product.rating).keys()].map((pr) => (
                          <i className="fa fa-star text-warning" key={pr}></i>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

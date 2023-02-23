import _ from "lodash"


export const OrdersService = {
  getPrevOrders: (orders) => {
    return orders.filter((ord) => ord.isPaymentCompleted === true);
  },
  getCartvOrders: (orders) => {
    return orders.filter((ord) => ord.isPaymentCompleted === false);
  },
};

export const ProductService = {
  getProductByProductId: (products, productId) => {
    return products.find((product) => product.id === productId);
  },
  fetchProducts: () => {
    return fetch("http://localhost:5000/products", {
      method: "GET",
    });
  },
};

export const BrandService={
  fetchBrands:()=>{return fetch("http://localhost:5000/brands", {
    method: "GET",
  })} ,
  getBrandByBrandId:(brands,brandId)=>{
    return  brands.find((brand)=>(brand.id===brandId))
   
  }

}
export const CategoriesService={
  fetchCategories:()=>{return fetch("http://localhost:5000/categories", {
    method: "GET",
  })} ,
  getCategoriesByCategorydId:(categories,categoryId)=>{
    return categories.find((category)=>category.id===categoryId)
   
  }

}

export const getSortService={
   getSortArray:(elements,sortBy,sortOrder)=>{
    if(!elements) return elements
    let array=[...elements]
    const sorted=_.orderBy(array,[sortBy],[sortOrder])
    return sorted
   }
}


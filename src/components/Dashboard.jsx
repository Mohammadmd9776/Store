import React, { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import Ord from "./Ord";
import { OrdersService, ProductService } from "./OrdersService";

function Dashboard() {
  const userContext = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  const loadDataFromDatabase = useCallback(async () => {
    let ordersResponse = await fetch(
      `http://localhost:5000/orders/?userid=${userContext.user.currentUserId}`,
      { method: "GET" }
    );
    if (ordersResponse.ok) {
      let OrdersResponseBody = await ordersResponse.json();
      let productsResponse = await ProductService.fetchProducts();
      if (productsResponse.ok) {
        let productsResponseBody = await productsResponse.json();

        OrdersResponseBody.forEach((order) => {
          order.product = ProductService.getProductByProductId(
            productsResponseBody,
            order.productId
          );
        });
      }
      setOrders(OrdersResponseBody);
    }
  }, [userContext.user.currentUserId]);
  const onDeleteClick = useCallback(
    async (orderId) => {
      if (window.confirm("Are You Sure To Delete")) {
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          {
            method: "DELETE",
          }
        );
        let responseBody = await orderResponse.json();
        if (orderResponse.ok) {
          loadDataFromDatabase();
        }
      }
    },
    [loadDataFromDatabase]
  );
  const onBuyNowClick = useCallback(
    async (orderId, userId, productId, quantity) => {
      if (window.confirm("Are You Sure?")) {
        let updateOrder = {
          id: orderId,
          userId: userId,
          productId: productId,
          quantity: quantity,
          isPaymentCompleted: true,
        };
        let orderResponse = await fetch(
          `http://localhost:5000/orders/${orderId}`,
          {
            method: "PUT",
            body: JSON.stringify(updateOrder),
            headers: { "Content-type": "application/json" },
          }
        );
        let responseBody = await orderResponse.json();
        if (orderResponse.ok) {
          loadDataFromDatabase();
        }
      }
    },
    [loadDataFromDatabase]
  );

  useEffect(() => {
    loadDataFromDatabase();
  }, [userContext.user.currentUserId, loadDataFromDatabase]);
  return (
    <div className="row">
      <div className="col-12 py-3 header">
        <h4>
          <i className="fa fa-dashboard"></i> Dashboard {""}
          <button className="btn btn-sm btn-info">
            <i className="fa fa-refresh"></i> Refresh
          </button>
        </h4>
      </div>
      <div className="col-12 row">
        <div className="col-lg-6">
          <h4 className="py-2 my-2 text-info border-bottom border-info">
            <i className="fa fa-history"></i> previous orders
            <span className="badge bg-info">
              {OrdersService.getPrevOrders(orders).length}
            </span>
          </h4>
          {OrdersService.getPrevOrders(orders).length == 0 ? (
            <div className="text-danger">No Orders </div>
          ) : (
            <div></div>
          )}
          {OrdersService.getPrevOrders(orders).map((ord) => {
            return (
              <Ord
                key={ord.id}
                productId={ord.productId}
                userId={ord.uerId}
                isPaymentCompleted={ord.isPaymentCompleted}
                quantity={ord.quantity}
                orderId={ord.id}
                product={ord.product}
                onBuyNowClick={onBuyNowClick}
                onDeleteClick={onDeleteClick}
              />
            );
          })}
        </div>
        <div className="col-lg-6">
          <h4 className="py-2 my-2 text-primary border-bottom border-primary">
            <i className="fa fa-shopping-cart"></i> current orders
            <span className="badge bg-primary">
              {OrdersService.getCartvOrders(orders).length}
            </span>
          </h4>
          {OrdersService.getCartvOrders(orders).length == 0 ? (
            <div className="text-danger">No Orders </div>
          ) : (
            <div></div>
          )}
          {OrdersService.getCartvOrders(orders).map((ord) => {
            return (
              <Ord
                key={ord.id}
                productId={ord.productId}
                userId={ord.uerId}
                isPaymentCompleted={ord.isPaymentCompleted}
                quantity={ord.quantity}
                orderId={ord.id}
                product={ord.product}
                onBuyNowClick={onBuyNowClick}
                onDeleteClick={onDeleteClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

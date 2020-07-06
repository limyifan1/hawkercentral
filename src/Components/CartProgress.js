import React from "react";

import LinearProgress from "@material-ui/core/LinearProgress";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

const totalPrice = (context, deliveryFee, discount) => 
  (
    Number(context.cartTotal.totalPrice) +
    Number(deliveryFee) -
    Number(discount)
  ).toFixed(2);

const LinearProgressWithLabel = (props) => 
  <Box display="flex" alignItems="center" flexDirection="column">
    <Box width="100%" mr={1}>
      <LinearProgress variant="determinate" {...props} />
    </Box>
  </Box>;

const ProgressIndicator = ({ totalPrice, targetValue, name }) =>
  <div class="row progress">
    {targetValue > totalPrice ? (
      <Grid container direction={"row"}>
        <Grid
          style={{
            color: "black",
            width: "100%",
            marginBottom: "20px",
            fontSize: "18px",
          }}
        >
          ${(targetValue - totalPrice).toFixed(2)} to {name.toLowerCase()} 
        </Grid>
        <Grid style={{ width: "100%" }}>
          <LinearProgressWithLabel
            value={
              (100 * totalPrice) / targetValue
            }
          />
        </Grid>
      </Grid>
    ) : (
      <h5 style={{ color: "green" }}>{name} Met!</h5>
    )}
  </div>

export default ({context, deliveryFee, discount}) => <>
  {context.channel === "delivery" ? <>
    {context.pageData.minimum_order && context.pageData.minimum_order !== "0" ? (
      <ProgressIndicator 
        totalPrice={context.cartTotal.totalPrice} 
        targetValue={context.pageData.minimum_order}
        name="Minimum Amount"
      />
    ) : null}
    {context.pageData.free_delivery && context.pageData.free_delivery !== "0" ? (
      <ProgressIndicator 
        totalPrice={context.cartTotal.totalPrice} 
        targetValue={context.pageData.free_delivery}
        name="Free Delivery"
      />
    ) : null}
    <div class="row">
      {(context.delivery_option === "none" ||
        !context.delivery_option) && (
        <div className="sub fees-not-included">DELIVERY FEES NOT INCLUDED</div>
      )}
      {(context.delivery_option === "fixed" ||
        context.delivery_option === "distance") &&
        context.delivery_fee !== undefined && (
          <React.Fragment>
            <div className="sub">DELIVERY FEES: </div>
            <div className="sub-price">
              <p className="sub-price__val">${deliveryFee.toFixed(2)}</p>
            </div>
          </React.Fragment>
        )}
    </div>
  </> : null}
  {(context.all_promo || context.selfcollect_promo) && discount > 0 ? (
    <div class="row">
      <div className="sub">DISCOUNT: </div>
      <div className="sub-price">
        <p className="sub-price__val">- ${discount}</p>
      </div>
    </div>
  ) : null}
  <div class="row">
    <div className="sub">SUBTOTAL</div>
    <div className="sub-price">
      {(context.delivery_option === "none" ||
        context.channel === "collect" || 
        (
          (context.delivery_option === "fixed" || context.delivery_option === "distance") &&
          context.channel === "delivery" &&
          context.delivery_fee !== undefined
        )) && (
        <p className="sub-price__val">${totalPrice(context, deliveryFee || 0, discount)}</p>
      )}
    </div>
  </div>
</>
// Copyright limyifan1 <limyifan1@gmail.com> 2020. All Rights Reserved.
// Node module: hawkercentral
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

// import { LanguageContext } from "./themeContext";

import "../App.css";
import { CartContext } from "./themeContext";
import { withSnackbar } from "notistack";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const ResponsiveDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const context = React.useContext(CartContext);

  const handleChange = (event) => {
    const targetId = event.currentTarget.name.substring(
      event.currentTarget.name.indexOf("-") + 1
    );
    console.log(targetId, addonsList[targetId].checked);
    addonsList[targetId].checked = !addonsList[targetId].checked;
  };

  var addonsList = [];
  var addons = [];
  if (props.addon) {
    props.addon.forEach((element, index) => {
      addonsList.push({
        index: index,
      });
      addons.push(
        <React.Fragment>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addonsList[index].checked}
                  onChange={handleChange}
                  name={"addon-" + index}
                  color={props.menu_color}
                />
              }
              color={props.menu_font_color}
              label={element.name + " ($" + element.price + ")"}
            />
          </div>
        </React.Fragment>
      );
    });
  }

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={props.dialog}
        onClose={props.toggleDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Would you like the following add ons?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{addons}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              context.addProduct(props.menuIndex, addonsList);
              props.toggleDialog();
            }}
            variant={"contained"}
            style={{
              backgroundColor: props.menu_color,
              color: props.menu_font_color,
            }}
          >
            Add To Cart
          </Button>
          <Button onClick={props.toggleDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export class PageItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dialog: false,
    };
  }
  handleClick = async (event) => {
    event.preventDefault();
    if (
      this.context.pageData.menu_combined[this.props.index].addon && this.context.pageData.menu_combined[this.props.index].addon.length > 0
    ) {
      this.toggleDialog();
    } else {
      this.props.enqueueSnackbar(
        "Added " + event.target.getAttribute("name") + " to Cart!",
        {
          variant: "success",
        }
      );
      this.context.addProduct(this.props.index);
    }
  };

  toggleDialog = () => {
    this.setState({
      dialog: !this.state.dialog,
    });
  };

  thumbnail = () => {
    return `https://images.weserv.nl/?w=400&url=${encodeURIComponent(
      this.props.pic
    )}`;
  };

  render() {
    var menu_color =
      this.props && this.props.css && this.props.css.menu_color
        ? this.props.css.menu_color
        : "#b48300";
    const menu_font_color =
      this.props && this.props.css ? this.props.css.menu_font_color : "#ffffff";
    return (
      <React.Fragment>
        <ResponsiveDialog
          dialog={this.state.dialog}
          toggleDialog={this.toggleDialog}
          addon={this.props.addon}
          menu_color={menu_color}
          menu_font_color={menu_font_color}
          menuIndex={this.props.index}
        />
        <div class="page-card">
          <div
            class="card shadow"
            style={{
              paddingLeft: "0px !important",
              paddingRight: "0px !important",
            }}
          >
            <div
              class="row no-gutters justify-content-center"
              style={{
                paddingLeft: "0px !important",
                paddingRight: "0px !important",
                marginLeft: "0px !important",
                marginRight: "0px !important",
              }}
            >
              {this.props.pic ? (
                <div class="col-4 col-xs-3 col-sm-3 col-md-3 col-lg-4 fill">
                  <LazyLoadImage
                    src={this.props.pic ? this.thumbnail() : null}
                    placeholderSrc={null}
                    class="card-img-left"
                    alt=""
                  />
                </div>
              ) : null}
              <div
                class="col-8 col-xs-9 col-sm-9 col-md-9 col-lg-8 card-text"
                style={{
                  padding: "10px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div class="card-block">
                  <h4
                    class="card-page-title align-items-center"
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span>
                      <span style={{ color: menu_color }}>
                        {this.props.quantity
                          ? this.props.quantity + " x "
                          : null}
                      </span>
                      {this.props.name}
                    </span>
                  </h4>
                  {this.props.summary ? (
                    <h6
                      class="card-page-subtitle mb-2 text-muted small d-flex justify-content-center"
                      style={{ marginBottom: "0px" }}
                    >
                      {this.props.summary}
                    </h6>
                  ) : null}
                  <p
                    class="card-text item-title d-flex align-items-center justify-content-center"
                    style={{ marginBottom: "5px", fontSize: "20px" }}
                  >
                    ${this.props.price}
                  </p>
                  {this.context.pageData.whatsapp ? (
                    <div
                      class="btn btn-primary"
                      style={{
                        backgroundColor: menu_color,
                        borderColor: menu_color,
                        color: menu_font_color,
                        fontSize: "12px",
                      }}
                      name={this.props.name}
                      onClick={this.handleClick}
                    >
                      Add To Cart
                    </div>
                  ) : null}
                  {/* {this.context.cartProducts} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
PageItem.contextType = CartContext;
export default withSnackbar(PageItem);

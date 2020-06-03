import React, { useContext } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { CartContext } from "./themeContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import placeholder from "../placeholder.png";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
const thumbnail = (pic) => {
  return `https://images.weserv.nl/?w=400&url=${encodeURIComponent(pic)}`;
};

class DashboardItem extends React.Component {
  render() {
    return (
      <div class="page-card">
        <div
          class="card shadow"
          style={{
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
          }}
        >
          <div
            class="row no-gutters"
            style={{
              paddingLeft: "0px !important",
              paddingRight: "0px !important",
              marginLeft: "0px !important",
              marginRight: "0px !important",
            }}
          >
            <div class="col-5 col-xs-3 col-sm-3 col-md-5 fill">
              <LazyLoadImage
                src={this.props.pic ? thumbnail(this.props.pic) : placeholder}
                placeholderSrc={placeholder}
                class="card-img-left"
                alt=""
              />
            </div>
            <div
              class="col-7 col-xs-9 col-sm-9 col-md-7 card-text"
              style={{
                padding: "10px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div class="card-block">
                <h4
                  class="card-page-title d-flex align-items-center"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span>
                    <span>
                      {this.props.quantity ? this.props.quantity + " x " : null}
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
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const context = useContext(CartContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {["Menu", "Info"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const getMenu = () => {
    if (context.pageData.menu_combined) {
      let data = [];
      context.pageData.menu_combined.forEach((element, i) => {
        // If without_first_item, condition should be (element.name && element.price && i !== 0)) [1]
        // Else condition should only be (element.name && element.price) [2]
        let toPush = true;
        if (toPush) {
          data.push(
            <DashboardItem
              quantity={element["quantity"]}
              name={element["name"]}
              price={element["price"]}
              pic={element["image"]}
              summary={element["description"]}
              css={context.css}
              index={i}
            />
          );
        }
      });
      return data;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Menu Settings
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div className="row justify-content-center align-items-center mt-4">
          {getMenu()}
        </div>
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
DashboardItem.contextType = CartContext;
export default ResponsiveDrawer;

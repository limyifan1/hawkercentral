import React from "react";
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
// import placeholder from "../placeholder.png";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

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

const DashboardItem = (props) => {
  console.log(props);
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
          class="row no-gutters justify-content-center"
          style={{
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
            marginLeft: "0px !important",
            marginRight: "0px !important",
          }}
        >
          {props.pic ? (
            <div class="col-4 col-xs-3 col-sm-3 col-md-3 col-lg-4 fill">
              <LazyLoadImage
                src={props.pic ? thumbnail(props.pic) : null}
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
              <p
                class="card-page-title align-items-center"
                style={{ marginBottom: "0px" }}
              >
                <span>
                  <TextField
                    required
                    label="Name"
                    id={"name-" + props.index}
                    value={props.name}
                    type="text"
                    style={{ width: "170px" }}
                    onChange={props.changeField}
                  />
                </span>
              </p>
              <p
                class="card-page-title align-items-center"
                style={{ marginBottom: "0px" }}
              >
                <TextField
                  id={"description-" + props.index}
                  label="Subtitle"
                  value={props.description}
                  type="text"
                  style={{ width: "170px" }}
                  onChange={props.changeField}
                />
              </p>
              <p
                class="card-page-title align-items-center"
                style={{ marginBottom: "0px" }}
              >
                <TextField
                  label="Price"
                  id={"price-" + props.index}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  type="number"
                  value={props.price}
                  style={{ width: "170px" }}
                  onChange={props.changeField}
                />
              </p>
              {/* {this.context.cartProducts} */}
            </div>
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
  );
};

const compareCheck = (prevProps, nextProps) => {
  return (
    prevProps.name === nextProps.name &&
    prevProps.description === nextProps.description &&
    prevProps.price === nextProps.price
  );
};

const WrappedDashboardItem = React.memo(DashboardItem, compareCheck);

const PageDashboard = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const context = useContext(CartContext);
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

  const changeField = React.useCallback(
    (e) => {
      props.changeField(e);
    },
    [props]
  );

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
          {/* <Menu data={props.data} changeField={props.changeField} /> */}
          {props.data.menu_combined
            ? props.data.menu_combined.map((element, i) => (
                <WrappedDashboardItem
                  name={element["name"]}
                  price={element["price"]}
                  pic={element["image"]}
                  description={element["description"]}
                  key={i}
                  index={i}
                  changeField={changeField}
                />
              ))
            : null}
        </div>
      </main>
    </div>
  );
};

PageDashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
DashboardItem.contextType = CartContext;
export default PageDashboard;

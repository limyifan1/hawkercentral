import React, { useRef } from "react";
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
import SaveIcon from "@material-ui/icons/Save";
import { useSnackbar } from "notistack";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";

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
  saveButton: {
    marginLeft: "auto",
    backgroundColor: "green",
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
  cardMedia: {
    height: 100,
    objectFit: "scale-down",
  },
}));

const thumbnail = (pic) => {
  return `https://images.weserv.nl/?w=400&url=${encodeURIComponent(pic)}`;
};

const DashboardItem = (props) => {
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
          class="row no-gutters justify-content-center align-items-center"
          style={{
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
            marginLeft: "0px !important",
            marginRight: "0px !important",
          }}
        >
          {props.pic ? (
            <React.Fragment>
              {props.pic === "loading" ? (
                <div class="col-4 col-xs-3 col-sm-3 col-md-3 col-lg-4 fill">
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                </div>
              ) : (
                <div
                  class="col-4 col-xs-3 col-sm-3 col-md-3 col-lg-4 fill"
                  style={{ height: "180px" }}
                >
                  <LazyLoadImage
                    src={thumbnail(props.pic)}
                    placeholderSrc={null}
                    class="card-img-left"
                    alt=""
                  />
                </div>
              )}
            </React.Fragment>
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
              component="label"
              color="default"
              startIcon={<CloudUploadIcon />}
              style={{ marginBottom: "5px", width: "170px" }}
            >
              <input
                type="file"
                class="custom-file-input"
                id={"image-" + props.index}
                style={{ display: "none" }}
                onChange={props.changeField}
              />
              {props.pic ? (
                <span>Replace Image</span>
              ) : (
                <span>Upload Image</span>
              )}
            </Button>
            <Button
              variant="contained"
              component="label"
              startIcon={<DeleteIcon />}
              style={{ backgroundColor: "red", color: "white", width: "170px" }}
              id={"delete-" + props.index}
              onClick={props.changeField}
            >
              Delete Item
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
    prevProps.price === nextProps.price &&
    prevProps.pic === nextProps.pic
  );
};

const WrappedDashboardItem = React.memo(DashboardItem, compareCheck);

const MenuSettings = (props) => {
  const classes = useStyles();
  const endRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const changeField = React.useCallback(
    (e) => {
      props.changeField(e);
      if (
        e.currentTarget.id.substring(0, e.currentTarget.id.indexOf("-")) ===
        "delete"
      ) {
        enqueueSnackbar("Deleted menu item!", {
          variant: "warning",
        });
      }
    },
    [props]
  );

  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const addMenuItem = async (props) => {
    await props.addMenuItem();
    enqueueSnackbar("Added new menu item!", {
      variant: "success",
    });
    scrollToBottom();
  };

  return (
    <div className="row justify-content-center align-items-center mt-4">
      <Grid container direction="column">
        <Grid sm={12}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<AddBoxIcon />}
            onClick={() => addMenuItem(props)}
          >
            Add New Menu Item
          </Button>
        </Grid>
        <Grid container sm={12}>
          {props.data.menu_combined
            ? props.data.menu_combined.map((element, i) => (
                <WrappedDashboardItem
                  name={element["name"]}
                  price={element["price"]}
                  pic={element["pic"]}
                  description={element["description"]}
                  key={i}
                  index={i}
                  changeField={changeField}
                />
              ))
            : null}
        </Grid>
        <Grid container sm={12}>
          <div ref={endRef} />
        </Grid>
      </Grid>
    </div>
  );
};

const InfoSettings = (props) => {
  const classes = useStyles();
  return (
    <Container>
      <Grid
        container
        direction="row"
        alignContent={"center"}
        justify={"start"}
        spacing={2}
      >
        <Grid item xs={12} sm={6}>
          <Card
            style={{ width: "100%", height: "250px", alignContent: "center" }}
          >
            <CardHeader title={"Logo"} />
            {props.logo ? (
              <React.Fragment>
                {props.logo === "loading" ? (
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <CardMedia
                    component="img"
                    className={classes.cardMedia}
                    image={props.logo}
                    title={"logo"}
                  />
                )}
              </React.Fragment>
            ) : null}
            <CardContent>
              <Button
                variant="contained"
                component="label"
                color="default"
                startIcon={<CloudUploadIcon />}
                style={{ marginBottom: "5px", width: "170px" }}
              >
                <input
                  type="file"
                  id={"logo"}
                  style={{ display: "none" }}
                  onChange={props.changeInfo}
                />
                {props.logo ? (
                  <span>Replace Image</span>
                ) : (
                  <span>Upload Image</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="name"
            label="Name"
            multiline
            style={{ width: "100%" }}
            value={props.data.name}
            onChange={props.changeInfo}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="description"
            label="Brief Description"
            multiline
            rows={4}
            style={{ width: "100%" }}
            value={props.data.description}
            onChange={props.changeInfo}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="description_detail"
            label="Detailed Description"
            multiline
            rows={4}
            style={{ width: "100%" }}
            value={props.data.description_detail}
            onChange={props.changeInfo}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="delivery_detail"
            label="Delivery Detail"
            multiline
            rows={4}
            style={{ width: "100%" }}
            value={props.data.delivery_detail}
            onChange={props.changeInfo}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

const PageDashboard = (props) => {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [tab, setTab] = React.useState("Menu");
  // const context = useContext(CartContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const { enqueueSnackbar } = useSnackbar();

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {["Menu", "Info"].map((text, index) => (
          <ListItem button key={text} onClick={() => setTab(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const updateFields = async () => {
    await props.saveToFirestore().then(() => {
      enqueueSnackbar("Successfully saved changes!", {
        variant: "success",
      });
    });
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
            {tab === "Menu" ? (
              <span>Menu Settings</span>
            ) : (
              <React.Fragment>
                {tab === "Info" ? <span>Info Settings</span> : null}
              </React.Fragment>
            )}
          </Typography>
          {props.updating ? (
            <div
              class="spinner-border"
              role="status"
              style={{
                marginLeft: "auto",
              }}
            >
              <span class="sr-only">Loading...</span>
            </div>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.saveButton}
              startIcon={<SaveIcon />}
              onClick={updateFields}
            >
              Save
            </Button>
          )}
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
        {tab === "Menu" ? (
          <MenuSettings
            pageName={props.pageName}
            data={props.data}
            changeField={props.changeField}
            saveToFirestore={props.saveToFirestore}
            updating={props.updating}
            updated={props.updated}
            addMenuItem={props.addMenuItem}
          />
        ) : tab === "Info" ? (
          <InfoSettings
            pageName={props.pageName}
            data={props.data}
            changeInfo={props.changeInfo}
            saveToFirestore={props.saveToFirestore}
            updating={props.updating}
            updated={props.updated}
            addMenuItem={props.addMenuItem}
            logo={props.logo}
          />
        ) : null}
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

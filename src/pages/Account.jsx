import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/Appbar";
import {
  Add,
  AttachFile,
  ExpandMore,
  ExpandMoreOutlined,
  Favorite,
  FileCopyOutlined,
  MoreVertOutlined,
  Print,
  Save,
  Share,
  ShareLocation,
} from "@mui/icons-material";
const Account = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [documentId, setDocumentId] = useState("");

  const { user, logout, googleUser } = UserAuth();
  const [todos, setTodos] = React.useState([]);
  const [input, setInput] = useState("");
  // create Todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === "") {
      alert("please enter a valid todo");
      return;
    }
    await addDoc(collection(db, "todos"), {
      text: input,
      completed: false,
    });
    setInput("");
  };

  // Card info
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fabNewItem = () => {
    setDialogOpen(!dialogOpen);
  };

  const [wishlist, setWishlist] = useState([]);
  useEffect(() => {
    try {
      const q = query(
        collectionGroup(db, "wishlist")
        /*,        where("author", "==", googleUser.uid)*/
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let wishArr = [];
        querySnapshot.forEach((doc) => {
          wishArr.push({ ...doc.data(), id: doc.id });
        });
        setWishlist(wishArr);
      });
      return () => unsubscribe();
    } catch (error) {}
  }, []);

  // New Wishlist form submit
  const [formTitle, setFormTitle] = useState("");
  const [formSubTitle, setSubFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formTitle === "") {
      alert("form title is required!");
      return;
    }
    await addDoc(collection(db, "wishlist"), {
      title: formTitle,
      subtitle: formSubTitle,
      description: formDescription,
      author: {
        user: googleUser.user,
        email: googleUser.email,
        uid: googleUser.uid,
        icon: googleUser.photo,
      },
      created: Timestamp.now(),
    });
    fabNewItem();
    setFormTitle("");
    setSubFormTitle("");
    setFormDescription("");
  };
  const deleteCardMenu = async (id) => {
    await deleteDoc(doc(db, "wishlist", id));
    handleCardMenuClose();
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const openCardMenu = Boolean(anchorEl);
  const handleClickCardMenu = (event, id) => {
    setAnchorEl(event.currentTarget);
    setCurrentId(id);
  };
  const handleCardMenuClose = () => {
    setAnchorEl(null);
  };
  const [currentId, setCurrentId] = useState("");

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveAppBar user={user} logout={logout} googleUser={googleUser} />
      <Card>
        <Typography variant="h3">Welcome, {googleUser?.user}</Typography>
      </Card>
      <Divider sx={{ my: 3 }} />

      <Tooltip title="Add new wishlist">
        <Fab
          color="primary"
          aria-label="add"
          onClick={fabNewItem}
          sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <Add />
        </Fab>
      </Tooltip>
      <Grid container>
        {wishlist.map((wish, index) => (
          // Cia reik sutikrinti UID jsON
          /*wish.author.uid === googleUser.uid &&  */
          <Grid item xs={6} md={3} key={index}>
            <Card sx={{ maxWidth: 345, m: 3 }} raised={true}>
              <CardHeader
                avatar={<Avatar alt={wish.user} src={`${wish.author.icon}`} />}
                action={
                  <>
                    <IconButton
                      aria-label="settings"
                      onClick={(event) => {
                        handleClickCardMenu(event, wish.id);
                      }}>
                      <MoreVertOutlined />
                    </IconButton>
                  </>
                }
                title={wish.title}
                subheader={wish.created
                  .toDate()
                  .toLocaleDateString("lt-LT")}></CardHeader>
              {/* <CardMedia
                component="img"
                height="194"
                alt="Paella dish"
                image="https://mui.com/static/images/cards/paella.jpg"
              /> */}

              <CardContent>
                <Typography variant="body2" color="secondary">
                  {wish.description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <Favorite />
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
              </CardActions>
              <Divider />
            </Card>
            <Menu
              elevation={1}
              anchorEl={anchorEl}
              open={openCardMenu}
              onClose={handleCardMenuClose}>
              <MenuItem onClick={() => deleteCardMenu(currentId)}>
                Delete
              </MenuItem>
            </Menu>
          </Grid>
        ))}
      </Grid>
      <Dialog onClose={fabNewItem} open={dialogOpen} maxWidth="xs">
        <DialogTitle>Create a new wishlist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <form onSubmit={handleFormSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  id="standard-basic"
                  label="Title"
                  variant="standard"
                  value={formTitle}
                  required
                  onChange={(e) => setFormTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  id="standard-basic"
                  label="Subtitle"
                  variant="standard"
                  value={formSubTitle}
                  onChange={(e) => setSubFormTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-basic"
                  label="Description"
                  variant="standard"
                  fullWidth
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  minRows={1}
                  maxRows={12}
                  multiline
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  disabled
                  variant="outlined"
                  component="label"
                  endIcon={<AttachFile />}>
                  Upload
                  <input hidden accept="image/*" type="file" />
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={handleFormSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Account;

import {
  Alert,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  Menu,
  MenuItem,
  Paper,
  Snackbar,
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
import { db, storage } from "../firebase";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/Appbar";
import {
  Add,
  AttachFile,
  Favorite,
  MoreVertOutlined,
  Share,
} from "@mui/icons-material";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";
import Alertbar from "../components/Alertbar";
const Account = () => {
  const { user, logout, googleUser } = UserAuth();
  // create Todo

  // Photo
  const [imageURL, setImageURL] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [file, setFile] = useState(null);
  const imageListRef = ref(storage, "images/");

  // Card info

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
    let fileURL;
    const handleFileUpload = async () => {
      if (file == null) return;
      const imageRef = ref(storage, `images/${file.name + v4()}`);
      console.log("image ref:", imageRef.url);
      await uploadBytes(imageRef, file).then(() => {
        alert("Image uploaded");
      });

      await getDownloadURL(imageRef).then((url) => {
        console.log(url);
        fileURL = url;
        setImageURL(url);
      });
    };
    if (formTitle === "") {
      // alert("form title is required!");
      return;
    }
    await handleFileUpload();
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
      image: fileURL,
    });
    fabNewItem();
    setFormTitle("");
    setSubFormTitle("");
    setFormDescription("");
    // setFile(null);
    // setImageURL(null);
  };

  const deleteCardMenu = async (id) => {
    handleCardMenuClose();
    await deleteDoc(doc(db, "wishlist", id));
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
          <Grid item xs={6} md={4} lg={3} key={index}>
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
              {wish.image && (
                <CardMedia component="img" height="194" image={wish.image} />
              )}
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
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    endIcon={<AttachFile />}>
                    Upload
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(event) => {
                        setFile(event.target.files[0]);
                      }}
                    />
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <ImageList>
                  {file && (
                    <ImageListItem>
                      <img src={URL.createObjectURL(file)} />
                    </ImageListItem>
                  )}
                </ImageList>
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

import {
  Avatar,
  Button,
  Card,
  Divider,
  FormGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/Appbar";
import { useLocation } from "react-router-dom";
const Account = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [admins, setAdmins] = useState([]);

  const location = useLocation();
  const { user, logout } = UserAuth();
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
  // Read todo from firebase
  useEffect(() => {
    console.log("mes jau esame prisijunge!");
    console.log(location);
    snapData();
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // collection ref
  const colRef = collection(db, "users");

  // queries
  const q = query(colRef /*, where("uid", "==", true)*/);
  //const q = query(collection(db, "cities"), where("capital", "==", true));
  // get collection data
  const snapData = () => {
    onSnapshot(q, (snapshot) => {
      let books = [];
      snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id });
      });
      setAdmins(books);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(colRef, {
      title: title,
      author: author,
    });
    e.target.reset();
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    deleteDoc(doc(colRef, documentId));
  };
  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveAppBar user={user} logout={logout} />

      <Card>
        <Typography variant="h3">Welcome, {user.displayName}</Typography>
      </Card>
      <Divider sx={{ my: 3 }} />
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
        className="add">
        <TextField
          id="title"
          label="Title"
          variant="outlined"
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="author"
          label="Author"
          variant="outlined"
          onChange={(e) => setAuthor(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Add a new book
        </Button>
      </form>
      <Divider sx={{ my: 3 }} />

      <form
        onSubmit={handleDelete}
        style={{ display: "flex", flexDirection: "column" }}
        className="delete">
        <TextField
          id="document-id"
          label="Document ID"
          variant="outlined"
          onChange={(e) => setDocumentId(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Delete a book
        </Button>
      </form>
      <List
        sx={{ width: "100%" }}
        subheader={<ListSubheader>Admins</ListSubheader>}>
        {admins.map((admin, index) => (
          <ListItem key={index}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar />
              </ListItemAvatar>
              <ListItemText primary={admin.user} />
              <ListItemText primary={admin.email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* <BasicTabs todo={todos} /> */}

      {/* <form onSubmit={createTodo}>
        <Box sx={{ display: "flex", gap: "15px" }}>
          <FormGroup>
            <TextField
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add item"
              type="text"></TextField>
          </FormGroup>
          <Button variant="contained" endIcon={<Add />} type="submit">
            Add
          </Button>
        </Box>
      </form> */}
    </Box>
  );
};

export default Account;

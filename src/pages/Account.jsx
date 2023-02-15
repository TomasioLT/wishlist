import { Card, Divider, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/Appbar";
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

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveAppBar user={user} logout={logout} googleUser={googleUser} />
      <Card>
        <Typography variant="h3">Welcome, {user.displayName}</Typography>
      </Card>
      <Divider sx={{ my: 3 }} />
      {/* <form
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
      </form> */}

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

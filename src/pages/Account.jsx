import { Button, Card, FormGroup, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import ResponsiveAppBar from "../components/Appbar";
import BasicTabs from "../components/Tabs";
import { Add } from "@mui/icons-material";

const Account = () => {
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
    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);
  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveAppBar user={user} logout={logout} />

      <Card>
        <Typography variant="h3">Welcome, {user.displayName}</Typography>
      </Card>
      <BasicTabs todo={todos} />

      <form onSubmit={createTodo}>
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
      </form>
    </Box>
  );
};

export default Account;

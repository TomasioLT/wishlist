import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { IconButton } from "@mui/material";

const Todo = ({ todo, toggleComplete, deleteTodo }) => {
  return (
    <ListItem
      sx={{ backgroundColor: "primary.light", mb: 2 }}
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="comments"
          onClick={() => deleteTodo(todo.id)}></IconButton>
      }
      disablePadding>
      <ListItemButton role={undefined} dense>
        <ListItemIcon>
          <Checkbox
            onChange={() => toggleComplete(todo)}
            edge="start"
            checked={todo.completed ? true : false}
            tabIndex={-1}
            disableRipple
            inputProps={{ "aria-labelledby": 1 }}
          />
        </ListItemIcon>
        <ListItemText
          onClick={() => toggleComplete(todo)}
          id={1}
          primary={todo.text}
          sx={{ textDecoration: todo.completed ? "line-through" : "none" }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default Todo;

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Button, FormGroup, TextField } from "@mui/material";
import Todo from "./Todo";
import { Add } from "@mui/icons-material";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ todo }) {
  const [input, setInput] = React.useState("");
  const [todos, setTodos] = React.useState([]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    setTodos(todo);
  });
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
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example">
          <Tab label="Family" {...a11yProps(0)} />
          <Tab label="Sofija" {...a11yProps(1)} />
          <Tab label="Tomas" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {todos.map((todo, index) => (
          <Todo key={index} todo={todo} />
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {todos.map((todo, index) => (
          <Todo key={index} todo={todo} />
        ))}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {todos.map((todo, index) => (
          <Todo key={index} todo={todo} />
        ))}
      </TabPanel>
    </Box>
  );
}

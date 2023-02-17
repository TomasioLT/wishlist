import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React, { useEffect, useState } from "react";
import ResponsiveAppBar from "../components/Appbar";
import { UserAuth } from "../context/AuthContext";
import { Box } from "@mui/system";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Switch,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FlashOnOutlined } from "@mui/icons-material";

const Admin = () => {
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const [users, setUsers] = useState([]);
  const [checked, setChecked] = useState(false);

  const { user, logout, googleUser } = UserAuth();

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setUsers(todosArr);
    });
    return () => unsubscribe();
  }, []);

  const handleCheckBox = async (currUser) => {
    if (currUser.uid === user.uid) {
      alert(
        "Are you sure want to deactivate yourself? There is no way back !!!"
      );
    }
    await updateDoc(doc(db, "users", currUser.uid), {
      admin: !currUser.admin,
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      <ResponsiveAppBar user={user} logout={logout} googleUser={googleUser} />
      <Typography variant="h3" sx={{ p: 2 }}>
        Admin dashboard
      </Typography>

      {/* <List sx={{ border: 1 }}>
        <ListSubheader component="h6" variant="h4">
          All users
        </ListSubheader>
        <Divider />
        {users.map((row) => (
          <ListItem
            key={row.uid}
            sx={{ display: "flex", justifyContent: "flex-start" }}>
            <ListItemButton>
              <ListItemAvatar>
                <Avatar src={row.photoURL} />
              </ListItemAvatar>
              <ListItemText primary={row.user} secondary={row.email} />
            </ListItemButton>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleCheckBox(row)}
                    checked={row.admin ? true : false}
                  />
                }
                label={row.admin ? "Admin" : "User"}
              />
            </FormGroup>
          </ListItem>
        ))}
      </List> */}

      {users.map((row) => (
        <Grid container spacing={2}>
          <Grid item xs={2} md={1}>
            <Avatar src={row.photoURL} />
          </Grid>
          <Grid
            item
            xs={3}
            md={2}
            sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6">{row.user}</Typography>
          </Grid>
          <Grid item xs={3}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => handleCheckBox(row)}
                    checked={row.admin ? true : false}
                  />
                }
                label={row.admin ? "Admin" : "User"}
              />
            </FormGroup>
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default Admin;

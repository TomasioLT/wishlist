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
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
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

  const handleCheckBox = async (user) => {
    await updateDoc(doc(db, "users", user.uid), {
      admin: !user.admin,
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
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "md", flexGrow: 1, my: 3 }}>
        <Typography variant="h3" sx={{ p: 2 }}>
          Admin dashboard
        </Typography>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>UID</StyledTableCell>
              <StyledTableCell>Admin</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <StyledTableRow key={row.uid}>
                <StyledTableCell component="th" scope="row">
                  {row.user}
                </StyledTableCell>
                <StyledTableCell>{row.email}</StyledTableCell>
                <StyledTableCell>{row.uid}</StyledTableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          onChange={() => handleCheckBox(row)}
                          checked={row.admin ? true : false}
                        />
                      }
                      label="Yes"
                    />
                  </FormGroup>
                </Box>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Admin;

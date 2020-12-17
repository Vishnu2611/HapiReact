import React, {useEffect, useState} from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import { API_URL } from './apiConstants';
import axios from 'axios';
// import InputBase from '@material-ui/core/InputBase';
// import SearchIcon from '@material-ui/icons/Search';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});
// let rows = []
export default function CustomizedTables() {
  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [rows, setRows] = useState([]);
  useEffect(() =>{
    if(totalPage === 0){
      console.log('Use Effect Calling Github API');
      console.log(currentPage+1,rowsPerPage)
      axios.get(`${API_URL}/search?q=nodejs&page=${currentPage+1}&limit=${rowsPerPage}`).then((response)=> {
          setTotalPage(response.data.data.total_count);
          setRows(response.data.data.items);
      }).catch(error => {
        console.log(error);
      })
    }
  })
  const getTableData = (page = currentPage+1, rows = rowsPerPage) => {
      console.log('Calling Github API');
      console.log(`${API_URL}/search?q=nodejs&page=${page}&limit=${rows}`,page,rows)
      axios.get(`${API_URL}/search?q=nodejs&page=${page}&limit=${rows}`).then((response)=> {
          setTotalPage(response.data.data.total_count);
          setRows(response.data.data.items);
      }).catch(error => {
        console.log(error);
      })
  }
  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    getTableData(newPage+1);
  };

  const handleChangeRowsPerPage = (event) => {
    event.preventDefault();
    setRowsPerPage(parseInt(event.target.value, 10));
    getTableData(undefined,event.target.value);
  };

  return (
    <div>
    <Paper>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Full Name</StyledTableCell>
              <StyledTableCell align="right">Is Private</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.id}
                </StyledTableCell>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">{row.full_name}</StyledTableCell>
                <StyledTableCell align="right">{row.private.toString()}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={totalPage || 0}
            rowsPerPage={rowsPerPage}
            page={currentPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}      />
  </Paper>
  </div>
  );
}

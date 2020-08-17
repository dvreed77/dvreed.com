import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 300,
  },
})

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
]

const data = [
  { city: "Portland", state: "Oregon", count: "80" },
  { city: "Denver", state: "Colorado", count: "77" },
  { city: "San Diego", state: "California", count: "74" },
  { city: "Chicago", state: "Illinois", count: "69" },
  { city: "Seattle", state: "Washington", count: "67" },
  { city: "Austin", state: "Texas", count: "43" },
  { city: "Albuquerque", state: "New Mexico", count: "40" },
  { city: "San Francisco", state: "California", count: "37" },
  { city: "Minneapolis", state: "Minnesota", count: "36" },
  { city: "Indianapolis", state: "Indiana", count: "35" },
  { city: "Asheville", state: "North Carolina", count: "30" },
  { city: "Los Angeles", state: "California", count: "29" },
  { city: "Milwaukee", state: "Wisconsin", count: "28" },
  { city: "Brooklyn", state: "New York", count: "26" },
  { city: "Saint Louis", state: "Missouri", count: "26" },
  { city: "Cincinnati", state: "Ohio", count: "26" },
  { city: "Nashville", state: "Tennessee", count: "25" },
  { city: "Columbus", state: "Ohio", count: "25" },
  { city: "Colorado Springs", state: "Colorado", count: "25" },
]

export function SimpleTable() {
  const classes = useStyles()

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table
        className={classes.table}
        aria-label="simple table"
        size="small"
        stickyHeader
      >
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell align="right">State</TableCell>
            <TableCell align="right">Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(row => (
            <TableRow key={row.city}>
              <TableCell component="th" scope="row">
                {row.city}
              </TableCell>
              <TableCell align="right">{row.state}</TableCell>
              <TableCell align="right">{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

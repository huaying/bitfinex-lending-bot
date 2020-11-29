import React from 'react';
import { useStyletron } from "baseui";
import { TableBuilder, TableBuilderColumn } from "baseui/table-semantic";

import moment from "moment";

import { toPercentage } from "../utils";

function Lending({ lending }) {
  const [css] = useStyletron();
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortAsc, setSortAsc] = React.useState(true);
  const [data] = React.useState(lending);

  const sortedData = React.useMemo(() => {
    return data.slice().sort((a, b) => {
      const left = sortAsc ? a : b;
      const right = sortAsc ? b : a;
      const leftValue = String(left[sortColumn]);
      const rightValue = String(right[sortColumn]);
      return leftValue.localeCompare(rightValue, 'en', {
        numeric: true,
        sensitivity: 'base',
      });
    });
  }, [sortColumn, sortAsc, data]);

  function handleSort(id) {
    if (id === sortColumn) {
      setSortAsc(asc => !asc);
    } else {
      setSortColumn(id);
      setSortAsc(true);
    }
  }

  return (
    <div className={css({ margin: "0 -20px" })}>
      <TableBuilder
        data={sortedData}
        sortColumn={sortColumn}
        sortOrder={sortAsc ? 'ASC' : 'DESC'}
        onSort={handleSort}
      >
        <TableBuilderColumn id="amount" header="金額" sortable>
          {row => `$${row.amount.toFixed(2)}`}
        </TableBuilderColumn>
        <TableBuilderColumn
          id="foo"
          header="天數"
          sortable
        >
          {row => row.period}
        </TableBuilderColumn>
        <TableBuilderColumn
          id="rate"
          header="年化率"
          sortable
        >
          {row => toPercentage(row.rate)}
        </TableBuilderColumn>
        <TableBuilderColumn
          id="exp"
          header="期限"
          sortable
        >
          {row => moment(row.exp).fromNow()}
        </TableBuilderColumn>
      </TableBuilder>
    </div>
  );
}

export default Lending;
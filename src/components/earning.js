import React from 'react';
import { useStyletron } from "baseui";
import { Table } from "baseui/table-semantic";

import moment from "moment";

function Earning({ earnings }) {
  const [css] = useStyletron();
  if (earnings.length === 0) {
    return null;
  }
  return (
    <div className={css({ margin: "0 -20px" })}>
      <Table
        columns={["收益", "日期", "時間"]}
        data={earnings.map(l => [
          `$${l.amount.toFixed(4)}`,
          moment(l.mts).format("L"),
          moment(l.mts).fromNow()
        ])}
      />
    </div>
  );
}

export default Earning;
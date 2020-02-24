import React from "react";
import { useStyletron } from "baseui";
import { Table } from "baseui/table";
import { Heading, HeadingLevel } from "baseui/heading";
import moment from "moment";
import "moment/locale/zh-tw";

moment.locale("zh-tw");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Balance({ balance, lending }) {
  const [css, theme] = useStyletron();

  if (balance === null || lending.length === 0) {
    return null;
  }
  const lendingAmount = lending.reduce((total, c) => total + c.amount, 0);
  let remain = balance - lendingAmount;

  return (
    <HeadingLevel>
      <Heading styleLevel={5}>資金總覽</Heading>
      <div className={css({ height: "30px", fontSize: "20px" })}>
        <span
          className={css({ fontWeight: 400, color: theme.colors.primary500 })}
        >
          總共
        </span>
        &nbsp;
        <span className={css({ color: theme.colors.primary700 })}>
          ${balance.toFixed(4)}
        </span>
      </div>
      <div className={css({ height: "30px", fontSize: "20px" })}>
        <span
          className={css({ fontWeight: 400, color: theme.colors.primary500 })}
        >
          可用
        </span>
        &nbsp;
        <span className={css({ color: theme.colors.primary700 })}>
          ${remain.toFixed(4)}
        </span>
      </div>
    </HeadingLevel>
  );
}

function Lending({ lending }) {
  if (lending.length === 0) {
    return null;
  }
  return (
    <HeadingLevel>
      <Heading styleLevel={5}>已借出</Heading>
      <Table
        columns={["金額", "天數", "年化率", "期限"]}
        data={lending.map(l => [
          `$${l.amount.toFixed(2)}`,
          l.period,
          `${(l.rate * 100).toFixed(2)}%`,
          moment(l.exp).fromNow()
        ])}
      />
    </HeadingLevel>
  );
}

function App() {
  const [css] = useStyletron();
  const [lending, setLending] = React.useState([]);
  const [balance, setBalance] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${API_URL}/api/data`).then(res => res.json());
      setLending(res.lending);
      setBalance(res.balance);
    }
    fetchData();
  }, []);

  return (
    <div
      className={css({
        margin: "0 auto",
        padding: "20px",
        maxWidth: "920px"
      })}
    >
      <Balance balance={balance} lending={lending} />
      <div
        className={css({
          marginTop: "20px"
        })}
      >
        <Lending lending={lending} />
      </div>
    </div>
  );
}

export default App;

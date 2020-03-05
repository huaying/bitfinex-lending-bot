import React from "react";
import { useStyletron } from "baseui";
import { Table } from "baseui/table";
import { Heading, HeadingLevel } from "baseui/heading";
import { Tabs, Tab } from "baseui/tabs";
import moment from "moment";
import "moment/locale/zh-tw";

moment.locale("zh-tw");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function Balance({ balance, lending, earnings }) {
  const [css, theme] = useStyletron();

  if (balance === null || lending.length === 0) {
    return null;
  }
  const lendingAmount = lending.reduce((total, c) => total + c.amount, 0);
  let remain = balance - lendingAmount;

  const earning30 = earnings.reduce((total, c) => total + c.amount, 0);

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
      <div className={css({ height: "30px", fontSize: "20px" })}>
        <span
          className={css({ fontWeight: 400, color: theme.colors.primary500 })}
        >
          30 天收益
        </span>
        &nbsp;
        <span className={css({ color: theme.colors.primary700 })}>
          ${earning30.toFixed(4)}
        </span>
      </div>
    </HeadingLevel>
  );
}

function Lending({ lending }) {
  const [css] = useStyletron();
  if (lending.length === 0) {
    return null;
  }
  return (
    <div
      className={css({ margin: "0 -20px" })}
    >
      <Table
        columns={["金額", "天數", "年化率", "期限"]}
        data={lending.map(l => [
          `$${l.amount.toFixed(2)}`,
          l.period,
          `${(l.rate * 100).toFixed(2)}%`,
          moment(l.exp).fromNow()
        ])}
      />
    </div>
  );
}

function Earning({ earnings }) {
  const [css] = useStyletron();
  if (earnings.length === 0) {
    return null;
  }
  return (
    <div
      className={css({ margin: "0 -20px" })}
    >
      <Table
        columns={["收益", "時間"]}
        data={earnings.map(l => [
          `$${l.amount.toFixed(4)}`,
          moment(l.mts).fromNow()
        ])}
      />
    </div>
  );
}

function App() {
  const [css] = useStyletron();
  const [lending, setLending] = React.useState([]);
  const [earnings, setEarnings] = React.useState([]);
  const [balance, setBalance] = React.useState(null);
  const [activeKey, setActiveKey] = React.useState("0");

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${API_URL}/api/data`).then(res => res.json());
      setLending(res.lending);
      setBalance(res.balance);
      setEarnings(res.earnings);
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
      <Balance balance={balance} lending={lending} earnings={earnings} />
      <div
        className={css({
          marginTop: "20px"
        })}
      >
        <Tabs
          onChange={({ activeKey }) => {
            setActiveKey(activeKey);
          }}
          activeKey={activeKey}
        >
          <Tab title="已借出">
            <Lending lending={lending} />
          </Tab>
          <Tab title="每日收益"><Earning earnings={earnings} /></Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default App;

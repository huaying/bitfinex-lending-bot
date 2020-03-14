import React from "react";
import { useStyletron } from "baseui";
import { Table } from "baseui/table";
import { Spinner } from "baseui/spinner";
import { Tabs, Tab } from "baseui/tabs";
import moment from "moment";
import "moment/locale/zh-tw";

moment.locale("zh-tw");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function toPercentage(num) {
  return `${(num * 100).toFixed(2)}%`;
}

function StatusPanel({ title, value }) {
  const [css, theme] = useStyletron();
  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        marginBottom: "15px"
      })}
    >
      <span
        className={css({
          fontSize: "20px",
          fontWeight: 300,
          color: theme.colors.primary200
        })}
      >
        {title}
      </span>
      <span
        className={css({
          fontSize: "40px",
          fontWeight: 200,
          color: theme.colors.primary400
        })}
      >
        {value}
      </span>
    </div>
  );
}

function Balance({ balance, lending, earnings, rate }) {
  const [css] = useStyletron();

  if (balance === null || lending.length === 0) {
    return null;
  }
  const lendingAmount = lending.reduce((total, c) => total + c.amount, 0);
  let remain = balance - lendingAmount;

  const earning30 = earnings.reduce((total, c) => total + c.amount, 0);

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column"
      })}
    >
      <StatusPanel title={"總共"} value={`${balance.toFixed(4)}`} />
      <StatusPanel title={"可用"} value={`${remain.toFixed(4)}`} />
      <StatusPanel title={"30天收益"} value={`${earning30.toFixed(4)}`} />
      <StatusPanel title={"當前年利率"} value={toPercentage(rate)} />
    </div>
  );
}

function Lending({ lending }) {
  const [css] = useStyletron();
  if (lending.length === 0) {
    return null;
  }
  return (
    <div className={css({ margin: "0 -20px" })}>
      <Table
        columns={["金額", "天數", "年化率", "期限"]}
        data={lending.map(l => [
          `$${l.amount.toFixed(2)}`,
          l.period,
          toPercentage(l.rate),
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

function App() {
  const [css] = useStyletron();
  const [currency, setCurrency] = React.useState();
  const [data, setData] = React.useState(null);
  const [activeKey, setActiveKey] = React.useState("0");

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${API_URL}/api/data`).then(res => res.json());
      if (!res || res.length === 0) {
        return;
      }

      const data = {};
      res.forEach(ccyData => {
        data[ccyData.ccy] = ccyData;
      });
      setCurrency(res[0].ccy);
      setData(data);
    }
    fetchData();
  }, []);

  if (data === null) {
    return (
      <div
        className={css({
          width: "100%",
          marginTop: "100px",
          textAlign: "center"
        })}
      >
        <Spinner color="black" />
      </div>
    );
  }

  const { balance, lending, earnings, rate } = data[currency];

  return (
    <div
      className={css({
        margin: "0 auto",
        padding: "20px",
        maxWidth: "920px"
      })}
    >
      <Balance
        balance={balance}
        lending={lending}
        earnings={earnings}
        rate={rate}
      />
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
          <Tab title="每日收益">
            <Earning earnings={earnings} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default App;

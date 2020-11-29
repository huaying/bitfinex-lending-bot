import React from "react";
import { useStyletron } from "baseui";
import { Spinner } from "baseui/spinner";
import { Tabs, Tab } from "baseui/tabs";
import moment from "moment";

import Status from './components/status';
import Lending from './components/lending';
import Earning from './components/earning';

import "moment/locale/zh-tw";

moment.locale("zh-tw");

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";


function App() {
  const [css, theme] = useStyletron();
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

  const { balance, lending, availableBalance, earnings, rate } = data[currency];

  return (
    <div
      className={css({
        margin: "0 auto",
        padding: "20px",
        maxWidth: "920px",
        color: theme.colors.primary400
      })}
    >
      <Status
        balance={balance}
        availableBalance={availableBalance}
        earnings={earnings}
        rate={rate}
        currency={currency}
        onCurrencyChange={setCurrency}
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

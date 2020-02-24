import React from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, useStyletron } from "baseui";
import { Table } from "baseui/table";

const engine = new Styletron();

function Lending({ lending }) {
  if (lending.length === 0) {
    return null;
  }
  return (
    <Table
      columns={["Amount", "Period", "Rate", "Expiration"]}
      data={lending.map(l => [l.amount, l.period, l.rate, l.exp])}
    />
  );
}

function App() {
  const [css] = useStyletron();
  const [lending, setLending] = React.useState([]);
  const [balance, setBalance] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:3001/api/data").then(res =>
        res.json()
      );
      console.log(res);
      setLending(res.lending);
      setBalance(res.balance);
    }
    fetchData();
  }, []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          })}
        >
          {balance}
          <Lending lending={lending} />
        </div>
      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;

import React from "react";
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, useStyletron} from 'baseui';

const engine = new Styletron();

function App() {
  const [css] = useStyletron();

  React.useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://localhost:3001/api/data').then(res => res.json());
      console.log(res)
    }
    fetchData();
  }, []);

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <div className={
          css({
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'}
          )}
        >
          hi
        </div>
      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;

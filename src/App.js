import React from "react";
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, useStyletron} from 'baseui';

const engine = new Styletron();

function App() {
  const [css] = useStyletron();
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

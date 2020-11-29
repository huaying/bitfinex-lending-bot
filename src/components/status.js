import React from "react";
import { useStyletron } from "baseui";

import { toPercentage } from "../utils";

function CurrencyToggle({ activeCurrency, onCurrencyChange }) {
  const [css, theme] = useStyletron();

  const ccyStyle = ccy => {
    const style = { cursor: "pointer", fontSize: "30px" };
    if (ccy === activeCurrency) {
      return { ...style, fontSize: "50px", color: theme.colors.primary300 };
    }
    return style;
  };

  return (
    <div
      className={css({
        position: "absolute",
        display: "flex",
        alignItems: "flex-end",
        right: 0,
        flexDirection: "column",
        color: theme.colors.primary600,
        fontWeight: 200
      })}
    >
      <div
        className={css(ccyStyle("USD"))}
        onClick={() => onCurrencyChange("USD")}
      >
        USD
      </div>
      <div
        className={css(ccyStyle("UST"))}
        onClick={() => onCurrencyChange("UST")}
      >
        USDt
      </div>
    </div>
  );
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

function Status({
  balance,
  availableBalance,
  earnings,
  rate,
  currency,
  onCurrencyChange
}) {
  const [css] = useStyletron();

  if (balance === null) {
    return null;
  }

  const earning30 = earnings.reduce((total, c) => total + c.amount, 0);

  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        position: "relative"
      })}
    >
      <StatusPanel title={"總共"} value={`${balance.toFixed(4)}`} />
      <StatusPanel title={"可用"} value={`${availableBalance.toFixed(4)}`} />
      <StatusPanel title={"30天收益"} value={`${earning30.toFixed(4)}`} />
      <StatusPanel title={"當前年利率"} value={toPercentage(rate)} />
      <CurrencyToggle
        activeCurrency={currency}
        onCurrencyChange={onCurrencyChange}
      />
    </div>
  );
}

export default Status;
export const ROLE_OPTIONS = [
  {
    label: "Bot builder",
    value: "bot_builder",
  },
  {
    label: "Trading team",
    value: "trading_team",
  },
  {
    label: "Solo operator",
    value: "solo_operator",
  },
  {
    label: "Protocol team",
    value: "protocol_team",
  },
] as const

export const TEAM_TYPE_OPTIONS = [
  {
    label: "Single bot",
    value: "single_bot",
  },
  {
    label: "Multi-wallet stack",
    value: "multi_wallet",
  },
  {
    label: "Small desk",
    value: "small_desk",
  },
  {
    label: "Infra / research team",
    value: "infra_team",
  },
] as const

export const FAILURE_MODE_OPTIONS = [
  {
    label: "Stale signals",
    value: "stale_signals",
  },
  {
    label: "Bad entries in volatility",
    value: "bad_entries_volatility",
  },
  {
    label: "Execution drift / slippage",
    value: "execution_drift",
  },
  {
    label: "No clear root cause after losses",
    value: "unclear_root_cause",
  },
] as const

import { EXCHANGE, NETWORK } from "shared/constants/AppEnums";

export function populateInforCard(networkName: NETWORK, exchangeName: EXCHANGE) {
  return [
    {
      value: "Token Explorer",
      bgColor: "#49BD65",
      icon: "/assets/images/dashboard/1_monthly_sales.png",
      id: 2,
      type: "Last Month Sale",
      href: `/${networkName}/protocol-explorer/${exchangeName}/token-explorer`
    },
    {
      value: "Pool Explorer",
      bgColor: "#009dc4",
      icon: "/assets/images/dashboard/1_monthly_sales.png",
      id: 2,
      type: "Last Month Sale",
      href: `/${networkName}/protocol-explorer/${exchangeName}/pair-explorer`
    },
    {
      value: "Pair Explorer",
      bgColor: "black",
      icon: "/assets/images/dashboard/1_monthly_sales.png",
      id: 3,
      type: "Last Month Sale",
      href: `/${networkName}/protocol-explorer/${exchangeName}/pair-explorer`
    },

  ]
}

export const truncateAddress = (address: string) => {
  return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
};
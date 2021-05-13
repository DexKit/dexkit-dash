import isURL from "validator/lib/isURL";

export const truncateAddress = (address: string) => {
  if(address){
    return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
  }else{
    return '';
  }
 
};
export function capitalize(str: string, separator: string = ' ', separatorToJoinString: string = ' ') {
  return str?.split(separator)
    .map(s => s.replace(s?.charAt(0), s?.charAt(0)?.toUpperCase()))
    .join(separatorToJoinString);
}

export const urlValidator = (url: string) => {
  return isURL(url, {
    protocols: ['http','https']
  });
}
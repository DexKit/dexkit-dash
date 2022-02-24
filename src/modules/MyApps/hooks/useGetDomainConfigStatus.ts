
import { useWeb3 } from "hooks/useWeb3";


import { useQuery } from "react-query";

interface CallbackProps {
    onSubmit?: (hash?: string) => void;
    onConfirmation?: (hash?: string) => void;
    onError?: (error?: any) => void;
}


export const useGetDomainConfigStatus = () => {

    const { account } = useWeb3();





}

import { useMutation } from "react-query";

import { getDomainConfigStatus } from '../services/config'



export const useDomainConfigStatusMutation = () => {

    return useMutation((domain: string) => {
        return getDomainConfigStatus(domain);
    })

}
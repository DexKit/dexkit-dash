import { isAddress } from 'utils/ethers';
import * as yup from 'yup';



export const ValidationSchemas = [
    yup.object({
        name: yup
            .string()
            .required('Name is required'),
        logo: yup
            .string()
            .url()
            .required('Logo is required'),
        logo_dark: yup
            .string()
            .url()
            .required('Logo is required'),
        domain: yup
            .string()
            .url()
            .required('Logo is required'),
        feeRecipient: yup
            .string()
            .test('is-address', 'Address not valid', (value) => !!isAddress(value))
            .required('Fee Recipient is required'),
    }),

    yup.object({
    })





]
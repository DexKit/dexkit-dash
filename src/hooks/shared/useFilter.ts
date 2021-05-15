import { useState } from "react"

interface Props{
    id: string;
    label: string;
    type: string;
    defaultValue?: any;
    enable?: boolean
}


export const useFilter = (props: Props) => {
        const [value, setValue] = useState(props.defaultValue);
        const [enable, setEnable] = useState(props.enable || false)
        const onClose = () => {
            setEnable(false)
        }
        const onChange = (val: any) => {
            setValue(val);
        }
        const onEnable = () => {
            setEnable(true);
        }

        return {
            id: props.id,
            value,
            enable,
            label: props.label,
            type: props.type,
            onClose,
            onChange,
            onEnable,
        }


}
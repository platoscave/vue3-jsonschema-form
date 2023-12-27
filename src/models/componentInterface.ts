import type { IProperty } from './property'
export interface IComponentInterface {
    modelValue?: any
    properties?: Record<string, IProperty>
    property?: IProperty
    requiredArr?: string[]
    editPermitted?: {
        items?: {
            properties?: Object
        }
    }
    queryCallback?: Function
    formMode?: ("Readonly Full" | "Readonly Dense" | "Edit Permitted" | "Edit Full")
    size?: ("" | "default" | "small" | "large")
    labelWidth?: string
    labelPosition?: ("left" | "top" | "right")
    columWidths?: number[]
}
import type { IProperty } from './property'
export interface INestedObject {
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
    formMode?: string
    size?: ("" | "default" | "small" | "large")
    labelWidth?: string
    labelPosition?: ("left" | "top" | "right")
    columWidths?: number[]
}
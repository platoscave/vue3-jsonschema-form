import type { IProperty } from './property'
export interface INestedObject {
    modelValue?: any
    properties?: IProperty
    requiredArr?: string[]
    editPermitted?: {
        items?: {
            properties?: Object
        }
    }
    queryCallback?: Function
    formMode?: string
    size?: string
    labelWidth?: string
    labelPosition?: string
    columWidths?: number[]
}
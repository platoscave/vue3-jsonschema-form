export interface IProperty {
    type?: string
    title?: string
    description?: string
    maxLength?: number
    minLength?: number
    minimum?: number
    maximum?: number
    multipleOf?: number
    format?: string
    pattern?: string
    contentMediaType?: string
    displayAs?: string
    query?: Object
    properties?:  Record<string, IProperty>
    enum?: string[]
    attrs?: {
        placeholder?: string
        type?: string
        showWordLimit?: boolean
    }
    items?: {
        query?: Object
        properties?: Record<string, IProperty>
        type?: string
    }
    required?: string[]
    additionalItems?: boolean
}
export interface IProperty {
    type?: string
    maxLength?: number
    minLength?: number
    minimum?: number
    maximum?: number
    multipleOf?: number
    format?: string
    contentMediaType?: string
    displayAs?: string
    query?: Object
    properties?: Object
    enum?: string[]
    attrs?: {
        placeholder?: string
        type?: string
        showWordLimit?: boolean
    }
    items?: {
        query?: Object
        properties?: Object
        type?: string
    }
    required?: string[]
    additionalItems?: boolean
}
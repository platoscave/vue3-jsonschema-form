export default {
    properties: {
        string: true,
        object: {
            properties: {
                nestedSubFormObj: {
                    properties: {
                        petName: true,
                        petType: true
                    }
                },
            },
        },
        objectsArray: {
            items: {
                properties: {
                    logEntry: true
                },
            },
            additionalItems: true,
            reorderItems: true,
            deleteItems: true
        },
    }
}
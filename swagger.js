import { writeFileSync } from 'node:fs';
import swaggerJSDoc from 'swagger-jsdoc';
const definition = {
    "openapi": "3.0.3",
    "info": {
        "title": "Kizuna Rail API",
        "version": "1.0.0",
        "description": "W03 independent Trips feature"
    },
    "servers": [
        {
            "url": "/"
        }
    ],
    "components": {
        "schemas": {
            "Trip": {
                "type": "object",
                "required": [
                    "id",
                    "name",
                    "description",
                    "region",
                    "startStation",
                    "endStation",
                    "duration",
                    "bestSeason",
                    "distance",
                    "highlights",
                    "operatingMonths"
                ],
                "properties": {
                    "id": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "region": {
                        "type": "string"
                    },
                    "startStation": {
                        "type": "string"
                    },
                    "endStation": {
                        "type": "string"
                    },
                    "duration": {
                        "type": "string"
                    },
                    "bestSeason": {
                        "type": "string"
                    },
                    "imageUrl": {
                        "type": "string"
                    },
                    "distance": {
                        "type": "number",
                        "minimum": 0
                    },
                    "highlights": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    },
                    "operatingMonths": {
                        "type": "array",
                        "items": {
                            "type": "integer",
                            "minimum": 1,
                            "maximum": 12
                        }
                    }
                }
            },
            "Error": {
                "type": "object",
                "required": [
                    "error"
                ],
                "properties": {
                    "error": {
                        "type": "string"
                    }
                }
            }
        }
    }
};
const document = swaggerJSDoc({ definition, apis: ['./src/routes/api-routes.js'], failOnErrors: true });
writeFileSync('./swagger.json', JSON.stringify(document, null, 2) + '\n');

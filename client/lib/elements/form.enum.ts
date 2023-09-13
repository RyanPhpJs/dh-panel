export enum InputType {
    TEXT = 0,
    STRING = 0,
    NUMBER = 1,
    INTEGER = 2,
    FLOAT = 3,
    EMAIL = 4,
    PASSWORD = 5,
    URL = 6,
    TEL = 7,
}

export const InputTypeToHtml = [
    "text",
    "number",
    "number",
    "number",
    "email",
    "password",
    "url",
    "tel"
]

export enum ButtonColors {
    Blue = "btn-primary",
    Cyan = "btn-info",
    Red = "btn-danger",
    Yellow = "btn-warning",
    White = "btn-light",
    Black = "btn-dark"
}
import { Alert } from "../tabler/Alert";

export function ErrorForm({ title, text }) {
    return <Alert text={text} title={title || "Ops! Um erro ocorreu"} color="danger"></Alert>
}
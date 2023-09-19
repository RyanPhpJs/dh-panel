import { ButtonColors, ErrorAlert, Form, Input, InputType, SubmitButton } from "../lib/elements/forms";
import "../scss/login.scss";
import { useUser } from "../app";

export function LoginPage(){

    const user = useUser();

    return <div className="login-container">
        <div className="login_card">
            <div className="left-card-content">
                <h3>DH Panel</h3>
                <Form method="POST" target="/api/login" onResponse={(data) => {
                    localStorage.setItem("dh_token", data.token);
                    user.reload();
                }}>
                    <ErrorAlert />
                    <Input type={InputType.TEXT} icon={"fa-solid fa-user"} name="username" placeholder="Usúario" isRequired={true} />
                    <Input type={InputType.PASSWORD} icon={"fa-solid fa-lock"} name="password" placeholder="Senha" isRequired={true} />

                    <SubmitButton color={ButtonColors.Cyan}>Acessar</SubmitButton>
                </Form>
            </div>
            <div className="right-card-content">
                <div className="right-data">
                    <h3>DH Panel</h3>
                    <p>Paínel de controle para hospedagem de bots do discord</p>
                </div>
            </div>
        </div>
    </div>

}
import { ButtonColors, ErrorAlert, Form, Input, InputType, SubmitButton } from "../lib/elements/forms";
import { BoxIcons } from "../lib/elements/icons.ts";
import "../scss/login.scss";

export function LoginPage(){

    return <div className="login-container">
        <div className="card">
            <div className="left-card-content">
                <h3>DH Panel</h3>
                <Form method="POST" target="/api/login" onResponse={(data) => {
                    console.log(data);
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
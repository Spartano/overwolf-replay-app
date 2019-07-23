import { LoginField } from './login-field.type';

export class LoginModalInfo {
	readonly toggled: boolean;
	readonly errorMessage: string;
	readonly errorField: LoginField;
	readonly passwordResetSent: boolean;
}

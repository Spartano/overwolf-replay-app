import { LoginField } from './login-field.type';
import { LoginModalSection } from './login-modal-section.type';

export class LoginModalInfo {
	readonly toggled: boolean;
	readonly errorMessage: string;
	readonly errorField: LoginField;
	readonly passwordResetSent: boolean;
	readonly currentSection: LoginModalSection;
}

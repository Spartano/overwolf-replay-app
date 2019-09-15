import { SocialUserInfo } from '../../../../../../firestone/Files/src/js/models/mainwindow/social-user-info';

export class TwitterUserInfo implements SocialUserInfo {
	readonly avatarUrl: string;
	readonly id: string;
	readonly name: string;
	readonly screenName: string;
}

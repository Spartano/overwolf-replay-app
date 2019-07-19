import { Injectable } from '@angular/core';

@Injectable()
export class LogUtils {

	extractCardId(logLine: string): string {
		if (!logLine) { return ''; }

		let split = logLine.split('CardID=');
		if (split.length !== 2) { return ''; }

		split = split[1].split(' ');
		if (split.length !== 1) { return ''; }

		return split[0];
	}
}

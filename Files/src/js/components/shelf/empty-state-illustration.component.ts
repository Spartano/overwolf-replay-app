import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';

declare var ga;

@Component({
	selector: 'empty-state-illustration',
	styleUrls: [
		`../../../css/component/shelf/manastorm-themes.scss`,
		`../../../css/component/shelf/manastorm-fonts.scss`,
		`../../../css/global.scss`,
		`../../../css/component/shelf/empty-state.component.scss`,
		`../../../css/component/shelf/manastorm-empty-state-illustration.scss`,
	],
	template: `
		<div class="tv-wrapper channel-0">
			<div class="tv-head-wrapper">
				<div class="tv-antennas-wrapper">
					<svg class="tv-antenna" width="40" height="40" viewBox="0 0 40 40">
						<path
							class="tv-antenna-body"
							d="M8, 40 Q 20 20, 20 20"
							fill="none"
							stroke="currentcolor"
							stroke-width="4px"
							stroke-linecap="round"
						/>
						<circle class="tv-antenna-head" cx="20" cy="20" r="5" fill="currentcolor" />
					</svg>
					<svg class="tv-antenna" width="40" height="40" viewBox="0 0 40 40">
						<path
							class="tv-antenna-body"
							d="M8, 40 Q 20 20, 20 20"
							fill="none"
							stroke="currentcolor"
							stroke-width="4px"
							stroke-linecap="round"
						/>
						<circle class="tv-antenna-head" cx="20" cy="20" r="5" fill="currentcolor" />
					</svg>
				</div>
				<div class="tv-head"></div>
			</div>
			<div class="tv-body">
				<div class="tv-screen">
					<div class="tv-image-wrapper">
						<svg class="tv-image" width="160" height="240" viewBox="0 0 160 240">
							<rect width="160" height="120" fill="none" />
							<path
								d="M61.26,44.61s-.81-5.64-1.21-6-.41-4.44-1.21-6.45a2,2,0,0,0-3.63,1.21L58,39Zm1.61-16.12a.91.91,0,0,0-.4-1.21.81.81,0,0,0-.69-.91.78.78,0,0,0-.52.1l-2,.81L58,23.65a1.09,1.09,0,0,0-1.41-.6,1.06,1.06,0,0,0-.6.63v-.83a1.09,1.09,0,1,0-2,.8l1.61,4.84L54.4,24.86a1.08,1.08,0,0,0-2,.81L53.6,30.1a.8.8,0,0,0,.68.91.82.82,0,0,0,.53-.1l6.85-2A.89.89,0,0,0,62.87,28.49Zm44.14-5a1.08,1.08,0,0,0-1.41.61l-1.21,3.62L106,22.85a1.09,1.09,0,0,0-2-.81v.43a1.06,1.06,0,0,0-.6-.63,1.09,1.09,0,0,0-1.41.6l-1.21,3.63-2-.8a.79.79,0,0,0-1.1.28.86.86,0,0,0-.11.52.82.82,0,0,0,.29,1.11.79.79,0,0,0,.52.1l6.85,2A.81.81,0,0,0,106.3,29a.78.78,0,0,0,.1-.52l1.21-3.63A1.09,1.09,0,0,0,107,23.45Zm-4.14,7.08-.09,0,.4-.41a1.62,1.62,0,0,0-2.21.58,1.74,1.74,0,0,0-.21.63c-.4,2-.81,4.44-1.21,6.45s-1.21,6.45-1.21,6.45l2.82-5.64,2.82-6A1.6,1.6,0,0,0,102.87,30.53ZM87.05,62.35l2.83,2.82,3.22-2.82-2-1.21Zm7.66-29A14.33,14.33,0,0,0,94,29.71h-.11a95.1,95.1,0,0,1-10.25.95L77,30.74c-2.4,0-4.79-.13-7.13-.29.5-4,1.9-7.29,4.43-9.52a15,15,0,0,0-9,9.12h0c0,.08,0,.17-.08.25l-.18.61h-.14L58,64.77c3.3-4.4,8.43-7.15,14.13-8.43,2.74,4.76,5.55,8.89,7.24,11.25l0-.08a110,110,0,0,1-5.14-11.57c10.55-1.66,22.5,1.46,28.47,8.43L94.7,33.55C94.7,33.48,94.71,33.4,94.71,33.33Z"
								fill="#dedede"
							/>
							<path
								d="M96.73,73.23l-9.27,6L78.59,68.8,68.11,82.51,59.56,76c-1.68,13,15.29,31.1,35.8,19.77,5.54-4.53,7.5-11.9,8-18.39ZM92,44.26a150.62,150.62,0,0,0-21.25-.35,96.72,96.72,0,0,0,8.71,23.6l0,.07C79.51,67.43,87.62,55.22,92,44.26ZM75.36,36.15a1.61,1.61,0,1,0-1.61,1.61A1.61,1.61,0,0,0,75.36,36.15ZM93.91,29.7H94A14.1,14.1,0,0,0,79.84,20h0a14.87,14.87,0,0,0-5.56.92c-2.53,2.23-3.92,5.53-4.42,9.51A112.7,112.7,0,0,0,93.91,29.7Zm-6.45,6.45a2,2,0,1,0-2,2A2,2,0,0,0,87.46,36.15ZM70.53,69.61l-5.65-6-2.82,3.63,2.82,7.66Z"
								fill="#fff"
							/>
							<path
								d="M59.56,76l-2.13-1.63C57.65,84.87,61.49,100,81.77,100c6,0,10.4-1.67,13.6-4.29C74.86,107.05,57.88,89,59.56,76Z"
								fill="#dedede"
							/>
							<rect y="120" width="160" height="120" fill="none" />
							<path
								d="M61.26,164.61s-.81-5.64-1.21-6-.41-4.44-1.21-6.45a2,2,0,0,0-3.63,1.21L58,159Zm1.61-16.12a.91.91,0,0,0-.4-1.21.81.81,0,0,0-.69-.91.78.78,0,0,0-.52.1l-2,.81L58,143.65a1.09,1.09,0,0,0-1.41-.6,1.06,1.06,0,0,0-.6.63v-.83a1.09,1.09,0,1,0-2,.8l1.61,4.84-1.21-3.63a1.08,1.08,0,0,0-2,.81l1.21,4.43a.8.8,0,0,0,.68.91.82.82,0,0,0,.53-.1l6.85-2A.89.89,0,0,0,62.87,148.49Zm44.14-5a1.08,1.08,0,0,0-1.41.61l-1.21,3.62,1.61-4.83a1.09,1.09,0,0,0-2-.81v.43a1.06,1.06,0,0,0-.6-.63,1.09,1.09,0,0,0-1.41.6l-1.21,3.63-2-.8a.79.79,0,0,0-1.1.28.86.86,0,0,0-.11.52.82.82,0,0,0,.29,1.11.79.79,0,0,0,.52.1l6.85,2a.81.81,0,0,0,1.11-.29.78.78,0,0,0,.1-.52l1.21-3.63A1.09,1.09,0,0,0,107,143.45Zm-4.14,7.08-.09,0,.4-.41a1.62,1.62,0,0,0-2.21.58,1.74,1.74,0,0,0-.21.63c-.4,2-.81,4.44-1.21,6.45s-1.21,6.45-1.21,6.45l2.82-5.64,2.82-6A1.6,1.6,0,0,0,102.87,150.53ZM87.05,182.35l2.83,2.82,3.22-2.82-2-1.21Zm7.66-29a14.33,14.33,0,0,0-.69-3.62h-.11a95.1,95.1,0,0,1-10.25,1l-6.71.09c-2.4,0-4.79-.13-7.13-.29.5-4,1.9-7.29,4.43-9.52a15,15,0,0,0-9,9.12h0c0,.08,0,.17-.08.25l-.18.61h-.14L58,184.77c3.3-4.4,8.43-7.15,14.13-8.43,2.74,4.76,5.55,8.89,7.24,11.25l0-.08a110,110,0,0,1-5.14-11.57c10.55-1.66,22.5,1.46,28.47,8.43L94.7,153.55C94.7,153.48,94.71,153.4,94.71,153.33Z"
								fill="#dedede"
							/>
							<path
								d="M96.73,193.23l-9.27,6.05L78.59,188.8,68.11,202.51,59.56,196c-1.68,13,15.29,31.1,35.8,19.77,5.54-4.53,7.5-11.9,8-18.39Zm-4.74-29a150.62,150.62,0,0,0-21.25-.35,96.72,96.72,0,0,0,8.71,23.6l0,.07C79.51,187.43,87.62,175.22,92,164.26Zm-16.63-8.11a1.61,1.61,0,1,0-1.61,1.61A1.61,1.61,0,0,0,75.36,156.15Zm18.55-6.45H94A14.1,14.1,0,0,0,79.84,140h0a14.87,14.87,0,0,0-5.56.92c-2.53,2.23-3.92,5.53-4.42,9.51A112.7,112.7,0,0,0,93.91,149.7Zm-6.45,6.45a2,2,0,1,0-2,2A2,2,0,0,0,87.46,156.15ZM70.53,189.61l-5.65-6.05-2.82,3.63,2.82,7.66Z"
								fill="#fff"
							/>
							<path
								d="M59.56,196l-2.13-1.63C57.65,204.87,61.49,220,81.77,220c6,0,10.4-1.67,13.6-4.29C74.86,227.05,57.88,209,59.56,196Z"
								fill="#dedede"
							/>
							<rect y="118" width="160" height="2" fill="#dedede" />
							<rect y="238" width="160" height="2" fill="#dedede" />
						</svg>
					</div>
					<div class="tv-waves-wrapper">
						<svg class="tv-wave" width="400" height="60" viewBox="0 0 400 60">
							<path
								d="M0, 30 Q 15 10, 30 30 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0"
								fill="none"
								stroke="currentcolor"
							/>
						</svg>
					</div>
				</div>
				<div class="tv-aside">
					<div class="tv-btn tv-btn-main"></div>
					<div class="tv-btn tv-btn-secondary"></div>
				</div>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateIllustrationComponent implements AfterViewInit {
	constructor(private el: ElementRef) {}

	ngAfterViewInit() {
		// This is taken straight from the raw js from gai, so that it's easier
		// to reproduce his modifications
		const tvWrapper = document.querySelector('.tv-wrapper');
		const tvBody = document.querySelector('.tv-body');
		const tvHeadWrapper = document.querySelector('.tv-head-wrapper');
		const tvAntennas = document.querySelectorAll('.tv-antenna');
		const tvBtnMain: any = document.querySelector('.tv-btn-main');
		const tvBtnSecondary = document.querySelector('.tv-btn-secondary');

		let state;
		const tvAntennaStates = {
			open: {
				d: 'M8, 40 Q 20 20, 20 20',
				cx: '20',
				cy: '20',
			},

			close: {
				d: 'M8, 40 Q 14 30, 14 30',
				cx: '14',
				cy: '30',
			},

			shy: {
				d: 'M8, 40 Q 18 22, 25 30',
				cx: '25',
				cy: '30',
			},
		};

		let channelIndex = 0;
		let btnsHintIsOn = true;
		let antennaIsClosed = false;

		tvBody.addEventListener('dblclick', e => {
			tvWrapper.classList.add('shake');
			tvWrapper.classList.add('smacked');
			ga('send', 'event', 'empty-state', 'tv-body-doubleclick');

			setTimeout(() => {
				tvWrapper.classList.remove('smacked');
			}, 3000);
		});

		tvWrapper.addEventListener(
			'animationend',
			() => {
				tvWrapper.classList.remove('shake');
			},
			false,
		);

		tvWrapper.addEventListener('mouseenter', () => {
			if (btnsHintIsOn) {
				ga('send', 'event', 'empty-state', 'tv-wrapper-mouseenter');
				tvWrapper.classList.add('hovered');
				btnsHintIsOn = false;
			}
		});

		tvHeadWrapper.addEventListener('mouseenter', () => {
			ga('send', 'event', 'empty-state', 'tv-headwrapper-mouseenter');
			updateAntennasStateSvgData(tvAntennaStates.shy);
		});

		tvHeadWrapper.addEventListener('mouseleave', () => {
			updateAntennasStateSvgData(tvAntennaStates.open);
		});

		tvBtnMain.addEventListener(
			'animationend',
			() => {
				tvWrapper.classList.remove('hovered');
			},
			false,
		);

		tvBtnMain.addEventListener('click', e => {
			ga('send', 'event', 'empty-state', 'tv-buttonmain-click');
			e.stopPropagation();
			updateMainBtn();
		});

		tvBtnSecondary.addEventListener('click', e => {
			ga('send', 'event', 'empty-state', 'tv-buttonsecondary-click');
			e.stopPropagation();
			tvBody.classList.toggle('faded');
			updateAntennasState();
		});

		tvBtnMain.addEventListener('dblclick', e => {
			ga('send', 'event', 'empty-state', 'tv-buttonmain-doubleclick');
			e.stopPropagation();
		});

		tvBtnSecondary.addEventListener('dblclick', e => {
			ga('send', 'event', 'empty-state', 'tv-buttonsecondary-doubleclick');
			e.stopPropagation();
		});

		function updateMainBtn() {
			channelIndex++;

			if (channelIndex > 12) {
				resetTvBtnMain();
				tvWrapper.classList.remove('channel-12');
			}

			tvBtnMain.style.setProperty('--channel-index', channelIndex);
			tvWrapper.classList.remove(`channel-${channelIndex - 1}`);
			tvWrapper.classList.add(`channel-${channelIndex}`);
		}

		function resetTvBtnMain() {
			tvBtnMain.classList.add('no-transition');
			tvBtnMain.style.setProperty('--channel-index', 0);
			forceReflow(tvBtnMain);
			tvBtnMain.classList.remove('no-transition');
			channelIndex = 1;
		}

		function forceReflow(element) {
			if (element === undefined) {
				element = document.documentElement;
			}
			void element.offsetHeight;
		}

		function updateAntennasState() {
			if (antennaIsClosed) {
				state = tvAntennaStates.open;
				tvHeadWrapper.classList.remove('tv-head-wrapper-untouchable');
				antennaIsClosed = false;
			} else {
				state = tvAntennaStates.close;
				tvHeadWrapper.classList.add('tv-head-wrapper-untouchable');
				antennaIsClosed = true;
			}
			updateAntennasStateSvgData(state);
		}

		function updateAntennasStateSvgData(state) {
			tvAntennas.forEach(tvAntenna => {
				let tvAntennaBody = tvAntenna.querySelector('.tv-antenna-body');
				let tvAntennaHead = tvAntenna.querySelector('.tv-antenna-head');

				tvAntennaBody.setAttribute('d', state.d);
				tvAntennaHead.setAttribute('cy', state.cy);
				tvAntennaHead.setAttribute('cx', state.cx);
			});
		}
	}
}

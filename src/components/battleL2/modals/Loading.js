const SpinnerSVG = () => (
	<svg className=" animate-spin-slow text-blue-800" width="80" height="80" viewBox="0 0 304 304" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g opacity="1">
			<path
				d="M152 304C68.0527 304 0 235.947 0 152C0 68.0527 68.0527 0 152 0L152 10.6431C73.9306 10.6431 10.6429 73.9308 10.6429 152C10.6429 230.069 73.9306 293.357 152 293.357C230.069 293.357 293.357 230.069 293.357 152L304 152C304 235.947 235.947 304 152 304Z"
				fill="currentColor"
			/>
		</g>
	</svg>
);

const Loading = () => (
	<div style={{ paddingTop: '18%' }} className="flex justify-center">
		<SpinnerSVG />
	</div>
);

export default Loading;

import { useHistory } from 'react-router-dom';

const BackButton = () => {
	const history = useHistory();

	return (
		<button
			type="button"
			onClick={() => history.goBack()}
			className="pl-8 ml-1 pt-16 cursor-pointer text-white flex items-center hover:text-brandColor-pale transition duration-200 focus:outline-none"
		>
			<div className="w-4 h-4">
				<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
					<path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M15,17h-3l-4-5l4-5h3l-4,5 L15,17z"></path>
				</svg>
			</div>
			<span className="text-sm font-bold ml-1">back</span>
		</button>
	);
};

export default BackButton;

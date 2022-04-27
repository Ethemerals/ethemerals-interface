import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import MeralThumbnail from '../../ethemerals/cards/MeralThumbnail';
import { useMeralsUtils } from '../../../hooks/useMeralsUtils';
import { shortenAddress } from '../../../utils';

import winMedal from '../../../assets/battle/win_medal.png';

import { formatDistance } from 'date-fns';
import ReviverThumbnail from './ReviverThumbnail';

const HistoryMeral = ({ stake }) => {
	const history = useHistory();
	const { elements } = useMeralsUtils();

	const [timeAgo, setTimeAgo] = useState('');
	const [duration, setDuration] = useState('');
	const [win, setWin] = useState(true);

	useEffect(() => {
		if (stake) {
			setWin(parseInt(stake.elf) > 0);
			let now = new Date();
			let ago = new Date(parseInt(stake.startTime * 1000));
			let _timeAgo = formatDistance(now, ago);
			let _duration = formatDistance(stake.startTime * 1000, stake.endTime * 1000);

			setTimeAgo(_timeAgo);
			setDuration(_duration);
		}
		return () => {
			setTimeAgo('');
			setDuration('');
		};
	}, [stake]);

	const select = async (id) => {
		history.push(`/ethemeral/${id}`);
	};

	const selectReviver = async (id) => {
		history.push(`/ethemeral/${id}`);
	};

	return (
		<div className="w-full flex just-center relative my-3">
			<MeralThumbnail nft={stake.meral} select={select} />
			<div style={{ height: '98px' }} className="w-full bg-gray-200 mb-8 rounded-r-lg shadow-lg overflow-hidden">
				<div className="text-md px-4 text-white" style={{ backgroundColor: elements[stake.meral.element].color1 }}>
					{stake.meral.name.toUpperCase()}
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div className="ml-4 text-gray-500 text-xs my-1">
						<p>
							<span>OWNER: </span>
							<span className="text-black"> {shortenAddress(stake.owner.id, 3)}</span>
						</p>
						<p>
							<span>SIZE: </span>
							<span className="text-black">{stake.positionSize}</span>
						</p>
						<p>
							<span>STAKED:</span>
							<span className="pl-1 text-black overflow-hidden whitespace-nowrap">{timeAgo} ago</span>
						</p>
						<p>
							<span>DURATION:</span>
							<span className="pl-1 text-black overflow-hidden whitespace-nowrap">{duration}</span>
						</p>
					</div>

					<div className=" text-gray-500 text-xs my-1 pl-4">
						<p>
							<span>HP {win ? 'GAINS' : 'LOSE'}:</span>
							<span className={`pl-1 font-bold ${win ? 'text-green-800' : 'text-red-800'}`}>{win ? `+${stake.hp}` : `-${stake.hp}`}</span>
						</p>
						<p>
							<span>ELF {win ? 'GAINS' : 'LOSE'}:</span>
							<span className={`pl-1 font-bold ${win ? 'text-green-800' : 'text-red-800'}`}>{win ? `+${stake.elf}` : `${stake.revived ? '-500' : '0'}`}</span>
						</p>
						{stake.revived && <p>REVIVED BY:</p>}
					</div>
				</div>
			</div>
			{stake.revived && <ReviverThumbnail nft={stake.reviver} select={selectReviver} />}
			<div className="flex absolute -top-4 -right-4">{win && <img className="mx-auto w-56" style={{ width: '80px', height: '46px' }} src={winMedal} alt="" />}</div>
		</div>
	);
};

export default HistoryMeral;

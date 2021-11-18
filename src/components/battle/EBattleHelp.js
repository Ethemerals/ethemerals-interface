import { useState } from 'react';
import Links from '../../constants/Links';

import BattleHelpStats from '../../assets/battle/ebattle_help_stats.png';

const EBattleHelp = () => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div style={{ maxWidth: '864px' }} className="bg-white bg-opacity-40 text-black text-left mx-auto mt-20 p-6">
			<h1 className=" text-brandColor-purple text-3xl">The Eternal Battle</h1>
			<p>
				Welcome to the first of many battle / gamified staking contract! <span className="text-xs font-bold text-brandColor">(Due to HIGH GAS! Future development will be on Layer2)</span>
			</p>
			<p className="mt-2">
				Choose a crypto market pair and stake your Merals Honor Points (HP) on a <span className="font-bold text-green-600">Long</span> or <span className="font-bold text-red-600">Short</span>{' '}
				position. Increase your HP and ELF stats if the market moves in your favour!
			</p>
			<p className="mt-2">
				Market data is sourced directly onchain from the{' '}
				<a href="https://data.chain.link/" className="text-blue-600" target="blank" rel="noreferrer">
					Chainlinks Data Feeds.{' '}
				</a>
				If you have suggested markets, encounter bugs or need general support please shout out in our{' '}
				<a href={Links.DISCORD} className="text-blue-600" target="blank" rel="noreferrer">
					Discord.
				</a>
			</p>
			<button onClick={() => setExpanded(!expanded)} className="rounded text-brandColor-purple hover:text-brandColor-pale text-sm px-2 mt-2">
				{expanded ? 'CLICK TO HIDE RULES...' : 'CLICK TO EXPAND RULES...'}
			</button>
			{expanded && (
				<>
					<h3 className="font-bold text-lg mt-6">How To</h3>
					<ul className="list-disc pl-4">
						<li>Choose a crypto market</li>
						<li>
							Long or Short. For example <strong>JOIN ETH</strong> or <strong>JOIN USD</strong>
						</li>
						<li>First ecosystem interaction? Approve Delegates to allow Ethemeral contracts to transfer your Merals</li>
						<li>Choose a position size. The bigger the stake the more HP you will gain (or lose)</li>
						<li>Send your Meral to Battle!</li>
						<li>
							When you are ready to exit. Click on your meral and <strong>Leave the Battle</strong>. The results will be finalized on exit
						</li>
					</ul>

					<h3 className="font-bold text-lg mt-6">Reviving Other Merals</h3>
					<ul className="list-disc pl-4">
						<li>If you see a Yellow Wing Icon show up on a Merals card that means she has near zero HP</li>
						<li>
							You can revive her and pull her from battle, she will reward you with <strong>500 ELF</strong> (from her own stock)
						</li>
						<li>
							If your Merals HP while in battle falls below 25. You risk being revived <strong>and losing 500 ELF</strong>
						</li>
						<li>When a Meral is revived, her HP gets reset to 100</li>
					</ul>

					<h3 className="font-bold text-lg mt-6">Counter Trade</h3>
					<ul className="list-disc pl-4">
						<li>If a market pair has much more participants on one side, the other side gets a countertrade bonus multiplier for ELF gained</li>
						<li>The ratios is 2:1 for each multiplier step for a max of 5x</li>
						<li>
							For example, if there are 2 Long Merals, and 1 Short Meral in a market. The short Meral will gain 2x ELF rewards! <strong>(If she leaves the battle at that moment)</strong>
						</li>
					</ul>

					<h3 className="font-bold text-lg mt-6">How Base Stats Affect The Results</h3>
					<img style={{ width: '419px', height: '110px' }} src={BattleHelpStats} className="my-2" alt="stats example" />
					<ul className="list-disc pl-4">
						<li>Your Meral will enter battle with her base stats (no class bonus)</li>
						<li>
							<span style={{ color: 'hsla(0,60%,40%,1)' }} className="font-bold">
								ATTACK:
							</span>{' '}
							Increases bonus HP gained when market moves in your favour
						</li>
						<li>
							<span style={{ color: 'hsla(230,60%,40%,1)' }} className="font-bold">
								DEFENCE:
							</span>{' '}
							Reduces HP lost when market moves against your favour
						</li>
						<li>
							<span style={{ color: 'hsla(180,60%,40%,1)' }} className="font-bold">
								SPEED:
							</span>{' '}
							Increases bonus ELF gain when market moves in your favour
						</li>
						<li>Each Merals result will be different! Send in the ones that suit your style</li>
						<li>
							The actual formula and simulations can be found{' '}
							<a href="https://gist.github.com/tyronebach/ea300ca32c7585ef4136e58b9177763e" className="text-blue-600" target="blank" rel="noreferrer">
								here{' '}
							</a>
						</li>
					</ul>

					<h3 className="font-bold text-lg mt-6">Final Thoughts</h3>
					<ul className="list-disc pl-4">
						<li>In essence this is a staking / rewards contract but based on market data</li>
						<li>I realize gas price to stake and unstake is prohibitive for most users </li>
						<li>Treat this contract as a long play, somewhere you can lock up your Merals and potentially earn rewards</li>
						<li>We're planning our migration to Layer 2 where we can create much more complex and interactive contracts and games. Let the games begin!</li>
					</ul>
				</>
			)}
		</div>
	);
};

export default EBattleHelp;

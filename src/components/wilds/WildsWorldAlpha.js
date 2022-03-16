import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const WildsWorldAlpha = () => {
	return (
		// <div className="bg_wilds bg-cover h-screen w-full pt-20 fixed overflow-y-auto">
		<div className="bg-black">
			<TransformWrapper initialScale={1.5} maxScale={2} centerOnInit={true}>
				<TransformComponent>
					<div className="bg_wilds bg-contain bg-no-repeat h-screen w-screen pt-20">
						{/* <DevInfo /> */}
						{/* <img style={{ width: '4000px', height: '4000px', objectFit: 'cover', position: 'absolute' }} src="https://ethemerals-media.s3.amazonaws.com/wilds/worldmap.jpg" alt="world map" /> */}
						<h1 className="text-white text-sm px-96">ALPHA</h1>
						{/* <div className="flex flex-wrap justify-center">{wildsLands && wildsLands.slice(0, 3).map((land) => <LandCards key={land.landId} land={land} />)}</div> */}
						{/* <LandHub /> */}
						{/* <div className="flex flex-wrap justify-center">{wildsLands && wildsLands.slice(3, wildsLands.length).map((land) => <LandCards key={land.landId} land={land} />)}</div> */}
					</div>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};

export default WildsWorldAlpha;

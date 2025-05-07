'use client';
import Image from 'next/image';
import Coin from '../../../../../public/images/studentimg/Coin.svg';
import Gems from '../../../../../public/images/studentimg/Gems.svg';
import MtCoins from '../../../../../public/images/studentimg/mtcoin.svg';
import MtGems from '../../../../../public/images/studentimg/mtgem.svg';


const BoostRightSection = () => {
    return (
        <div className="boostrightSection">
            {/* Discovery Coins Card */}
            <div className="card discovery-card" style={{ border: '1px solid #CE9000' }}>
                <div className='cardimg' style={{ border: '1px solid #CE9000', backgroundColor: '#FFF5DD' }}>
                    <Image src={Coin} alt="Discovery Coins" width={30} height={30} />
                </div>
                <div className="card-content">
                    <span>Discovery Coins</span>
                    <p style={{ color: '#CE9000' }}>300</p>
                </div>
                <Image src={MtCoins} alt="Multi Coins" className="mlt"/>
            </div>

            {/* Gems Card */}
            <div className="card gems-card" style={{ border: '1px solid #00A763' }}>
                <div className='cardimg' style={{ border: '1px solid #00A763', backgroundColor: '#70D8404A' }}>
                    <Image src={Gems} alt="Gems" width={30} height={30} />
                </div>
                <div className="card-content">
                    <span>Gems</span>
                    <p style={{ color: '#00A763' }}>300</p>
                </div>
                <button className="buy-button">Buy</button>
                <Image src={MtGems} alt="Multi Gems"  className="mlt"/>
            </div>
            
        </div>
    );
};

export default BoostRightSection;

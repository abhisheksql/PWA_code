'use client';
import React, { useEffect, useState } from 'react';
import '../../../../public/style/student.css';
import BoosterPaa from '../../components/studentcomponent/BoosterPaa';
import { useSearchParams } from 'next/navigation';

export default function Paa() {

    const searchParams = useSearchParams();
    const idparam = searchParams.get("id");
    const homeparam = searchParams.get("home");
    const[pathId,setPathId] = useState(0);
    const[homeId,setHomeId] = useState(0);

    useEffect(() => {
        // Set state based on query parameters
        idparam ? setPathId(idparam) : 0;
        homeparam? setHomeId(homeparam) : 0;
      }, [idparam]);
  return (
    <div >
      <BoosterPaa pathId={pathId} homeId={homeId}/>
  </div>
  );
}

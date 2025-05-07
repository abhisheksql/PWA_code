'use client';
import React, { useEffect, useState } from 'react';
import '../../../../public/style/student.css';
import BoosterReview from '../../components/studentcomponent/BoosterReview';
import { useSearchParams } from 'next/navigation';

export default function Review() {

  const searchParams = useSearchParams();
  const idparam = searchParams.get("home");
  const[homeId,setHomeId]= useState(1);

useEffect(() => {
  // Set state based on query parameters
  idparam ? setHomeId(idparam) : 0;
}, [idparam]);
  return (
    <div >
      <BoosterReview homeId={homeId}/>
  </div>
  );
}

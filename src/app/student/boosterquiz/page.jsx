'use client';
import React, { useEffect, useState } from 'react';
import '../../../../public/style/student.css';
import BoosterQuiz from '../../components/studentcomponent/BoosterQuiz';
import { useSearchParams } from 'next/navigation';

export default function BoosterQuizData() {

  const searchParams = useSearchParams();
  const idparam = searchParams.get("home");
  const[homeId,setHomeId]= useState(1);
useEffect(() => {
  // Set state based on query parameters
  idparam ? setHomeId(idparam) : 0;
}, [idparam]);

  return (
    <div >
      <BoosterQuiz homeId={homeId}/>
  </div>
  );
}

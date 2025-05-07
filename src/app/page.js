import Image from "next/image";
import Login from "./login/page";
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';nn
import dynamic from 'next/dynamic';

export default function Home() {

  const BootstrapJS = dynamic(() => import('bootstrap/dist/js/bootstrap.bundle.min.js'), { ssr: false });
  BootstrapJS();

  return (
    <main>
      <Login />
    </main>
  );
}

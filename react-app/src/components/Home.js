import Sidebar from "./Sidebar";
import Channel from "./Channel";
import Navbar from "./Navbar";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* <Navbar /> */}
      <div className="main-wrapper">
        <Sidebar />
        <Channel />
      </div>
    </div>
  );
}

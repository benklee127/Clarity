import Sidebar from "./Sidebar";
import Channel from "./Channel";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div>
      <div>
        <Navbar />
        <Sidebar />
        <Channel />
      </div>
    </div>
  );
}

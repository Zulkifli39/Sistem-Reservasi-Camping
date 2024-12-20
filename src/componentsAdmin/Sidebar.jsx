import {Link} from "react-router-dom";

const Sidebar = () => (
  <div className="w-64 bg-gray-800 text-white h-screen p-5">
    <h2 className="text-2xl font-bold mb-5">Belopa Outdoor</h2>
    <ul>
      <li className="mb-4">
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li className="mb-4">
        <Link to="/products">Products</Link>
      </li>
      <li className="mb-4">
        <Link to="/reservasi">Kelola Reservasi</Link>
      </li>
      <li className="mb-4">
        <Link to="/users">Users</Link>
      </li>
      <li className="mb-4">
        <Link to="/">Logout</Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;

import Bai5 from "views/Bai5.js";
import Dashboard from "views/Dashboard.js";
import TableList from "views/Tables.js";
import UserPage from "views/User.js";
import TableList2 from "views/Typography";
var routes = [
  {
    path: "/bai5",
    name: "Bai5",
    icon: "nc-icon nc-bank",
    component: <Bai5 />,
    layout: "/admin",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: <UserPage />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Action History",
    icon: "nc-icon nc-tile-56",
    component: <TableList />,
    layout: "/admin",
  },
  {
    path: "/tables2",
    name: "Data Sensor",
    icon: "nc-icon nc-tile-56",
    component: <TableList2 />,
    layout: "/admin",
  },
];

export default routes;

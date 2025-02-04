import React from "react";
import TopBar from "./UserTopbar";
import NavBar from "./UserNavbar";

const UserHeader: React.FC = () => {
    return (
        <header className="header shop">
            <TopBar/>
            <NavBar/>
        </header>
    );
};

export default UserHeader;

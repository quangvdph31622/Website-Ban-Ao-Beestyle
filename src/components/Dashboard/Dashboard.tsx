"use client"
import React from "react";
import StatisticalComponent from "../Admin/Statistical/StatisticalComponent";
import { getAdminAccountInfo } from "@/utils/AppUtil";
import Unauthorized from "@/app/unauthorized/page";


const Dashboard: React.FC = () => {
    return (
        <>
            {getAdminAccountInfo() && getAdminAccountInfo()?.role === 'ADMIN' ? (
                <div className="w-full">
                    <StatisticalComponent />
                </div>
            ) : (<Unauthorized />)}
        </>
    );
}

export default Dashboard;

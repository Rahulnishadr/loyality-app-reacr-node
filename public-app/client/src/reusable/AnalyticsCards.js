import React from "react";

const AnalyticsCards = ({ text, subtext, icon, width }) => {

    return (
        <div className={`${width} p-4 flex items-stretch justify-between shadow-md border border-gray-200 rounded-lg`}>
            <div>
                <h1 className="text-xl text-gray-600">{text}</h1>
                <h2 className="text-sm text-gray-500">{subtext}</h2>
            </div>
            <span>{icon}</span>
        </div>
    );
}

export default AnalyticsCards;
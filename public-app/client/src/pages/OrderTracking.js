import React from 'react';
import { Stepper } from 'react-form-stepper';

const OrderTracking = () => {
    return (
        <div>
            <div className="w-full mx-auto p-8 shadow-md">
                <Stepper
                    steps={[{ label: 'In Transit' }, { label: 'Pending' }, { label: 'Dispatched' }, { label: 'Delivered' }]}
                    activeStep={4}
                />

                {/* Order Details */}
                <div className="border p-4 rounded-lg mb-6">
                    <p className="text-sm mb-2"><strong>AWB Id:</strong> 83857410000814</p>
                    <p className="text-sm mb-2"><strong>Order Id:</strong> 9ed12a2aec4ad32604d6</p>
                    <p className="text-sm mb-2"><strong>Name:</strong> Aakib Ansari</p>
                    <p className="text-sm mb-2"><strong>Place On:</strong> 12, March 2019</p>
                    <p className="text-sm mb-2"><strong>Contact No:</strong> 9675552822</p>
                    <p className="text-sm mb-2"><strong>Address:</strong> Village Pauhalli Sardhana Road, Meerut Deepak Vihar Labour Chowk Noida, Amritsar, Punjab, 143004</p>
                    <p className="text-sm mb-2"><strong>Courier Partner:</strong> Delhivery</p>
                    <p className="text-sm mb-2"><strong>Pay By:</strong> POINTS</p>
                    <p className="text-sm mb-2"><strong>Order Time:</strong> 3:44:47 PM</p>
                </div>

                {/* Tracking Timestamps */}
                <div className="flex flex-col mb-6">
                    <div className="flex items-center justify-between">
                        <span>In Transit Sector 63</span>
                        <span>11/14/2024, 10:25:52 AM</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span>Pending Sector 63</span>
                        <span>11/14/2024, 10:26:24 AM</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span>Dispatched Sector 63</span>
                        <span>11/14/2024, 10:26:43 AM</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <span>Delivered Sector 63</span>
                        <span>11/14/2024, 10:26:54 AM</span>
                    </div>
                </div>

                {/* Product Details */}
                <div className="border p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-sm mt-2"><strong>Product:</strong> Rajnigandha</p>
                        <p className="text-sm mt-2"><strong>Product SKU:</strong> 100g</p>
                        <p className="text-sm mt-2"><strong>Total Points:</strong> 2188</p>
                        <p className="text-sm mt-2"><strong>Total Quantity:</strong> 1</p>
                        <p className="text-sm mt-2"><strong>Status:</strong> Completed</p>
                    </div>
                    <div>
                        {/* <img src="" className="object-cover" /> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderTracking;
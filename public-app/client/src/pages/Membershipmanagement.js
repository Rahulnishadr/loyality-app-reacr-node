/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import eligiblityImage from "../assets/muser.png";
import welcomeImage from "../assets/member-welcome.png";
import silverImage from "../assets/member-silver.png";
import goldImage from "../assets/member-gold.png";
import blueImage from "../assets/memberblue.png";
import bi_coin from "../assets/bi_coin.png";
import benifits from "../assets/benifits.png";
import cardIcon from "../assets/cardIcon.png";
import { apiCall } from "../api/Api";
import { showToast } from "../reusable/Toast";
import Toast from "../reusable/Toast";
import birthday from "../assets/birthday.jpg";
import anniversary from "../assets/anniversary.webp";
import platinum from "../assets/Platinium.png"
import LoaderSpiner from '../reusable/LoaderSpiner';
import { showPopup } from "../reusable/Toast";
import msg from "../reusable/msg.json"

const Membershipmanagement = () => {
  const [allMembershipData, setAllMembershipData] = useState(null);
  const [id, setId] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  // membershiptire section
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState();
  const [requiredPoints, setRequiredPoints] = useState({
    welcome: [100, 4999],
    blue: [5000, 14999],
    silver: [15000, 24999],
    gold: [25000, 69999],
    platinum: [70000, 99999]
  });

  //   benifit section
  const [benefits, setBenefits] = useState([
    {
      level: "Welcome",
      points: 100,
      expiry: 15,
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
    },
    {
      level: "Blue",
      points: 250,
      expiry: 15,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
    },
    {
      level: "Silver",
      points: 500,
      expiry: 15,
      bgColor: "bg-gray-200",
      textColor: "text-gray-800",
    },
    {
      level: "Gold",
      points: 750,
      expiry: 15,
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    {
      level: "Platinum",
      points: 750,
      expiry: 15,
      bgColor: "bg-gray-300",
      textColor: "text-grey-800",
    },
  ]);

  const handlePointsChange = (index, newPoints) => {
    setBenefits((prevBenefits) =>
      prevBenefits.map((benefit, i) =>
        i === index ? { ...benefit, points: newPoints } : benefit
      )
    );
  };

  const handleExpiryChange = (index, newExpiry) => {
    setBenefits((prevBenefits) =>
      prevBenefits.map((benefit, i) =>
        i === index ? { ...benefit, expiry: newExpiry } : benefit
      )
    );
  };

  //   servay other milstone section
  const [cardsData, setCardsData] = useState([
    {
      title: "Survey / Feedbacks",
      points: [
        { label: "Welc", points: 100, expiry: 10 },
        { label: "Blue", points: 200, expiry: 10 },
        { label: "Silver", points: 300, expiry: 10 },
        { label: "Gold", points: 400, expiry: 10 },
        { label: "Platinum", points: 500, expiry: 10 },
      ],
    },
    {
      title: "Other Earning Opportunities Profile Update",
      points: [
        { label: "Welcome", points: 100, expiry: 10 },
        { label: "Blue", points: 200, expiry: 10 },
        { label: "Silver", points: 300, expiry: 10 },
        { label: "Gold", points: 400, expiry: 10 },
        { label: "Platinum", points: 500, expiry: 10 },
      ],
    },
    {
      title: "Milestone Achievement (Tier Benefits)",
      points: [
        { label: "Welcome", points: 0, expiry: 12 },
        { label: "Blue", points: 0, expiry: 12 },
        { label: "Silver", points: 100, expiry: 12 },
        { label: "Gold", points: 250, expiry: 12 },
        { label: "Platinum", points: 500, expiry: 12 },
      ],
    },

  ]);

  const handlePointsChange2 = (cardIndex, pointIndex, newPoints) => {
    const updatedCards = [...cardsData];
    updatedCards[cardIndex].points[pointIndex].points = parseInt(newPoints, 10);
    setCardsData(updatedCards);
  };

  const handleExpiryChange_ = (cardIndex, pointIndex, newExpiry) => {
    const updatedCards = [...cardsData];
    updatedCards[cardIndex].points[pointIndex].expiry = parseInt(newExpiry, 10);
    setCardsData(updatedCards);
  };

  // reward point section
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    campaignName: "",
    campaignType: "",
    isActive: false,
    welcomeNumber: 0,
    blueNumber: 0,
    silverNumber: 0,
    goldNumber: 0,
    platinumNumber: 0,
    welcomePoints: 100,
    bluePoints: 100,
    silverPoints: 100,
    goldPoints: 100,
    platinumPoints: 100,
  });

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   
  //   setFormData({
  //     ...formData,
  //     [name]: type === "checkbox" ? checked : value,
  //   });
  // };

  // birthday and anniversary section
  const [birthdayDays, setBirthdayDays] = useState(7);
  const [anniversaryDays, setAnniversaryDays] = useState(30);

  const handleUpdateBirthday = async () => {

    const data = {
      id: id,
      birthday_card: birthdayDays,
    };
    try {
      const response = await apiCall(
        "/tier_management/updateCard",
        "POST",
        data
      );
      if (response.status === 200) {
        showToast("Birthday date updated successfully!", "success");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message?.errors || error.message,
        "error"
      );
    }
  };

  const handleUpdateAniversary = async () => {

    const data = {
      id: id,
      marriage_anniversary_card: anniversaryDays, // Updated key for anniversary card
    };
    try {
      const response = await apiCall(
        "/tier_management/updateCard",
        "POST",
        data
      );
      if (response.status === 200) {
        showToast("Anniversary date updated successfully!", "success");
      }
    } catch (error) {
      showToast(
        error?.response?.data?.message?.errors || error?.message,
        "error"
      );
    }
  };

  const getAllMembershipData = async () => {
    setShowLoader(true)
    try {
      const response = await apiCall("/tier_management/list", "GET");
      if (response.status === 200) {
        setAllMembershipData(response.data);
        setShowLoader(false)
        const data = response?.data[0];
        setId(response?.data[0]?.id);


        // Start Management -> Required Points
        setRequiredPoints({
          welcome: [
            parseInt(data?.start_mangement?.welcome?.start_point),
            parseInt(data?.start_mangement?.welcome?.end_point),
          ],
          blue: [
            parseInt(data?.start_mangement?.blue?.start_point),
            parseInt(data?.start_mangement?.blue?.end_point),
          ],
          silver: [
            parseInt(data?.start_mangement?.silver?.start_point),
            parseInt(data?.start_mangement?.silver?.end_point),
          ],
          gold: [
            parseInt(data?.start_mangement?.gold?.start_point),
            parseInt(data?.start_mangement?.gold?.end_point),
          ],
          platinum: [
            parseInt(data?.start_mangement?.platinum?.start_point),
            parseInt(data?.start_mangement?.platinum?.end_point),
          ],

        });

        // Financial Year
        setMonth(data?.financial_year?.select_month);
        setDate(
          new Date(data?.financial_year?.select_date).getDate().toString()
        );
        // setEndDate(data?.financial_year?.select_date);
        const date = data?.financial_year?.select_date;

        if (date) {
          const formattedDate = date.split('-').reverse().join('-');
          setEndDate(formattedDate); // "15-12-2025"
        }
        
        


        // Benefits
        setBenefits([
          {
            level: "Welcome",
            points: parseInt(data?.benefits?.welcome?.benefit),
            expiry: data?.benefits?.welcome?.expiry,
            bgColor: "bg-pink-100",
            textColor: "text-pink-800",
          },
          {
            level: "Blue",
            points: parseInt(data?.benefits?.blue?.benefit),
            expiry: data?.benefits?.blue?.expiry,
            bgColor: "bg-blue-100",
            textColor: "text-blue-800",
          },
          {
            level: "Silver",
            points: parseInt(data?.benefits?.silver?.benefit),
            expiry: data?.benefits?.silver?.expiry,
            bgColor: "bg-gray-200",
            textColor: "text-gray-800",
          },
          {
            level: "Gold",
            points: parseInt(data?.benefits?.gold?.benefit),
            expiry: data?.benefits?.gold?.expiry,
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-800",
          },
          {
            level: "Platinum",
            points: parseInt(data?.benefits?.platinum?.benefit),
            expiry: data?.benefits?.platinum?.expiry,
            bgColor: "bg-gray-300",
            textColor: "text-gray-800",
          },
        ]);

        // Survey Management, Profile Update, Tier Benefits, Bonus Benefits -> Cards Data
        setCardsData([
          {
            title: "Survey / Feedbacks",
            points: [
              {
                label: "Welcome",
                points: data?.survey_mangement?.welcome?.point,
                expiry: data?.survey_mangement?.welcome?.expiry,
                // points: parseInt(data.survey_mangement?.welcome),

              },
              {
                label: "Blue",
                points: data?.survey_mangement?.blue?.point,
                expiry: data?.survey_mangement?.blue?.expiry
              },
              {
                label: "Silver",
                points: data?.survey_mangement?.silver?.point,
                expiry: data?.survey_mangement?.silver?.expiry,
              },
              {
                label: "Gold",
                points: data?.survey_mangement?.gold?.point,
                expiry: data?.survey_mangement?.gold?.expiry
              },
              {
                label: "Platinum",
                points: data?.survey_mangement?.platinum?.point,
                expiry: data?.survey_mangement?.platinum?.expiry
              },
            ],
          },
          {
            title: "Other Earning Opportunities Profile Update",
            points: [
              {
                label: "Welcome",
                points: data?.profile_update?.welcome?.point,
                expiry: data?.profile_update?.welcome?.expiry,
              },
              {
                label: "Blue",
                points: data?.profile_update?.blue?.point,
                expiry: data?.profile_update?.blue?.expiry
              },
              {
                label: "Silver",
                points: data?.profile_update?.silver?.point,
                expiry: data?.profile_update?.silver?.expiry,
              },
              {
                label: "Gold",
                points: data?.profile_update?.gold?.point,
                expiry: data?.profile_update?.gold?.expiry
              },
              {
                label: "Platinum",
                points: data?.profile_update?.platinum?.point,
                expiry: data?.profile_update?.platinum?.expiry
              },
            ],
          },
          {
            title: "Milestone Achievement (Tier Benefits)",
            points: [
              {
                label: "Welcome",
                points: data?.tier_benefits?.welcome?.point,
                expiry: data?.tier_benefits?.welcome?.expiry,
              },
              {
                label: "Blue",
                points: data?.tier_benefits?.blue?.point,
                expiry: data?.tier_benefits?.blue?.expiry
              },
              {
                label: "Silver",
                points: data?.tier_benefits?.silver?.point,
                expiry: data?.tier_benefits?.silver?.expiry
              },
              {
                label: "Gold",
                points: data?.tier_benefits?.gold?.point,
                expiry: data?.tier_benefits?.gold?.expiry
              },
              {
                label: "Platinum",
                points: data?.tier_benefits?.platinum?.point,
                expiry: data?.tier_benefits?.platinum?.expiry
              },
            ],
          },

        ]);

        // TwoX Reward Points
        setFormData({
          startDate: data?.twoX_reward_point?.start_date,
          endDate: data?.twoX_reward_point?.end_date,
          campaignName: data?.twoX_reward_point?.campaign_name,
          campaignType: data?.twoX_reward_point?.campaign_type,
          isActive: data?.twoX_reward_point?.status,
          welcomeNumber: parseInt(data?.twoX_reward_point?.welcome?.number),
          blueNumber: parseInt(data?.twoX_reward_point?.blue?.number),
          silverNumber: parseInt(data?.twoX_reward_point?.silver?.number),
          goldNumber: parseInt(data?.twoX_reward_point?.gold?.number),
          platinumNumber: parseInt(data?.twoX_reward_point?.platinum?.number),
          welcomePoints: parseInt(data?.twoX_reward_point?.welcome?.point),
          bluePoints: parseInt(data?.twoX_reward_point?.blue?.point),
          silverPoints: parseInt(data?.twoX_reward_point?.silver?.point),
          goldPoints: parseInt(data?.twoX_reward_point?.gold?.point),
          platinumPoints: parseInt(data?.twoX_reward_point?.platinum?.point),
        });



        // Birthday and Anniversary Cards
        setBirthdayDays(parseInt(data?.birthday_card));
        setAnniversaryDays(parseInt(data?.marriage_anniversary_card));
      }
    } catch (error) {
      setShowLoader(false)
      console.error(
        "Error calling the API:",
        error?.response?.data?.message?.errors || error?.message
      );
    }
    finally {
      setShowLoader(false)
    }
  };



  useEffect(() => {
    getAllMembershipData();
  }, []);

  // useEffect(() => {
  //   const calculateEndDate = (selectedMonth) => {
  //     const monthMapping = {
  //       January: "December 31",
  //       February: "January 31",
  //       March: "February 28",
  //       April: "March 31",
  //       May: "April 30",
  //       June: "May 31",
  //       July: "June 30",
  //       August: "July 31",
  //       September: "August 31",
  //       October: "September 30",
  //       November: "October 31",
  //       December: "November 30",
  //     };
  //     return monthMapping[selectedMonth];
  //   };
  //   setEndDate(calculateEndDate(month));
  // }, [month]);

  const handleSubmit = async (e) => {
    if (e == 'read') {
      showPopup('warning', msg.readOnly)
    } else {
      setShowLoader(true)
      e.preventDefault();
      const formattedData = {
        twoX_reward_point: {
          start_date: formData?.startDate,
          end_date: formData?.endDate,
          campaign_name: formData?.campaignName,
          campaign_type: formData?.campaignType,
          status: formData?.isActive ? true : false,
          welcome: {
            number: formData?.welcomeNumber.toString(),
            point: formData?.welcomePoints.toString(),
          },
          blue: {
            number: formData?.blueNumber.toString(),
            point: formData?.bluePoints.toString(),
          },
          silver: {
            number: formData?.silverNumber.toString(),
            point: formData?.silverPoints.toString(),
          },
          gold: {
            number: formData?.goldNumber.toString(),
            point: formData?.goldPoints.toString(),
          },
          platinum: {
            number: formData?.platinumNumber.toString(),
            point: formData?.platinumPoints.toString(),
          },
        },
      };

      // Map card titles to keys in the final output
      const titleMapping = {
        "Survey / Feedbacks": "survey_mangement",
        "Other Earning Opportunities Profile Update": "profile_update",
        "Milestone Achievement (Tier Benefits)": "tier_benefits",
        // "Milestone Achievement Bonus Coin": "bonus_benefits",
      };

      // Transform cardsData into the desired format
      // const formattedDataSurvey = cardsData.reduce((acc, card) => {
      //   const key = titleMapping[card.title];
      //   if (key) {
      //     acc[key] = card.points.reduce((tierAcc, { label, points }) => {
      //       tierAcc[label.toLowerCase()] = points.toString();
      //       return tierAcc;
      //     }, {});
      //   }
      //   return acc;
      // }, {});

      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const year = String(date.getFullYear()).slice(-2); // Last 2 digits of the year
        return `${day}-${month}-${year}`;
      };

      const formattedDataSurvey = cardsData.reduce((acc, card) => {

        const key = titleMapping[card.title];

        if (key) {

          acc[key] = {
            status: "active",
            ...card.points.reduce((tierAcc, { label, points, expiry }) => {

              const expiryDate = new Date();

              const cardValue = cardsData?.filter((c) => c.title === card.title);

              const cardDetails = cardValue[0].points?.filter((value) => value.label === label);

              expiryDate.setDate(expiryDate?.getDate() + expiry); // Add Expiry days to current date
              tierAcc[label.toLowerCase()] = {
                point: points?.toString(),
                expiry_date: formatDate(expiryDate),
                expiry: cardDetails[0].expiry

              };
              return tierAcc;
            }, {}),
          };
        }
        return acc;
      }, {});

      const today = new Date();



      // Prepare the formatted benefits data
      const formattedBenefits = {
        benefits: {
          welcome: {
            benefit: String(benefits[0].points), // Points as string
            // expiry:allMembershipData,
            expiry: benefits[0].expiry,
            expiry_date: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + benefits[0].expiry
            )
              // benefit
              .toISOString()
              .split("T")[0], // Calculate expiry date
          },
          blue: {
            benefit: String(benefits[1].points),
            expiry: benefits[1].expiry,
            expiry_date: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + benefits[1].expiry
            )
              .toISOString()
              .split("T")[0],
          },
          silver: {
            benefit: String(benefits[2].points),
            expiry: benefits[2].expiry,
            expiry_date: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + benefits[2].expiry
            )
              .toISOString()
              .split("T")[0],
          },
          gold: {
            benefit: String(benefits[3].points),
            expiry: benefits[3].expiry,
            expiry_date: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + benefits[3].expiry
            )
              .toISOString()
              .split("T")[0],
          },
          platinum: {
            benefit: String(benefits[4].points),
            expiry: benefits[4].expiry,
            expiry_date: new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() + benefits[4].expiry
            )
              .toISOString()
              .split("T")[0],
          },
        },
      };

      // Calculate start date in the format YYYY-MM-DD
      const startDate = new Date(`${month} ${date}, ${new Date().getFullYear()}`);
      const startDateFormatted = startDate.toLocaleDateString("en-CA");

      // Calculate end date one year later
      const endDateCalc = new Date(startDate);
      endDateCalc.setFullYear(endDateCalc.getFullYear() + 1);
      endDateCalc.setDate(endDateCalc.getDate() - 1); // One day before to get end of the financial year
      const endDateFormatted = endDateCalc.toISOString().split("T")[0];

      // Reformat the requiredPoints data to match the start_management structure
      const startManagement = Object.fromEntries(
        Object.entries(requiredPoints).map(([key, [start, end]]) => [
          key,
          { start_point: start.toString(), end_point: end.toString() },
        ])
      );

      // Create the data object in the desired format

      try {
        const finaldata = {
          id: id || null,
          start_mangement: startManagement,
          financial_year: {
            select_month: month,
            select_date: startDateFormatted,
            end_date: endDateFormatted,
          },
          benefits: formattedBenefits.benefits,

          survey_mangement: formattedDataSurvey.survey_mangement,
          profile_update: formattedDataSurvey.profile_update,
          tier_benefits: formattedDataSurvey.tier_benefits,

          // survey_mangement: formattedDataSurvey.survey_mangement,
          // profile_update: formattedDataSurvey.profile_update,
          // tier_benefits: formattedDataSurvey.tier_benefits,
          bonus_benefits: formattedDataSurvey.bonus_benefits,
          twoX_reward_point: formattedData.twoX_reward_point,
          birthday_card: birthdayDays,
          marriage_anniversary_card: anniversaryDays,
        };

        const response = await apiCall(
          "/tier_management/create",
          "Post",
          finaldata
        );
        if (response.status === 200) {
          // showToast("Updated successfully!", "success");
          showPopup("success", "Updated successfully!");
          setShowLoader(false)
        }
        if (response.status === 201) {
          showPopup("success", "Updated successfully!");
          setShowLoader(false)
          // showToast("Saved successfully!", "success");
        }
      } catch (error) {
        setShowLoader(false)
        showToast(
          error?.response?.data?.message?.errors || error.message,
          "error"
        );
      }
    }


  }
  const images = {
    welcome: welcomeImage,
    blue: blueImage,
    silver: silverImage,
    gold: goldImage,
    platinum: platinum
  };

  const colorMapping = {
    welcome: "bg-pink-200", // Adjust colors as needed
    blue: "bg-blue-100",
    silver: "bg-gray-100",
    gold: "bg-yellow-100",
    platinum: "bg-gray-300"
  };

  const data = {};
  return (
    <div className="w-full mx-auto p-8 shadow-md">
      {showLoader && <LoaderSpiner text="Loading ..." />}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          Membership Tiers And Benefits
        </h1>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-sky-500 focus:ring focus:ring-sky-500 focus:outline-none"
        >
          {id ? "Update" : "Save"}
        </button>

      </div>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Eligibility Section */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <div className="flex flex-row items-center mb-6">
              <div className="bg-black rounded w-20 h-20 flex items-center justify-center mr-4">
                <img src={eligiblityImage} alt="" />
              </div>
              <h2 className="font-semibold text-xl">Eligibility</h2>
            </div>
            <div className="mb-4 w-full">
              <label className="block font-medium text-gray-700 mb-2">
                Financial Year
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-teal-500"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 w-full">
              <label className="block font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-teal-500"
              >
                {[...Array(31).keys()].map((d) => (
                  <option key={d + 1} value={d + 1}>
                    {d + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="text"
                value={endDate}
                readOnly
                className="block w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          {/* Membership Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {Object.keys(requiredPoints).map((tier) => (
              <div
                key={tier}
                className={`p-6 rounded-lg border ${colorMapping[tier]} flex`}
              >
                {/* Left Section: Icon and Title */}
                <div className="flex flex-col items-center mr-4">
                  {/* Fixed-size container for the image */}
                  <div className="w-20 h-12 flex items-center justify-center">
                    <img
                      src={images[tier]}
                      alt={`${tier} icon`}
                      className="w-full h-full rounded mb-2"
                    />
                  </div>
                  <h3 className="text-xl font-semibold capitalize">{tier}</h3>
                </div>

                {/* Right Section: Required Points and Inputs */}
                <div className="flex flex-col justify-center w-full">
                  <label className="font-medium text-gray-600 mb-2">
                    Required Points
                  </label>
                  <div className="flex flex-col gap-2">


                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={requiredPoints[tier][0]}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setRequiredPoints({
                            ...requiredPoints,
                            [tier]: [value, requiredPoints[tier][1]],
                          });
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-teal-500"
                    />

                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={requiredPoints[tier][1]}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          setRequiredPoints({
                            ...requiredPoints,
                            [tier]: [requiredPoints[tier][0], value],
                          });
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-teal-500"
                    />


                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* benifit section */}
      <div className="w-full max-w-6xl mx-auto mt-8">
        {/* Benefits Title with Icon */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-black rounded mr-2 flex items-center justify-center">
            <img
              src={benifits}
              alt="Benefits icon placeholder"
              className="w-8 h-8"
            />
          </div>
          <h2 className="text-2xl font-semibold">Benefits</h2>
        </div>

        {/* Main Content Section Card */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex">
            {/* Left Section */}
            <div className="w-1/3 flex flex-col items-start mr-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center mb-2">
                <img
                  src={bi_coin}
                  alt="Gift icon placeholder"
                  className="w-4 h-4"
                />
              </div>
              <p className="text-gray-600 text-sm px-2 mt-0">
                Experience exciting surprises sent to birthday month!
              </p>
            </div>


            <div className="w-2/3 space-y-2">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex p-3 rounded-lg ${benefit.bgColor} space-y-2 sm:space-y-0 sm:space-x-2`}
                >
                  <span
                    className={`font-semibold ${benefit.textColor} w-full sm:w-1/4`}
                  >
                    {benefit.level}
                  </span>

                  <div className="flex items-center w-full justify-between sm:w-1/4">
                    <span className="text-gray-600 whitespace-nowrap mr-1">
                      Points
                    </span>

                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={benefit.points}
                      className="font-semibold w-full max-w-[60px] p-1 text-center border border-gray-300 rounded"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          handlePointsChange(index, value);
                        }
                      }}
                    />

                  </div>

                  <div className="flex items-center justify-between  w-full sm:w-1/4">
                    <span className="text-gray-600 whitespace-nowrap mr-1">
                      Expiry Day
                    </span>

                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={benefit.expiry}
                      className="font-semibold w-full max-w-[60px] p-1 text-center border border-gray-300 rounded"
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          handleExpiryChange(index, value);
                        }
                      }}
                    />

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* survey other milestone section  */}
      <div className="w-full flex flex-wrap justify-between mt-8">
        {cardsData.map((card, cardIndex) => (
          <div
            key={cardIndex}
            className="max-w-md-custom bg-white shadow-md rounded-lg p-6 flex flex-col lg:w-[48%] mb-4"
          >
            <div className="flex flex-row gap-4">
              <div className="flex flex-col w-1/3">
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center mb-4">
                  <img
                    src={bi_coin}
                    alt="Gift icon placeholder"
                    className="w-5 h-5"
                  />
                </div>
                <p className="text-gray-700 text-sm font-medium">{card.title}</p>
              </div>

              <div className=" flex flex-col flex-grow gap-4 w-[550px]">
                {card.points.map((item, pointIndex) => (
                  <div
                    key={pointIndex}
                    className={`flex items-center justify-between p-3 rounded-lg ${pointIndex === 0
                      ? "bg-pink-100"
                      : pointIndex === 1
                        ? "bg-blue-100"
                        : pointIndex === 2
                          ? "bg-gray-200"
                          : pointIndex === 3
                            ? "bg-yellow-100"
                            : "bg-gray-300"
                      }`}
                  >
                    <span className="font-medium text-gray-600 w-1/4">
                      {item.label}
                    </span>
                    <span className="text-sm text-gray-500 w-1/4 text-center">
                      Points
                    </span>

                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={item.points}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          handlePointsChange2(cardIndex, pointIndex, value);
                        }
                      }}
                      // className="font-semibold w-full max-w-[60px] p-1 text-center border border-gray-300 rounded"
                      className="w-20 text-center bg-white border border-gray-300 rounded-md p-1 text-gray-700"
                    />

                    <span className="text-sm text-gray-500 w-1/4 text-center">
                      Expiry Day
                    </span>

                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      value={item.expiry}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d+$/.test(value)) {
                          handleExpiryChange_(cardIndex, pointIndex, value);
                        }
                      }}
                      className="w-20 text-center bg-white border border-gray-300 rounded-md p-1 text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* birthday and anniversary celebration  */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-start items-stretch">
          {/* Card Icon and Title */}
          <div className="flex items-center w-1/5 mr-8 mb-44">
            <img
              src={cardIcon}
              alt=""
              className="w-12 h-12 mr-2 bg-black rounded"
            />
            <h2 className="text-xl font-semibold">Card</h2>
          </div>

          {/* Birthday Card */}
          <div className="bg-blue-100 p-4 rounded-lg w-1/2 mr-4 flex flex-col flex-grow min-h-[240px]">
            <div className="flex justify-around">
              <div className="items-center mb-4">
                <img src={birthday} alt="" className="w-8 h-8 mr-2" />
                <span className="text-gray-600 text-sm">BIRTHDAY</span>
              </div>
              <div className="mb-4 flex flex-col">
                <label className="block mb-1">Validity Days</label>

                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  value={birthdayDays}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setBirthdayDays(value);
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />

              </div>
            </div>
            <div className="mt-auto  flex justify-end">
              <button
                onClick={handleUpdateBirthday}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Update Card
              </button>
            </div>
          </div>

          {/* Marriage Anniversary Card */}
          <div className="bg-blue-100 p-4 rounded-lg w-1/2 flex flex-col flex-grow min-h-[240px]">
            <div className="flex justify-around">
              <div className="items-center mb-4">
                <img src={anniversary} alt="" className="w-8 h-8 mr-2" />
                <span className="text-gray-600 text-sm">
                  MARRIAGE <br />
                  ANNIVERSARY
                </span>
              </div>
              <div className="mb-4 flex flex-col">
                <label className="block mb-1">Validity Days</label>


                <input
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  value={anniversaryDays}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setAnniversaryDays(value);
                    }
                  }}
                  className="w-full p-2 border rounded-md"
                />


              </div>
            </div>
            <div className="mt-auto flex justify-end">
              <button
                onClick={handleUpdateAniversary}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Update Card
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast />
    </div>
  );
};

export default Membershipmanagement;

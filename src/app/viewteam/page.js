'use client'
import Link from "next/link"
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { auth, db } from "../../lib/firebase/config";
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation";

const ViewTeam = () => {
    const params = useSearchParams();
    const [userGroups, setUserGroups] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [teamName, setTeamName] = useState(null);

    useEffect(() => {
        const uid = params.get("uid");  // Get userId from URL       
        if (uid) {
            fetchUserGroups(uid);
        }
    }, [params]);

    const fetchUserGroups = async (uid) => {
        // Fetch groups from db for specific user
        try {
            const q = query(collection(db, "studyGroups"), where("members", "array-contains", uid))
            const snapshot = await getDocs(q);
            const groups = [];
    
            snapshot.forEach((doc) => {
                groups.push({ id: doc.id, ...doc.data() })
            });
    
            setUserGroups(groups);
            console.log(userGroups);
        } catch (error) {
            console.log("Error getting documents", error);
            alert("Error getting documents");
        }

    }

    const handleBackButton = () => {
        setTeamName(null);
        setShowModal(false);
    }

    const handleCreateTeam = async () => {
        setShowModal(false);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            alert("You must be signed in to create a team.");
            return;
        }

        const teamData = {
            name: teamName,
            createdBy: currentUser.uid,
            members: [currentUser.uid],
            flashcardSets: [], // start with an empty array
        }

        try {
            await addDoc(collection(db, "studyGroups"), teamData);
            alert("Team created successfully!");
        } catch (error) {
            console.error("Error creating team:", error);
            alert("Failed to create team. Please try again.");
        }
        setTeamName(null);
    };


    return (
        <>
            {/* Header */}
            <div className="sticky top-0 bg-blue-100 h-14 flex items-center border-b-2 border-solid border-black px-4">
                <Link href="/">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition">
                        Back to Home
                    </button>
                </Link>
                <div className="text-lg font-bold ml-auto mr-auto">My Team</div>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 transition"
                    onClick={() => setShowModal(true)}>
                    Create New Team
                </button>
            </div>

            <div className="w-[80%] flex flex-col gap-5 mx-auto mt-10">
                {userGroups.map((group) => (
                    <div
                        className="bg-white flex flex-col w-full p-3 gap-1 rounded-lg shadow-lg shadow-black-500/50"
                        key={group.id}>
                    <h1 className="text-xl font-bold">{group.name}</h1>
                    <div className="flex w-[30%]  justify-between text-md font-normal">
                            <span>Created by {group.createdBy}</span>
                        <span  className="text-gray-300">|</span>
                            <span>{group.flashcardSets.length} Sets</span>
                    </div>
                </div>
                ))}
                
            </div>

            {/* Modal */}
            {showModal && 
                (
                <>
                    <div className="w-1/3 z-50 fixed bg-gray-300 top-[30%] left-1/3">
                        <h1 className="text-3xl text-center p-5">Create Your team</h1>
                            <Link href="/viewteam">
                                <button
                                    className="text-2xl text-gray-500 relative left-[92%] -top-16"
                                    onClick={handleBackButton}>
                                    X
                                </button>
                            </Link> 
                            <div className="mx-5">
                                <label htmlFor="team-name">TEAM NAME</label>
                                <input
                                    onChange={(e) => setTeamName(e.target.value)}
                                    id="team-name"
                                    className="bg-black text-white w-full h-10 rounded-md pl-2"
                                        placeholder="Team Name" />
                            </div>
                            
                            <div className="mt-10 bg-gray-500 flex justify-between text-white p-3 items-center">
                                <Link href="/viewteam">
                                    <button onClick={handleBackButton}>Back</button>
                                </Link>
                                <button
                                className={`bg-green-500 px-4 py-2 rounded-lg shadow-lg transition
                                        ${teamName ? "hover:bg-green-600" : "hover:bg-green-400 cursor-not-allowed"}`}
                                    onClick={handleCreateTeam}
                                    disabled={!teamName}>
                                    Create
                                </button>
                            </div>

                    </div>    
                </>    
                )
            }
        </>
    )
};

export default ViewTeam;
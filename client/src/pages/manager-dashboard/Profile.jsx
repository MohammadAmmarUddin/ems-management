import React from 'react';

const Profile = () => {
    // Simulated manager data (You can replace this with props or API data)
    const manager = {
        name: "Mohammad Ammar",
        email: "ammar@example.com",
        phone: "+880 123-456-7890",
        department: "Engineering",
        joined: "2024-02-01",
        image:
            "https://ui-avatars.com/api/?name=Mohammad+Ammar&background=random&size=256", // Placeholder avatar
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                <div className="flex flex-col items-center">
                    <img
                        src={manager.image}
                        alt="Manager Avatar"
                        className="w-32 h-32 rounded-full mb-4 object-cover shadow-lg"
                    />
                    <h2 className="text-xl font-semibold text-gray-800">{manager.name}</h2>
                    <p className="text-sm text-gray-500">{manager.department} Department</p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="font-medium">{manager.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium">{manager.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Joined On:</span>
                        <span className="font-medium">
                            {new Date(manager.joined).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;

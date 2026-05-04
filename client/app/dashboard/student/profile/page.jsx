'use client'

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-md">
      <h1 className="text-2xl mb-4">Profile</h1>

      <div className="p-6 bg-white/5 rounded-xl border">
        <p>Name: {user.firstName} {user.lastName}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.accountType}</p>
      </div>
    </div>
  );
}
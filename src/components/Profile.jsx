import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { email, name } = useAuth();
  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-xl font-semibold">Login Information</p>

        <div>
          <p className="text-xs  text-stone-500">Mobile Number</p>
          <p className="text-stone-400">Not Provided</p>
        </div>
        <hr className="border-dotted border-stone-500"></hr>
        <div>
          <p className="text-xs  text-stone-500">Email Address</p>
          <p>{email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold">Personal Information</h2>
        <div>
          <p className="text-xs  text-stone-500">Full Name</p>
          <p>{name}</p>
        </div>

        <hr className="border-dotted border-stone-500"></hr>

        <div>
          <p className="text-xs  text-stone-500">Birthdate</p>
          <p className="text-stone-400">Not Provided</p>
        </div>

        <hr className="border-dotted border-stone-500"></hr>

        <div>
          <p className="text-xs  text-stone-500">Marital Status</p>
          <p className="text-stone-400">Not Provided</p>
        </div>

        <div className="pt-10 flex items-center justify-between">
          <p className=" text-xl font-semibold">GSTIN deatils</p>
          <button className="font-light text-[#3366CC] cursor-not-allowed">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable no-undef */
import {useSelector} from 'react-redux'
import { useRef, useState , useEffect } from 'react';
import {getDownloadURL, getStorage , ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { updateUserFailure , updateUserSuccess , updateUserStart ,
   deleteUserFailure , deleteUserSuccess , deleteUserStart, signOutFailure , signOutStart , signOutUserSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from "react-router-dom"



const Profile = () => {
  const {currentUser , loading , error} = useSelector((state)=> state.user)
  const fileRef = useRef(null)
  const [file , setFile] = useState(undefined)
  const [filePerc , setFilePerc] = useState(0)
  const [fileUploadError , setFileUploadError] = useState(false)
  const [formData , setFormData] = useState({})   
  const [updateSuccess , setUpdateSuccess] = useState(false)
  const [showListingsError,setShowListingsError] = useState(false)
  const [userListings , setUserListings] = useState([])
  const dispatch = useDispatch()

  
  



     useEffect(()=>{
      if(file){
        handleFileUpload(file)
      }

     },[file])

      const handleFileUpload = (file) =>{

        const storage = getStorage(app)
        const fileNmae = new Date().getTime() + file.name;
        const storageRef = ref(storage,fileNmae);
        const uploadTask = uploadBytesResumable(storageRef , file)

       uploadTask.on('state_changed',
       (snapshot)=>{
        const progress = (snapshot.bytesTransferred / 
        snapshot.totalBytes
        ) * 100;

        setFilePerc(Math.round(progress))
       },
       
       

       (error)=>{

        setFileUploadError(true)

       },
       ()=>{

        getDownloadURL(uploadTask.snapshot.ref).then
        ((downLoadURL)=> setFormData({...formData , avatar:downLoadURL}));

       }

       );




      }



    const handleChange = (e) =>{

      // to handle changing everything

      setFormData({...formData,[e.target.id]: e.target.value})




    }

    const handleSubmit =  async (e) =>{

      e.preventDefault();

      try {
        // first we gonna dispatch a updateuserstart just start 
        dispatch(updateUserStart())
        // creating a res to my backend data to recieve a new updating info
        const res = await fetch(`/api/user/update/${currentUser._id}`,{
          method: 'POST',
          headers: {
            "Content-Type" : "application/json",
          },
          // we need to stringfy it in my body 
          body: JSON.stringify(formData)
        })

        const data = await res.json()

        if(data.success === false){
          dispatch(updateUserFailure(data.message))

          return;
        }

        dispatch(updateUserSuccess(data))
        setUpdateSuccess(true)
     
        
      } catch (error) {

        dispatch(updateUserFailure(error.message))
        
      }




    }
    

    const handleDeleteUser = async () =>{

      try {

        dispatch(deleteUserFailure());

        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        })

        const data = await res.json()

        if(data.success === false) {
          dispatch(deleteUserFailure(data.message))
          return;

        
        }

        dispatch(deleteUserSuccess(data))
        
      } catch (error) {

        dispatch(deleteUserFailure(error.message))
        
      }

    



    }
     
    const handleSignOut = async () =>{
     
      try {
        dispatch(signOutStart())
        const res = await fetch("/api/auth/signout")
        const data = await res.json();
        if (data.success === false ) {
          dispatch(deleteUserFailure(data.message))
        }

        dispatch(deleteUserSuccess(data))
        
      } catch (error) {
        dispatch(deleteUserFailure(data.message))
        
      }


    }

    

    const handleShowListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }
  
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };


    const handleListingDelete = async (listingId) =>{

      // we gonn pass a piece of pramters to make my list is knownong
       

      try {
        const res = await fetch(`/api/listing/delete/${listingId}`,{

          method: 'DELETE',
        })

        const data  = await res.json()

        if(data.success === false) {
          console.log(data.message)
          return
        }

        setUserListings((prev)=> prev.filter((listing)=> listing._id !== listingId) )

        
      } catch (error) {

        console.log(error.message)
        
      }

  



    }
  




  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/*' />
        <img onClick={()=> fileRef.current.click()} src={ formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
         <p className='text-lg self-center font-semibold'>

          {fileUploadError ? 

          (
            <span className='text-red-700'>Error Image Upload ... Try Again .. ! (image must be less than 2 mb)</span>
            
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image Successfully Uploaded ! </span>
          ) : (
            ""
          )
        }
         </p>
        <input onChange={handleChange} defaultValue={currentUser.username} type="text" placeholder='username' className='border p-3 rounded-lg' id='username' />
        <input onChange={handleChange} defaultValue={currentUser.email} type="email" placeholder='email' className='border p-3 rounded-lg' id='email' />
        <input onChange={handleChange} type="password" placeholder='password' className='border p-3 rounded-lg' id='password' />
               <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
                   {loading ? "Loading ..." : 'Update '}
               </button>

               <Link to={"/create-listing"} className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95">
                create listing
               </Link>
      </form>
      <div className='flex justify-between mt-6 font-semibold text-xl'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      

      </div>

      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User Is Updated Successfully ..." : ""}</p>

      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listings</button>
    
      <p className='text-red-700 mt-5'>{showListingsError ? "Error Showing Listings" : ""}</p>
      

      {
        userListings && 
        userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>

          {userListings.map((listing)=>(
            <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
                     <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
                         <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>
                  Delete
                </button>

                <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>

                </Link>

              </div>

            </div>

          ))}
          
        </div>
      
      }


    </div>
  );
}

export default Profile;


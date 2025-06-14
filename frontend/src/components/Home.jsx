import React from 'react'
import LeftHome from './LeftHome';
import RightHome from './RightHome';
import { useEffect , useState } from 'react';
import {useAuthStore} from '../store/useAuthStore';
import { useMatchStore } from '../store/useMatchStore';
import { useProfileStore } from '../store/useProfileStore';

const Home = ({isConnectionVisible , toggleConnectionPanel}) => {

const {authUser, fetchProfile , checkAuth} = useAuthStore();
const {getAllProfiles} = useProfileStore()
const{unSubscribeFromNewMatches , subscribeToNewMatches} = useMatchStore();

  useEffect(() => {
    fetchProfile(authUser._id);
  }, [authUser]);
  useEffect(() => {
      if (authUser && authUser._id) {
        fetchProfile(authUser._id);
      }
    }, [authUser]);

    useEffect(() => {
      authUser && subscribeToNewMatches();
      // remove this before deployement//
      return () => {
        unSubscribeFromNewMatches();
      };
    }, [subscribeToNewMatches, unSubscribeFromNewMatches , authUser]);

  return (
    <div className='w-full h-full flex scrollbar-hide overflow-none '>
        <LeftHome isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel} />
        <RightHome isConnectionVisible={isConnectionVisible}
                toggleConnectionPanel={toggleConnectionPanel}/>
    </div>
  )
}

export default Home

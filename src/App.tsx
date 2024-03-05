import React from 'react';
import useGeneralStore from './stores/generalStore';
import AuthOverlay from './components/AuthOverlay';
import EditProfileModal from './components/EditProfileModal';

const App = () => {
	const isLoginOpen = useGeneralStore((state) => state.isLoginOpen);
	const isEditProfileOpen = useGeneralStore((state) => state.isEditProfileOpen);
	return (
		<div>
			{isLoginOpen && (
				<>
					<AuthOverlay />
				</>
			)}{' '}
			{isEditProfileOpen && <EditProfileModal />}
		</div>
	);
};

export default App;

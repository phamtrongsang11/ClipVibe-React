import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../gql/graphql';
import { GET_USERS } from '../graphql/queries/GetUsers';
import MenuItem from './MenuItem';
import MenuItemFollow from './MenuItemFollow';
import { useUserStore } from '../stores/userStore';

function SideNavMain() {
	const { data, loading, fetchMore } = useQuery(GET_USERS, {});
	const [showAllUsers, setShowAllUsers] = useState(false);
	const user = useUserStore((state) => state);

	const displayedUsers = showAllUsers
		? data?.getUsers
		: data?.getUsers.slice(0, 4);

	return (
		<div
			id="SideNavMain"
			className={[
				useLocation().pathname === '/' ? 'lg:w-[310px]' : 'lg:w-[220px]',
				'fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r  overflow-auto',
			].join(' ')}
		>
			<div className="lg:w-full w-[55px] mx-auto">
				<Link to="/">
					<MenuItem
						iconString="For You"
						colorString="#F02C56"
						sizeString="30"
					/>
				</Link>
				<MenuItem
					iconString="Following"
					colorString="#000000"
					sizeString="25"
				/>
				<MenuItem iconString="LIVE" colorString="#000000" sizeString="25" />
				{displayedUsers && (
					<>
						<div className="border-b lg:ml-2 mt-2" />
						<div className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
							Suggested accounts
						</div>
						<div className="lg:hidden block pt-3" />
						<ul>
							{displayedUsers?.map(
								(u: User) =>
									u.id.toString() !== user?.id && (
										<li className="cursor-pointer" key={u.id}>
											<Link to={`/profile/${u.id}`}>
												<MenuItemFollow user={u} />
											</Link>
										</li>
									)
							)}
						</ul>
						<button
							onClick={() => setShowAllUsers(!showAllUsers)}
							className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]"
						>
							See more
						</button>
					</>
				)}
				{/* <div className="border-b lg:ml-2 mt-2" />
				<div className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
					Following accounts
				</div>
				<div className="lg:hidden block pt-3" />
				<div className="cursor-pointer">
					<ul>
						{displayedUsers?.map((user: User) => (
							<li className="cursor-pointer" key={user.id}>
								<Link to={`/profile/${user.id}`}>
									<MenuItemFollow user={user} />
								</Link>
							</li>
						))}
					</ul>
				</div>
				<button className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">
					See all
				</button> */}
				<div className="lg:block hidden border-b lg:ml-2 mt-2" />
				<div className="lg:block hidden text-[11px] text-gray-500">
					<div className="pt-4 px-2">
						About News room ClipVibe Shop Contact Careers
					</div>
					<div className="pt-4 px-2">
						<p>
							ClipVibe for Good Advertise Developers Transperancy ClipVibe
							Rewards ClipVibe Browse
						</p>
					</div>
					<div className="pt-4 px-2">2024 ClipVibe</div>
					<div className="pb-14"></div>
				</div>
			</div>
		</div>
	);
}

export default SideNavMain;

import React, { useEffect, useRef, useState } from 'react';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { AiFillHeart } from 'react-icons/ai';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import { IoIosShareAlt } from 'react-icons/io';
import { PostType } from '../gql/graphql';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GetCommentsByPostIdQuery } from '../gql/graphql';
import { GET_COMMENTS_BY_POST_ID } from '../graphql/queries/GetCommentsByPostId';
import { usePostStore } from '../stores/postStore';
import { GET_ALL_POSTS } from '../graphql/queries/GetPosts';
import { LIKE_POST } from '../graphql/mutations/LikePost';
import { useUserStore } from '../stores/userStore';
import { UNLIKE_POST } from '../graphql/mutations/UnlikePost';

function PostMain({ post }: { post: PostType }) {
	const [selectedPost, setSelectedPost] = useState<number>(0);
	const [like, setLike] = useState<boolean | null>(null);
	const video = useRef<HTMLVideoElement>(null);
	useEffect(() => {
		video.current?.play();
	});
	const { data, loading, error } = useQuery<GetCommentsByPostIdQuery>(
		GET_COMMENTS_BY_POST_ID,
		{
			variables: { postId: post.id },
		}
	);

	const navigate = useNavigate();

	const likedPosts = usePostStore((state) => state.likedPosts);
	const likePost = usePostStore((state) => state.likePost);
	const removeLike = usePostStore((state) => state.removeLike);
	const loggedInUserId = useUserStore((state) => state.id);

	const [likePostMutation] = useMutation(LIKE_POST, {
		variables: {
			postId: selectedPost,
		},

		onCompleted: (data: any) => {
			console.log('DATA', data);
		},
		refetchQueries: [
			{
				query: GET_ALL_POSTS,
				variables: {
					skip: 0,
					take: 5,
				},
			},
		],
	});

	const [removeLikeMutation] = useMutation(UNLIKE_POST, {
		variables: {
			postId: selectedPost,
		},
		refetchQueries: [
			{
				query: GET_ALL_POSTS,
				variables: {
					skip: 0,
					take: 5,
				},
			},
		],
	});

	const handleRemoveLike = async (id: number) => {
		await removeLikeMutation();
		removeLike(id);
	};

	const handleLikePost = async (id: number) => {
		await likePostMutation();
		likePost({
			id: id,
			userId: Number(loggedInUserId),
			postId: id,
		});
	};

	const isLiked = likedPosts.some((likedPost) => {
		if (!likedPost) return false;
		return likedPost.userId === Number(loggedInUserId);
	});

	useEffect(() => {
		console.log(like);
		isLiked ? handleRemoveLike(selectedPost) : handleLikePost(selectedPost);
	}, [setLike, like]);

	return (
		<div id="PostMain" className="flex gap-2 border-b py-6">
			<div className="cursor-pointer">
				<img
					className="rounded-full max-h-[60px]"
					width="60"
					src={post.user.image ?? 'https://picsum.photos/id/83/300/320'}
				/>
			</div>
			<div className="flex flex-col gap-2 pl-3 w-full px-4">
				<div className="flex items-center justify-between pb-1">
					<Link to={`/profile/${post.user.id}`}>
						<span className="font-bold hover:underline cursor-pointer">
							{post.user.fullname}
						</span>
						{/* <span className="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">
							{post.user.fullname}
						</span> */}
					</Link>

					<button className="border text-[15px] px-[21px] py-.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
						Follow
					</button>
				</div>
				<div className="text-[15px] pb-0.5 break-words md:max-w-[480px] max-w-[300px]">
					{post.text}
				</div>
				<div className="text-[14px] text-gray-500 pb-0.5">
					#fun #cool #superAwesome
				</div>
				<div className="text-[14px] pb-0.5 flex itesm-center font-semibold">
					<BsMusicNoteBeamed size="17" />
					<div className="px-1">original - Awesome </div>
					<AiFillHeart size="20" />
				</div>
				<div className="mt-2.5 flex">
					<Link to={`/post/${post.id}`}>
						<div className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl">
							<video
								ref={video}
								src={'http://localhost:3000' + post.video}
								loop
								muted
								className="rounded-xl object-cover mx-auto h-full"
							/>
							<img
								className="absolute right-2 bottom-14"
								width="90"
								src="src/assets/images/tiktok-logo-white.png"
							/>
						</div>
					</Link>
					<div className="relative mr-[75px]">
						<div className="absolute bottom-0 pl-2 gap-2">
							<button
								className="rounded-full bg-gray-200 p-2 cursor-pointer"
								onClick={() => {
									setSelectedPost(post.id);
									setLike(!isLiked);
								}}
							>
								<AiFillHeart size="25" color="#F02C56" />
							</button>
							<span className="text-xs text-[#F02C56] font-semitbold">
								{post.likes?.length}
							</span>

							{/* <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
								<IoIosShareAlt size="25" color="black" />
							</button>
							<span className="text-xs text-gray-800 font-semitbold">34</span> */}

							<button
								className="rounded-full bg-gray-200 p-2 cursor-pointer"
								onClick={() => navigate(`/post/${post.id}`)}
							>
								<IoChatbubbleEllipses size="25" color="#2c7af0" />
							</button>
							<span className="text-xs text-[#2c7af0] font-semitbold">
								{data?.getCommentsByPostId.length}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PostMain;

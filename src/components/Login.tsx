import React from 'react';
import TextInput from './TextInput';
import { LOGIN_USER } from '../graphql/mutations/Login';
import { useMutation } from '@apollo/client';
import { useUserStore } from '../stores/userStore';
import useGeneralStore from '../stores/generalStore';
import { GraphQLErrorExtensions } from 'graphql';
function Login() {
	const [loginData, setLoginData] = React.useState({
		email: '',
		password: '',
	});
	const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({});
	const setUser = useUserStore((state) => state.setUser);
	const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen);
	const [loginUser] = useMutation(LOGIN_USER, {
		onCompleted: (data) => {
			console.log('DATA', data);
		},
		variables: {
			email: loginData.email,
			password: loginData.password,
		},
	});
	const handleLogin = async () => {
		try {
			const response = await loginUser();
			setUser(response.data.login.user);
			setLoginIsOpen(false);
		} catch (error: any) {
			console.log('ERROR', error);
			if (error && error.graphQLErrors && error.graphQLErrors[0].extensions) {
				const validationErrors = error.graphQLErrors[0].extensions;
				setErrors(validationErrors);
			}
		}
	};

	return (
		<>
			<div className="text-center text-[28px] mb-4 font-bold">Login</div>

			<div className="px-6 pb-2">
				<TextInput
					max={64}
					placeHolder="Enter your email address"
					onChange={(e) =>
						setLoginData({ ...loginData, email: e.target.value })
					}
					inputType="email"
					autoFocus={true}
					error={errors.email as string}
				/>
			</div>
			<div className="px-6 pb-2">
				<TextInput
					autoFocus={false}
					max={64}
					onChange={(e) =>
						setLoginData({ ...loginData, password: e.target.value })
					}
					placeHolder="Password"
					inputType="password"
					error={errors.password as string}
				/>
			</div>
			<div className="flex justify-center items-center">
				<span className="text-red-500 text-[14px] font-semibold">
					{errors.invalidCredentials as string}
				</span>
			</div>
			<div className="px-6 text-[12px] text-gray-600">Forgot password?</div>
			<div className="px-6 mt-6">
				<button
					onClick={handleLogin}
					disabled={!loginData.email || !loginData.password}
					className={[
						'w-full text-[17px] font-semibold text-white py-3 rounded-sm',
						!loginData.email || !loginData.password
							? 'bg-gray-200'
							: 'bg-[#F02C56]',
					].join(' ')}
				>
					Login
				</button>
			</div>
		</>
	);
}

export default Login;

import React, { ChangeEvent, useEffect } from 'react';

const TextInput = ({
	placeHolder,
	inputType,
	max,
	error,
	autoFocus,
	onChange,
	value,
}: {
	placeHolder: string;
	inputType: string;
	max: number;
	autoFocus: boolean;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	value?: string;
	error?: string;
}) => {
	useEffect(() => {
		if (autoFocus) {
			const input = document.getElementById('input - ${placeHolder}');
			input?.focus();
		}
	}, [autoFocus, placeHolder]);
	return (
		<div>
			<input
				id={`inout-${placeHolder}`}
				value={value}
				placeholder={placeHolder}
				type={inputType}
				autoComplete="off"
				maxLength={max}
				onChange={onChange}
				className="block w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
			/>
			{error && (
				<span className="text-red-500 text-[14px] font-semibold">{error}</span>
			)}
		</div>
	);
};

export default TextInput;

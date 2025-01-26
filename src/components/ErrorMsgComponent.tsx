import { ErrorMsg } from "@/interfaces/ErrorMsg";
import React from "react";

const ErrorMsgComponent = (props: { errorMsg: ErrorMsg }) => {
	return (
		<div>
			<h1>ERROR: </h1>
			<h2>{props.errorMsg.errType}</h2>
			<p>{props.errorMsg.errMsg}</p>
		</div>
	);
};

export default ErrorMsgComponent;

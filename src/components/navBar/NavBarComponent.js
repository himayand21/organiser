import React from 'react';

export const NavBarComponent = (props) => {
	const {name} = props;
	return (
		<nav className="navbar">
			<div className="brand-name">Organiser</div>
            <div className="greeting">{`Hi ${name}`}</div>
        </nav>
	)
};
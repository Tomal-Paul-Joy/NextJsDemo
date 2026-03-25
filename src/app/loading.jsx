import Logo from '@/Components/Logo';
import React from 'react';

const loading = () => {
    return (
        <div className="animate-ping">
            <Logo></Logo>
        </div>
    );
};

export default loading;
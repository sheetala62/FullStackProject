import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
                <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-primary-300 opacity-20"></div>
            </div>
        </div>
    );
};

export default Loader;
